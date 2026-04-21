import { dark } from "@clerk/themes";

/**

 * @see https://clerk.com/docs/guides/customizing-clerk/appearance-prop/themes
 * @see https://clerk.com/docs/guides/customizing-clerk/appearance-prop/variables
 */
export const clerkPricingAppearance = {
  theme: dark,
  variables: {
    colorPrimary: "oklch(0.48 0.18 265)",
    colorPrimaryForeground: "oklch(0.99 0.01 250)",
    colorBackground: "oklch(0.22 0.072 272)",
    colorForeground: "oklch(0.90 0.038 240)",
    colorInput: "oklch(0.28 0.064 272)",
    colorInputForeground: "oklch(0.90 0.038 240)",
    colorNeutral: "oklch(0.58 0.08 258)",
  },
} as const;