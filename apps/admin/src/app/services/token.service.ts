import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  DesignToken,
  TokenCategory,
  TokenGroup,
  ComponentToken,
  ComponentTokenUsage,
  ThemedTokenValue,
  SemanticColorScale,
} from '../types/docs.types';

/**
 * Token Service
 *
 * Provides access to design token metadata and computed values.
 * Supports theme-aware value computation and component-token mapping.
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly document = inject(DOCUMENT);

  // ============================================
  // TOKEN DEFINITIONS
  // ============================================

  /**
   * All semantic color scales with 6 variants
   */
  readonly semanticColors: SemanticColorScale[] = [
    {
      name: 'brand',
      variants: {
        faint: '--ax-brand-faint',
        muted: '--ax-brand-muted',
        subtle: '--ax-brand-subtle',
        default: '--ax-brand-default',
        emphasis: '--ax-brand-emphasis',
        inverted: '--ax-brand-inverted',
      },
    },
    {
      name: 'success',
      variants: {
        faint: '--ax-success-faint',
        muted: '--ax-success-muted',
        subtle: '--ax-success-subtle',
        default: '--ax-success-default',
        emphasis: '--ax-success-emphasis',
        inverted: '--ax-success-inverted',
      },
    },
    {
      name: 'warning',
      variants: {
        faint: '--ax-warning-faint',
        muted: '--ax-warning-muted',
        subtle: '--ax-warning-subtle',
        default: '--ax-warning-default',
        emphasis: '--ax-warning-emphasis',
        inverted: '--ax-warning-inverted',
      },
    },
    {
      name: 'error',
      variants: {
        faint: '--ax-error-faint',
        muted: '--ax-error-muted',
        subtle: '--ax-error-subtle',
        default: '--ax-error-default',
        emphasis: '--ax-error-emphasis',
        inverted: '--ax-error-inverted',
      },
    },
    {
      name: 'info',
      variants: {
        faint: '--ax-info-faint',
        muted: '--ax-info-muted',
        subtle: '--ax-info-subtle',
        default: '--ax-info-default',
        emphasis: '--ax-info-emphasis',
        inverted: '--ax-info-inverted',
      },
    },
  ];

  /**
   * Typography tokens
   */
  readonly typographyTokens: TokenGroup = {
    name: 'Typography',
    description: 'Font sizes, weights, and line heights',
    tokens: [
      {
        name: 'Text XS',
        cssVar: '--ax-text-xs',
        value: '0.75rem',
        category: 'typography',
        tailwindClass: 'text-xs',
      },
      {
        name: 'Text SM',
        cssVar: '--ax-text-sm',
        value: '0.875rem',
        category: 'typography',
        tailwindClass: 'text-sm',
      },
      {
        name: 'Text Base',
        cssVar: '--ax-text-base',
        value: '1rem',
        category: 'typography',
        tailwindClass: 'text-base',
      },
      {
        name: 'Text LG',
        cssVar: '--ax-text-lg',
        value: '1.125rem',
        category: 'typography',
        tailwindClass: 'text-lg',
      },
      {
        name: 'Text XL',
        cssVar: '--ax-text-xl',
        value: '1.25rem',
        category: 'typography',
        tailwindClass: 'text-xl',
      },
      {
        name: 'Text 2XL',
        cssVar: '--ax-text-2xl',
        value: '1.5rem',
        category: 'typography',
        tailwindClass: 'text-2xl',
      },
      {
        name: 'Text 3XL',
        cssVar: '--ax-text-3xl',
        value: '1.875rem',
        category: 'typography',
        tailwindClass: 'text-3xl',
      },
      {
        name: 'Text 4XL',
        cssVar: '--ax-text-4xl',
        value: '2.25rem',
        category: 'typography',
        tailwindClass: 'text-4xl',
      },
    ],
  };

  /**
   * Spacing tokens
   */
  readonly spacingTokens: TokenGroup = {
    name: 'Spacing',
    description: '8px grid system for consistent spacing',
    tokens: [
      {
        name: 'Spacing XS',
        cssVar: '--ax-spacing-xs',
        value: '0.25rem',
        category: 'spacing',
        description: '4px',
      },
      {
        name: 'Spacing SM',
        cssVar: '--ax-spacing-sm',
        value: '0.5rem',
        category: 'spacing',
        description: '8px',
      },
      {
        name: 'Spacing MD',
        cssVar: '--ax-spacing-md',
        value: '0.75rem',
        category: 'spacing',
        description: '12px',
      },
      {
        name: 'Spacing LG',
        cssVar: '--ax-spacing-lg',
        value: '1rem',
        category: 'spacing',
        description: '16px',
      },
      {
        name: 'Spacing XL',
        cssVar: '--ax-spacing-xl',
        value: '1.5rem',
        category: 'spacing',
        description: '24px',
      },
      {
        name: 'Spacing 2XL',
        cssVar: '--ax-spacing-2xl',
        value: '2rem',
        category: 'spacing',
        description: '32px',
      },
      {
        name: 'Spacing 3XL',
        cssVar: '--ax-spacing-3xl',
        value: '3rem',
        category: 'spacing',
        description: '48px',
      },
      {
        name: 'Spacing 4XL',
        cssVar: '--ax-spacing-4xl',
        value: '4rem',
        category: 'spacing',
        description: '64px',
      },
    ],
  };

  /**
   * Border radius tokens
   */
  readonly radiusTokens: TokenGroup = {
    name: 'Border Radius',
    description: 'Corner rounding for UI elements',
    tokens: [
      {
        name: 'Radius None',
        cssVar: '--ax-radius-none',
        value: '0',
        category: 'borders',
      },
      {
        name: 'Radius SM',
        cssVar: '--ax-radius-sm',
        value: '0.25rem',
        category: 'borders',
        description: '4px',
      },
      {
        name: 'Radius MD',
        cssVar: '--ax-radius-md',
        value: '0.5rem',
        category: 'borders',
        description: '8px',
      },
      {
        name: 'Radius LG',
        cssVar: '--ax-radius-lg',
        value: '0.75rem',
        category: 'borders',
        description: '12px',
      },
      {
        name: 'Radius XL',
        cssVar: '--ax-radius-xl',
        value: '1rem',
        category: 'borders',
        description: '16px',
      },
      {
        name: 'Radius 2XL',
        cssVar: '--ax-radius-2xl',
        value: '1.5rem',
        category: 'borders',
        description: '24px',
      },
      {
        name: 'Radius Full',
        cssVar: '--ax-radius-full',
        value: '9999px',
        category: 'borders',
        description: 'Pill shape',
      },
    ],
  };

  /**
   * Shadow tokens
   */
  readonly shadowTokens: TokenGroup = {
    name: 'Shadows',
    description: 'Elevation and depth effects',
    tokens: [
      {
        name: 'Shadow XS',
        cssVar: '--ax-shadow-xs',
        value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        category: 'shadows',
      },
      {
        name: 'Shadow SM',
        cssVar: '--ax-shadow-sm',
        value: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        category: 'shadows',
      },
      {
        name: 'Shadow MD',
        cssVar: '--ax-shadow-md',
        value: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        category: 'shadows',
      },
      {
        name: 'Shadow LG',
        cssVar: '--ax-shadow-lg',
        value: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        category: 'shadows',
      },
      {
        name: 'Shadow XL',
        cssVar: '--ax-shadow-xl',
        value: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        category: 'shadows',
      },
    ],
  };

  /**
   * Motion/transition tokens
   */
  readonly motionTokens: TokenGroup = {
    name: 'Motion',
    description: 'Animation durations and easing functions',
    tokens: [
      {
        name: 'Duration Instant',
        cssVar: '--ax-duration-instant',
        value: '75ms',
        category: 'motion',
      },
      {
        name: 'Duration Fast',
        cssVar: '--ax-duration-fast',
        value: '150ms',
        category: 'motion',
      },
      {
        name: 'Duration Normal',
        cssVar: '--ax-duration-normal',
        value: '250ms',
        category: 'motion',
      },
      {
        name: 'Duration Slow',
        cssVar: '--ax-duration-slow',
        value: '350ms',
        category: 'motion',
      },
      {
        name: 'Duration Slower',
        cssVar: '--ax-duration-slower',
        value: '500ms',
        category: 'motion',
      },
    ],
  };

  // ============================================
  // COMPONENT TOKEN MAP
  // ============================================

  /**
   * Mapping of components to their token usage
   */
  readonly componentTokenMap: Record<string, ComponentTokenUsage> = {
    'ax-card': {
      componentName: 'Card',
      selector: 'ax-card',
      tokens: [
        {
          category: 'Colors',
          cssVar: '--ax-background-default',
          usage: 'Card surface background',
        },
        {
          category: 'Colors',
          cssVar: '--ax-border-default',
          usage: 'Card border color',
        },
        {
          category: 'Borders',
          cssVar: '--ax-radius-lg',
          usage: 'Card corner rounding',
        },
        {
          category: 'Shadows',
          cssVar: '--ax-shadow-sm',
          usage: 'Elevated card shadow',
        },
        {
          category: 'Spacing',
          cssVar: '--ax-spacing-md',
          usage: 'Default content padding',
        },
      ],
    },
    'ax-badge': {
      componentName: 'Badge',
      selector: 'ax-badge',
      tokens: [
        {
          category: 'Colors',
          cssVar: '--ax-brand-faint',
          usage: 'Default badge background',
        },
        {
          category: 'Colors',
          cssVar: '--ax-brand-emphasis',
          usage: 'Default badge text',
        },
        {
          category: 'Borders',
          cssVar: '--ax-radius-full',
          usage: 'Pill-shaped corners',
        },
        {
          category: 'Typography',
          cssVar: '--ax-text-xs',
          usage: 'Badge text size',
        },
        {
          category: 'Spacing',
          cssVar: '--ax-spacing-xs',
          usage: 'Horizontal padding',
        },
      ],
    },
    'ax-alert': {
      componentName: 'Alert',
      selector: 'ax-alert',
      tokens: [
        {
          category: 'Colors',
          cssVar: '--ax-info-faint',
          usage: 'Info alert background',
        },
        {
          category: 'Colors',
          cssVar: '--ax-success-faint',
          usage: 'Success alert background',
        },
        {
          category: 'Colors',
          cssVar: '--ax-warning-faint',
          usage: 'Warning alert background',
        },
        {
          category: 'Colors',
          cssVar: '--ax-error-faint',
          usage: 'Error alert background',
        },
        {
          category: 'Borders',
          cssVar: '--ax-radius-md',
          usage: 'Alert corner rounding',
        },
        {
          category: 'Spacing',
          cssVar: '--ax-spacing-md',
          usage: 'Alert padding',
        },
      ],
    },
    'ax-kpi-card': {
      componentName: 'KPI Card',
      selector: 'ax-kpi-card',
      tokens: [
        {
          category: 'Colors',
          cssVar: '--ax-background-default',
          usage: 'Card background',
        },
        {
          category: 'Colors',
          cssVar: '--ax-text-heading',
          usage: 'Value text color',
        },
        {
          category: 'Colors',
          cssVar: '--ax-text-secondary',
          usage: 'Label text color',
        },
        {
          category: 'Colors',
          cssVar: '--ax-success-default',
          usage: 'Positive trend indicator',
        },
        {
          category: 'Colors',
          cssVar: '--ax-error-default',
          usage: 'Negative trend indicator',
        },
        {
          category: 'Borders',
          cssVar: '--ax-radius-lg',
          usage: 'Card corner rounding',
        },
        {
          category: 'Shadows',
          cssVar: '--ax-shadow-sm',
          usage: 'Card elevation',
        },
      ],
    },
    'ax-avatar': {
      componentName: 'Avatar',
      selector: 'ax-avatar',
      tokens: [
        {
          category: 'Colors',
          cssVar: '--ax-brand-faint',
          usage: 'Fallback background',
        },
        {
          category: 'Colors',
          cssVar: '--ax-brand-emphasis',
          usage: 'Initials text color',
        },
        {
          category: 'Borders',
          cssVar: '--ax-radius-full',
          usage: 'Circular shape',
        },
        {
          category: 'Typography',
          cssVar: '--ax-font-medium',
          usage: 'Initials font weight',
        },
      ],
    },
    'ax-loading-bar': {
      componentName: 'Loading Bar',
      selector: 'ax-loading-bar',
      tokens: [
        {
          category: 'Colors',
          cssVar: '--ax-brand-default',
          usage: 'Progress bar color',
        },
        {
          category: 'Colors',
          cssVar: '--ax-brand-faint',
          usage: 'Track background',
        },
        {
          category: 'Motion',
          cssVar: '--ax-duration-slow',
          usage: 'Animation speed',
        },
      ],
    },
    'ax-breadcrumb': {
      componentName: 'Breadcrumb',
      selector: 'ax-breadcrumb',
      tokens: [
        {
          category: 'Colors',
          cssVar: '--ax-text-secondary',
          usage: 'Link text color',
        },
        {
          category: 'Colors',
          cssVar: '--ax-text-primary',
          usage: 'Current item color',
        },
        {
          category: 'Colors',
          cssVar: '--ax-text-disabled',
          usage: 'Separator color',
        },
        {
          category: 'Typography',
          cssVar: '--ax-text-sm',
          usage: 'Breadcrumb text size',
        },
        { category: 'Spacing', cssVar: '--ax-spacing-xs', usage: 'Item gap' },
      ],
    },
  };

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Get computed CSS variable value from the document
   */
  getComputedValue(cssVar: string): string {
    if (!this.document?.documentElement) return '';

    const varName = cssVar.startsWith('--') ? cssVar.slice(2) : cssVar;
    return getComputedStyle(this.document.documentElement)
      .getPropertyValue(`--${varName}`)
      .trim();
  }

  /**
   * Get all tokens by category
   */
  getTokensByCategory(category: TokenCategory): DesignToken[] {
    switch (category) {
      case 'typography':
        return this.typographyTokens.tokens;
      case 'spacing':
        return this.spacingTokens.tokens;
      case 'borders':
        return this.radiusTokens.tokens;
      case 'shadows':
        return this.shadowTokens.tokens;
      case 'motion':
        return this.motionTokens.tokens;
      default:
        return [];
    }
  }

  /**
   * Get token groups for a category
   */
  getTokenGroups(): TokenGroup[] {
    return [
      this.typographyTokens,
      this.spacingTokens,
      this.radiusTokens,
      this.shadowTokens,
      this.motionTokens,
    ];
  }

  /**
   * Get components using a specific token
   */
  getComponentsUsingToken(cssVar: string): string[] {
    const components: string[] = [];

    Object.entries(this.componentTokenMap).forEach(([selector, usage]) => {
      if (usage.tokens.some((t) => t.cssVar === cssVar)) {
        components.push(usage.componentName);
      }
    });

    return components;
  }

  /**
   * Get tokens used by a specific component
   */
  getTokensForComponent(selector: string): ComponentToken[] {
    return this.componentTokenMap[selector]?.tokens || [];
  }

  /**
   * Get themed values for a token (light vs dark)
   */
  getThemedValues(cssVar: string): ThemedTokenValue {
    const lightValue = this.getComputedValue(cssVar);
    // For dark mode, we'd need to temporarily switch themes or read from a config
    // For now, return the current value for both
    const darkValue = lightValue; // TODO: Implement actual dark mode value lookup

    return {
      tokenName: cssVar.replace('--ax-', '').replace(/-/g, ' '),
      cssVar,
      lightValue,
      darkValue,
      isDifferent: lightValue !== darkValue,
    };
  }

  /**
   * Get all semantic color scales
   */
  getSemanticColorScales(): SemanticColorScale[] {
    return this.semanticColors;
  }

  /**
   * Get a specific semantic color scale
   */
  getSemanticColor(name: string): SemanticColorScale | undefined {
    return this.semanticColors.find((c) => c.name === name);
  }
}
