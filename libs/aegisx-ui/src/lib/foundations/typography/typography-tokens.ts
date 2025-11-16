/**
 * AegisX UI - Typography Design Tokens
 *
 * Comprehensive typography system based on Material Design 3 and Tailwind CSS.
 *
 * @packageDocumentation
 */

/**
 * Font family categories
 */
export type FontFamily = 'sans' | 'serif' | 'mono';

/**
 * Font weight values
 */
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Font size scale
 */
export type FontSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';

/**
 * Line height values
 */
export type LineHeight = 'tight' | 'normal' | 'relaxed';

/**
 * Material 3 Typography roles
 */
export type M3TypographyRole =
  | 'display-large'
  | 'display-medium'
  | 'display-small'
  | 'headline-large'
  | 'headline-medium'
  | 'headline-small'
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small';

/**
 * Typography style definition
 */
export interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing?: string;
}

/**
 * Complete typography token system
 */
export interface TypographyTokens {
  // Font Families
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };

  // Font Sizes (Tailwind-based)
  fontSize: {
    xs: string; // 12px / 0.75rem
    sm: string; // 14px / 0.875rem
    base: string; // 16px / 1rem
    lg: string; // 18px / 1.125rem
    xl: string; // 20px / 1.25rem
    '2xl': string; // 24px / 1.5rem
    '3xl': string; // 30px / 1.875rem
    '4xl': string; // 36px / 2.25rem
  };

  // Font Weights
  fontWeight: {
    normal: number; // 400
    medium: number; // 500
    semibold: number; // 600
    bold: number; // 700
  };

  // Line Heights
  lineHeight: {
    tight: string; // 1.25
    normal: string; // 1.5
    relaxed: string; // 1.75
  };

  // Letter Spacing
  letterSpacing: {
    tighter: string; // -0.05em
    tight: string; // -0.025em
    normal: string; // 0
    wide: string; // 0.025em
    wider: string; // 0.05em
  };

  // Material 3 Typography Roles
  m3: {
    display: {
      large: TypographyStyle;
      medium: TypographyStyle;
      small: TypographyStyle;
    };
    headline: {
      large: TypographyStyle;
      medium: TypographyStyle;
      small: TypographyStyle;
    };
    title: {
      large: TypographyStyle;
      medium: TypographyStyle;
      small: TypographyStyle;
    };
    body: {
      large: TypographyStyle;
      medium: TypographyStyle;
      small: TypographyStyle;
    };
    label: {
      large: TypographyStyle;
      medium: TypographyStyle;
      small: TypographyStyle;
    };
  };
}

/**
 * System font stack for sans-serif
 */
const systemFontStack = [
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans"',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
].join(', ');

/**
 * Default typography tokens
 */
export const typographyTokens: TypographyTokens = {
  // Font Families
  fontFamily: {
    sans: systemFontStack,
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  },

  // Font Sizes (matching Tailwind)
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },

  // Material 3 Typography Scale
  m3: {
    // Display - Largest text on screen, reserved for short, important text
    display: {
      large: {
        fontFamily: systemFontStack,
        fontSize: '3.5625rem', // 57px
        fontWeight: 400,
        lineHeight: '4rem', // 64px
        letterSpacing: '-0.25px',
      },
      medium: {
        fontFamily: systemFontStack,
        fontSize: '2.8125rem', // 45px
        fontWeight: 400,
        lineHeight: '3.25rem', // 52px
        letterSpacing: '0',
      },
      small: {
        fontFamily: systemFontStack,
        fontSize: '2.25rem', // 36px
        fontWeight: 400,
        lineHeight: '2.75rem', // 44px
        letterSpacing: '0',
      },
    },

    // Headline - High-emphasis text for important areas
    headline: {
      large: {
        fontFamily: systemFontStack,
        fontSize: '2rem', // 32px
        fontWeight: 400,
        lineHeight: '2.5rem', // 40px
        letterSpacing: '0',
      },
      medium: {
        fontFamily: systemFontStack,
        fontSize: '1.75rem', // 28px
        fontWeight: 400,
        lineHeight: '2.25rem', // 36px
        letterSpacing: '0',
      },
      small: {
        fontFamily: systemFontStack,
        fontSize: '1.5rem', // 24px
        fontWeight: 400,
        lineHeight: '2rem', // 32px
        letterSpacing: '0',
      },
    },

    // Title - Medium-emphasis text for section titles
    title: {
      large: {
        fontFamily: systemFontStack,
        fontSize: '1.375rem', // 22px
        fontWeight: 400,
        lineHeight: '1.75rem', // 28px
        letterSpacing: '0',
      },
      medium: {
        fontFamily: systemFontStack,
        fontSize: '1rem', // 16px
        fontWeight: 500,
        lineHeight: '1.5rem', // 24px
        letterSpacing: '0.15px',
      },
      small: {
        fontFamily: systemFontStack,
        fontSize: '0.875rem', // 14px
        fontWeight: 500,
        lineHeight: '1.25rem', // 20px
        letterSpacing: '0.1px',
      },
    },

    // Body - Default text for paragraphs and content
    body: {
      large: {
        fontFamily: systemFontStack,
        fontSize: '1rem', // 16px
        fontWeight: 400,
        lineHeight: '1.5rem', // 24px
        letterSpacing: '0.5px',
      },
      medium: {
        fontFamily: systemFontStack,
        fontSize: '0.875rem', // 14px
        fontWeight: 400,
        lineHeight: '1.25rem', // 20px
        letterSpacing: '0.25px',
      },
      small: {
        fontFamily: systemFontStack,
        fontSize: '0.75rem', // 12px
        fontWeight: 400,
        lineHeight: '1rem', // 16px
        letterSpacing: '0.4px',
      },
    },

    // Label - Text for buttons, tabs, labels
    label: {
      large: {
        fontFamily: systemFontStack,
        fontSize: '0.875rem', // 14px
        fontWeight: 500,
        lineHeight: '1.25rem', // 20px
        letterSpacing: '0.1px',
      },
      medium: {
        fontFamily: systemFontStack,
        fontSize: '0.75rem', // 12px
        fontWeight: 500,
        lineHeight: '1rem', // 16px
        letterSpacing: '0.5px',
      },
      small: {
        fontFamily: systemFontStack,
        fontSize: '0.6875rem', // 11px
        fontWeight: 500,
        lineHeight: '1rem', // 16px
        letterSpacing: '0.5px',
      },
    },
  },
};

