export const hfImageModels = [
  "black-forest-labs/FLUX.1-Kontext-dev",
  "black-forest-labs/FLUX.2-dev",
];

export type HfImageModel = (typeof hfImageModels)[number];

export const hfImageModelLabels: Record<HfImageModel, string> = {
  "black-forest-labs/FLUX.1-Kontext-dev": "FLUX.1 Kontext Dev (recommended)",
  "black-forest-labs/FLUX.2-dev": "FLUX.2 Dev",
};