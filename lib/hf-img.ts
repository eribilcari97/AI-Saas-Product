import { hfProvider } from "./hfProvider";
import type { HfImageModel } from "./HfImageModel";

export async function generateImage({
  model,
  image,
  prompt,
}: {
  model: HfImageModel;
  image: Blob; 
  prompt: string;
}) {
  if (!hfProvider) {
    throw new Error("Hugging Face API not configured");
  }

  const result = await hfProvider.imageToImage({
    model,
    inputs: image,
    parameters: {
      prompt,
      strength: 0.7, 
    },
  });

  return result;
}