/**
 * Generate CSS custom properties for typography tokens
 */
export function generateTypographyCSSVariables(
  tokens: TypographyTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  // Font families
  Object.entries(tokens.fontFamily).forEach(([key, value]) => {
    variables[`--${prefix}-font-${key}`] = value;
  });

  // Font sizes
  Object.entries(tokens.fontSize).forEach(([key, value]) => {
    variables[`--${prefix}-text-${key}`] = value;
  });

  // Font weights
  Object.entries(tokens.fontWeight).forEach(([key, value]) => {
    variables[`--${prefix}-font-weight-${key}`] = String(value);
  });

  // Line heights
  Object.entries(tokens.lineHeight).forEach(([key, value]) => {
    variables[`--${prefix}-leading-${key}`] = value;
  });

  // Letter spacing
  Object.entries(tokens.letterSpacing).forEach(([key, value]) => {
    variables[`--${prefix}-tracking-${key}`] = value;
  });

  // Material 3 Typography (flattened)
  const m3Roles: Array<keyof typeof tokens.m3> = [
    'display',
    'headline',
    'title',
    'body',
    'label',
  ];
  m3Roles.forEach((role) => {
    const sizes = tokens.m3[role] as Record<string, TypographyStyle>;
    Object.entries(sizes).forEach(([size, style]) => {
      const varName = `--${prefix}-${role}-${size}`;
      variables[`${varName}-font`] = style.fontFamily;
      variables[`${varName}-size`] = style.fontSize;
      variables[`${varName}-weight`] = String(style.fontWeight);
      variables[`${varName}-line-height`] = style.lineHeight;
      if (style.letterSpacing) {
        variables[`${varName}-tracking`] = style.letterSpacing;
      }
    });
  });

  return variables;
}

/**
 * Typography utility functions
 */
export const typographyUtils = {
  /**
   * Get M3 typography style
   */
  getM3Style(role: M3TypographyRole): TypographyStyle {
    const [category, size] = role.split('-') as [
      keyof typeof typographyTokens.m3,
      string,
    ];
    return typographyTokens.m3[category][
      size as keyof (typeof typographyTokens.m3)[typeof category]
    ];
  },

  /**
   * Convert font size to pixels
   */
  remToPixels(rem: string, baseFontSize = 16): number {
    const value = parseFloat(rem.replace('rem', ''));
    return value * baseFontSize;
  },

  /**
   * Generate responsive font size
   */
  responsiveFontSize(
    min: number,
    max: number,
    minVw = 320,
    maxVw = 1280,
  ): string {
    const slope = (max - min) / (maxVw - minVw);
    const yIntercept = min - slope * minVw;
    return `clamp(${min}px, calc(${yIntercept}px + ${slope * 100}vw), ${max}px)`;
  },
};
