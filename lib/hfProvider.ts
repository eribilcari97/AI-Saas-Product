import { InferenceClient } from "@huggingface/inference";

const apiKey = process.env.HUGGINGFACE_API_KEY;

export const hfProvider = apiKey
  ? new InferenceClient(apiKey)
  : null;