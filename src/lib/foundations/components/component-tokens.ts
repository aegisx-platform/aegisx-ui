/**
 * AegisX UI - Component Design Tokens (Layer 3)
 *
 * Component-level tokens that reference semantic tokens (Layer 2).
 * These provide a consistent API for styling individual components
 * while allowing theme customization via CSS custom properties.
 *
 * Token hierarchy:
 *   Layer 1 (Primitive) -> Layer 2 (Semantic) -> Layer 3 (Component)
 *
 * All values use var(--ax-*) to reference semantic tokens defined
 * in the theme SCSS files (_light.scss, _dark.scss).
 *
 * @packageDocumentation
 */

// ============================================================
// Types
// ============================================================

/**
 * Size variants for components
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Button variant keys
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * Badge variant keys
 */
export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

/**
 * Size-specific token shape for buttons and inputs
 */
export interface SizeTokens {
  height: string;
  paddingX: string;
  fontSize: string;
}

/**
 * Button state tokens for a single variant
 */
export interface ButtonVariantTokens {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  activeBg: string;
  disabledBg?: string;
  disabledText?: string;
}

/**
 * Complete button token set
 */
export interface ButtonTokens {
  primary: ButtonVariantTokens;
  secondary: ButtonVariantTokens;
  ghost: Pick<ButtonVariantTokens, 'bg' | 'text' | 'hoverBg'>;
  sizes: Record<ComponentSize, SizeTokens>;
}

/**
 * Input/Form field tokens
 */
export interface InputTokens {
  bg: string;
  text: string;
  placeholder: string;
  border: string;
  focusBorder: string;
  focusRing: string;
  errorBorder: string;
  errorText: string;
  disabledBg: string;
  disabledText: string;
  sizes: Record<'sm' | 'md', SizeTokens>;
}

/**
 * Card sub-section tokens
 */
export interface CardSectionTokens {
  bg: string;
  padding: string;
  borderBottom?: string;
  borderTop?: string;
}

/**
 * Complete card token set
 */
export interface CardTokens {
  bg: string;
  border: string;
  shadow: string;
  hoverShadow: string;
  radius: string;
  header: CardSectionTokens;
  body: Pick<CardSectionTokens, 'padding'>;
  footer: CardSectionTokens;
}

/**
 * Badge variant color tokens
 */
export interface BadgeVariantTokens {
  bg: string;
  text: string;
  border: string;
}

/**
 * Complete badge token set
 */
export interface BadgeTokens {
  fontSize: string;
  fontWeight: string;
  borderRadius: string;
  variants: Record<BadgeVariant, BadgeVariantTokens>;
}

/**
 * Dialog sub-section tokens
 */
export interface DialogSectionTokens {
  padding: string;
  fontSize?: string;
  fontWeight?: string;
  borderTop?: string;
}

/**
 * Complete dialog/modal token set
 */
export interface DialogTokens {
  bg: string;
  border: string;
  shadow: string;
  radius: string;
  overlayBg: string;
  header: DialogSectionTokens;
  body: Pick<DialogSectionTokens, 'padding'>;
  footer: DialogSectionTokens;
}

/**
 * All component tokens combined
 */
export interface ComponentTokens {
  button: ButtonTokens;
  input: InputTokens;
  card: CardTokens;
  badge: BadgeTokens;
  dialog: DialogTokens;
}

// ============================================================
// Token Values
// ============================================================

/**
 * Button component tokens
 *
 * References semantic color/spacing tokens via CSS custom properties.
 */
export const buttonTokens: ButtonTokens = {
  primary: {
    bg: 'var(--ax-primary)',
    text: 'var(--ax-primary-contrast)',
    border: 'var(--ax-primary)',
    hoverBg: 'var(--ax-primary-dark)',
    activeBg: 'var(--ax-brand-emphasis)',
    disabledBg: 'var(--ax-gray-200)',
    disabledText: 'var(--ax-text-disabled)',
  },
  secondary: {
    bg: 'var(--ax-background-default)',
    text: 'var(--ax-text-primary)',
    border: 'var(--ax-border-default)',
    hoverBg: 'var(--ax-background-subtle)',
    activeBg: 'var(--ax-background-muted)',
  },
  ghost: {
    bg: 'transparent',
    text: 'var(--ax-text-primary)',
    hoverBg: 'var(--ax-background-subtle)',
  },
  sizes: {
    sm: { height: '2rem', paddingX: '0.75rem', fontSize: '0.75rem' },
    md: { height: '2.5rem', paddingX: '1rem', fontSize: '0.875rem' },
    lg: { height: '3rem', paddingX: '1.5rem', fontSize: '1rem' },
  },
};

