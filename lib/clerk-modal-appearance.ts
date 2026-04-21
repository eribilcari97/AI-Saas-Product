import { dark } from "@clerk/themes";

/**

 * @see https://clerk.com/docs/guides/customizing-clerk/appearance-prop/themes
 * @see https://clerk.com/docs/guides/customizing-clerk/appearance-prop/variables
 */
export const clerkModalAppearance = {
  theme: dark,
  variables: {
  
    colorPrimary: "oklch(0.48 0.18 265)",
    colorPrimaryForeground: "oklch(0.88 0.13 88)",

    
    colorBackground: "oklch(0.22 0.072 272)",
    colorForeground: "oklch(0.90 0.038 240)",

  
    colorCard: "oklch(0.22 0.072 272)",
    colorCardForeground: "oklch(0.90 0.038 240)",

   
    colorInput: "oklch(0.28 0.064 272)",
    colorInputForeground: "oklch(0.90 0.038 240)",

    colorSecondary: "oklch(0.28 0.064 272)",
    colorSecondaryForeground: "oklch(0.90 0.038 240)",

   
    colorMuted: "oklch(0.21 0.060 270)",
    colorMutedForeground: "oklch(0.58 0.08 258)",

   
    colorAccent: "oklch(0.78 0.09 228)",
    colorAccentForeground: "oklch(0.176 0.058 268)",

    
    colorBorder: "oklch(0.28 0.064 272)",

    colorRing: "oklch(0.88 0.13 88)",

    
    fontFamily: "Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

    borderRadius: "0.625rem",
    borderRadiusSmall: "0.375rem",
    borderRadiusLarge: "0.875rem",
  },
  elements: {
    formButtonPrimary: {
      backgroundColor: "oklch(0.48 0.18 265)",
      color: "oklch(0.88 0.13 88)",
      "&:hover": {
        backgroundColor: "oklch(0.44 0.18 265)",
      },
      "&:active": {
        backgroundColor: "oklch(0.40 0.18 265)",
      },
    },
    formButtonReset: {
      backgroundColor: "oklch(0.28 0.064 272)",
      color: "oklch(0.90 0.038 240)",
      borderColor: "oklch(0.28 0.064 272)",
      "&:hover": {
        backgroundColor: "oklch(0.32 0.064 272)",
      },
    },
    card: {
      backgroundColor: "oklch(0.22 0.072 272)",
      borderColor: "oklch(0.28 0.064 272)",
    },
    headerTitle: {
      color: "oklch(0.90 0.038 240)",
      fontFamily: "Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    headerSubtitle: {
      color: "oklch(0.58 0.08 258)",
    },
    socialButtonsBlockButton: {
      backgroundColor: "oklch(0.28 0.064 272)",
      color: "oklch(0.90 0.038 240)",
      borderColor: "oklch(0.28 0.064 272)",
      "&:hover": {
        backgroundColor: "oklch(0.32 0.064 272)",
      },
    },
    formFieldInput: {
      backgroundColor: "oklch(0.28 0.064 272)",
      color: "oklch(0.90 0.038 240)",
      borderColor: "oklch(0.28 0.064 272)",
      "&:focus": {
        borderColor: "oklch(0.48 0.18 265)",
        boxShadow: "0 0 0 1px oklch(0.48 0.18 265)",
      },
    },
    footerActionLink: {
      color: "oklch(0.78 0.09 228)",
      "&:hover": {
        color: "oklch(0.72 0.09 228)",
      },
    },
  },
} as const;