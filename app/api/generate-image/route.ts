import { countGenerationsSince, createGeneration, utcMonthStart } from "@/db/generations";
import { getMonthlyGenerationLimit } from "@/lib/generation-quota";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import sharp from "sharp";

import * as Sentry from "@sentry/nextjs";
import { hfProvider } from "@/lib/hfProvider";
import { ACCEPTED_SOURCE_IMAGE_MIME_TYPES } from "@/lib/constants";
import { getStylePreset } from "@/lib/style-presets";

import { uploadBufferToImageKit } from "@/lib/imagekit";

export const runtime = "nodejs";

type EditImageSize = "1024x1024" | "1536x1024" | "1024x1536";

type GenerateImageRequest = {
  sourceImageUrl?: string;
  sourceMimeType?: string;
  originalFileName?: string;
  styleSlug?: string;
  model?: string;
};

async function inferImageSize(imageBuffer: Buffer): Promise<EditImageSize> {
  try {
    const metadata = await sharp(imageBuffer).metadata();

    if (!metadata.width || !metadata.height) return "1024x1024";

    const aspectRatio = metadata.width / metadata.height;

    if (aspectRatio > 1.08) return "1536x1024";
    if (aspectRatio < 0.92) return "1024x1536";
    return "1024x1024";
  } catch {
    return "1024x1024";
  }
}

/** Maps size string to pixel dimensions for HF */
function sizeToPixels(size: EditImageSize): { width: number; height: number } {
  const [w, h] = size.split("x").map(Number);
  return { width: w, height: h };
}

export async function POST(request: Request) {
  const { userId, has } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const monthlyLimit = getMonthlyGenerationLimit(has);
  const usedThisMonth = await countGenerationsSince(userId, utcMonthStart());

  if (usedThisMonth >= monthlyLimit) {
    Sentry.logger.warn("generation.quota_exceeded", {
      limit: monthlyLimit,
      used: usedThisMonth,
    });

    return NextResponse.json(
      {
        error: `Monthly generation limit reached (${monthlyLimit} images). Upgrade your plan or try again next month.`,
        code: "QUOTA_EXCEEDED" as const,
        limit: monthlyLimit,
        used: usedThisMonth,
      },
      { status: 429 },
    );
  }

  if (!hfProvider) {
    return NextResponse.json({ error: "Missing Hugging Face API key." }, { status: 500 });
  }

  const body = (await request.json()) as GenerateImageRequest;
  const { model, originalFileName, sourceImageUrl, sourceMimeType, styleSlug } = body;

  if (!sourceImageUrl) {
    return NextResponse.json({ error: "Please upload an image first." }, { status: 400 });
  }

  if (typeof sourceMimeType !== "string" || !ACCEPTED_SOURCE_IMAGE_MIME_TYPES.has(sourceMimeType)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, and WEBP files are supported." },
      { status: 400 },
    );
  }

  if (typeof styleSlug !== "string") {
    return NextResponse.json({ error: "Please choose a style." }, { status: 400 });
  }

  if (!model) {
    return NextResponse.json({ error: "Please choose a model." }, { status: 400 });
  }

  const preset = getStylePreset(styleSlug);
  if (!preset) {
    return NextResponse.json({ error: "Unknown style preset." }, { status: 400 });
  }

  const imageResponse = await fetch(sourceImageUrl);
  if (!imageResponse.ok) {
    return NextResponse.json(
      { error: "Could not fetch the uploaded source image." },
      { status: 404 },
    );
  }

  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
  const imageSize = await inferImageSize(imageBuffer);
  const { width, height } = sizeToPixels(imageSize);

  const prompt = [
    preset.prompt,
    "Do not add extra people, extra limbs, duplicate subjects, or change the overall camera angle.",
  ].join("\n\n");

  try {
  const resultBlob = await Sentry.startSpan(
  {
    name: `image edit ${model}`,
    op: "gen_ai.request",
    attributes: {
      "gen_ai.request.model": model,
      "gen_ai.operation.name": "request",
      "gen_ai.request.messages": JSON.stringify([
        { role: "user", content: prompt },
        { role: "user", content: "[source image attachment omitted]" },
      ]),
    },
  },
  async (span) => {
    const imageBlob = new Blob([imageBuffer], { type: sourceMimeType });

    const out = await hfProvider!.imageToImage({
      model,
      provider: "fal-ai",   // ← fal-ai has confirmed img2img support
      inputs: imageBlob,
      parameters: {
        prompt,
        negative_prompt:
          "extra limbs, extra people, duplicate subjects, blurry, low quality, distorted",
        strength: 0.75,
        num_inference_steps: 28,
      },
    });

    span.setAttribute("gen_ai.response.text", "[image generated]");
    return out;
  },
);


    // Convert Blob → Buffer → base64
    const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());
    const imageBase64 = resultBuffer.toString("base64");

    const { url: resultImageUrl } = await uploadBufferToImageKit({
      buffer: resultBuffer,
      fileName: `${preset.slug}-result.png`,
      folder: `/users/${userId}/results`,
      mimeType: "image/png",
    });

    const savedGeneration = await createGeneration({
      clerkUserId: userId,
      originalFileName: typeof originalFileName === "string" ? originalFileName : null,
      sourceImageUrl,
      resultImageUrl,
      styleSlug: preset.slug,
      styleLabel: preset.label,
      model,
      promptUsed: prompt,
    });

    Sentry.logger.info("generation.completed", {
      generationId: savedGeneration.id,
      styleSlug: preset.slug,
      model,
    });

    return NextResponse.json({
      imageBase64,
      mimeType: "image/png",
      promptUsed: prompt,
      style: { slug: preset.slug, label: preset.label },
      model,
      savedGeneration,
    });
  } catch (error) {
    console.error("generate-image route failed", error);

    // HF SDK throws plain errors with a status field
    if (error instanceof Error) {
      const status = (error as Error & { status?: number }).status;
      return NextResponse.json(
        { error: error.message || "Image generation failed. Please try again." },
        { status: status ?? 500 },
      );
    }

    return NextResponse.json(
      { error: "Image generation failed. Please try again." },
      { status: 500 },
    );
  }
}