/**
 * Input/Form component tokens
 */
export const inputTokens: InputTokens = {
  bg: 'var(--ax-background-default)',
  text: 'var(--ax-text-primary)',
  placeholder: 'var(--ax-text-subtle)',
  border: 'var(--ax-border-default)',
  focusBorder: 'var(--ax-primary)',
  focusRing: 'var(--ax-brand-faint)',
  errorBorder: 'var(--ax-error-default)',
  errorText: 'var(--ax-error-default)',
  disabledBg: 'var(--ax-background-muted)',
  disabledText: 'var(--ax-text-disabled)',
  sizes: {
    sm: { height: '2rem', paddingX: '0.5rem', fontSize: '0.75rem' },
    md: { height: '2.5rem', paddingX: '0.75rem', fontSize: '0.875rem' },
  },
};

/**
 * Card component tokens
 */
export const cardTokens: CardTokens = {
  bg: 'var(--ax-background-default)',
  border: 'var(--ax-border-default)',
  shadow: 'var(--ax-shadow-sm)',
  hoverShadow: 'var(--ax-shadow-md)',
  radius: '0.5rem',
  header: {
    bg: 'var(--ax-background-muted)',
    borderBottom: 'var(--ax-border-default)',
    padding: '1rem 1.5rem',
  },
  body: {
    padding: '1.5rem',
  },
  footer: {
    bg: 'var(--ax-background-muted)',
    borderTop: 'var(--ax-border-default)',
    padding: '1rem 1.5rem',
  },
};

/**
 * Badge component tokens
 */
export const badgeTokens: BadgeTokens = {
  fontSize: '0.75rem',
  fontWeight: '500',
  borderRadius: '9999px',
  variants: {
    success: {
      bg: 'var(--ax-success-faint)',
      text: 'var(--ax-success-emphasis)',
      border: 'var(--ax-success-border)',
    },
    warning: {
      bg: 'var(--ax-warning-faint)',
      text: 'var(--ax-warning-emphasis)',
      border: 'var(--ax-warning-border)',
    },
    error: {
      bg: 'var(--ax-error-faint)',
      text: 'var(--ax-error-emphasis)',
      border: 'var(--ax-error-border)',
    },
    info: {
      bg: 'var(--ax-info-faint)',
      text: 'var(--ax-info-emphasis)',
      border: 'var(--ax-info-border)',
    },
    neutral: {
      bg: 'var(--ax-background-subtle)',
      text: 'var(--ax-text-secondary)',
      border: 'var(--ax-border-default)',
    },
  },
};

/**
 * Dialog/Modal component tokens
 */
export const dialogTokens: DialogTokens = {
  bg: 'var(--ax-background-default)',
  border: 'var(--ax-border-default)',
  shadow: 'var(--ax-shadow-lg)',
  radius: '1rem',
  overlayBg: 'rgba(0, 0, 0, 0.5)',
  header: {
    fontSize: '1.25rem',
    fontWeight: '600',
    padding: '1.5rem',
  },
  body: {
    padding: '0 1.5rem 1.5rem',
  },
  footer: {
    padding: '1rem 1.5rem',
    borderTop: 'var(--ax-border-default)',
  },
};

/**
 * All component tokens
 */
export const componentTokens: ComponentTokens = {
  button: buttonTokens,
  input: inputTokens,
  card: cardTokens,
  badge: badgeTokens,
  dialog: dialogTokens,
};

// ============================================================
// CSS Variable Generator
// ============================================================

/**
 * Generate CSS custom properties for component tokens.
 *
 * Produces flat key-value pairs like:
 *   --ax-button-primary-bg: var(--ax-primary)
 *   --ax-card-header-padding: 1rem 1.5rem
 *
 * @param tokens - The component tokens object
 * @param prefix - CSS variable prefix (default: 'ax')
 */
export function generateComponentCSSVariables(
  tokens: ComponentTokens,
  prefix = 'ax',
): Record<string, string> {
  const variables: Record<string, string> = {};

  // Helper to flatten nested objects into CSS variable names
  function flatten(obj: Record<string, unknown>, path: string): void {
    for (const [key, value] of Object.entries(obj)) {
      const varName = `--${prefix}-${path}-${key}`;
      if (typeof value === 'string') {
        variables[varName] = value;
      } else if (typeof value === 'object' && value !== null) {
        flatten(value as Record<string, unknown>, `${path}-${key}`);
      }
    }
  }

  flatten(tokens as unknown as Record<string, unknown>, '');

  return variables;
}
