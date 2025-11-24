import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Typography Scale Entry
 */
interface TypographyScale {
  name: string;
  token: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing?: string;
  usage: string;
}

/**
 * Text Color Entry
 */
interface TextColor {
  name: string;
  token: string;
  hex: string;
  usage: string;
}

@Component({
  selector: 'app-typography-showcase',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './typography-showcase.component.html',
  styleUrl: './typography-showcase.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TypographyShowcaseComponent {
  // Search and UI state
  searchQuery = '';
  showBackToTop = false;
  activeSection = '';
  // Material Design 3 Typography Scale
  m3TypeScale: TypographyScale[] = [
    {
      name: 'Display Large',
      token: '--ax-type-display-large',
      size: '57px',
      weight: '400',
      lineHeight: '64px',
      usage: 'Hero sections, landing pages',
    },
    {
      name: 'Display Medium',
      token: '--ax-type-display-medium',
      size: '45px',
      weight: '400',
      lineHeight: '52px',
      usage: 'Main page headings',
    },
    {
      name: 'Display Small',
      token: '--ax-type-display-small',
      size: '36px',
      weight: '400',
      lineHeight: '44px',
      usage: 'Section headers',
    },
    {
      name: 'Headline Large',
      token: '--ax-type-headline-large',
      size: '32px',
      weight: '400',
      lineHeight: '40px',
      usage: 'Card titles, modal headers',
    },
    {
      name: 'Headline Medium',
      token: '--ax-type-headline-medium',
      size: '28px',
      weight: '400',
      lineHeight: '36px',
      usage: 'Sub-section headers',
    },
    {
      name: 'Headline Small',
      token: '--ax-type-headline-small',
      size: '24px',
      weight: '400',
      lineHeight: '32px',
      usage: 'Component headers',
    },
    {
      name: 'Title Large',
      token: '--ax-type-title-large',
      size: '22px',
      weight: '400',
      lineHeight: '28px',
      usage: 'List titles, dialog headers',
    },
    {
      name: 'Title Medium',
      token: '--ax-type-title-medium',
      size: '16px',
      weight: '500',
      lineHeight: '24px',
      usage: 'Toolbar titles, tab labels',
    },
    {
      name: 'Title Small',
      token: '--ax-type-title-small',
      size: '14px',
      weight: '500',
      lineHeight: '20px',
      usage: 'List item titles',
    },
    {
      name: 'Body Large',
      token: '--ax-type-body-large',
      size: '16px',
      weight: '400',
      lineHeight: '24px',
      usage: 'Long-form content, articles',
    },
    {
      name: 'Body Medium',
      token: '--ax-type-body-medium',
      size: '14px',
      weight: '400',
      lineHeight: '20px',
      usage: 'Default body text',
    },
    {
      name: 'Body Small',
      token: '--ax-type-body-small',
      size: '12px',
      weight: '400',
      lineHeight: '16px',
      letterSpacing: '0.1px',
      usage: 'Captions, footnotes',
    },
    {
      name: 'Label Large',
      token: '--ax-type-label-large',
      size: '14px',
      weight: '500',
      lineHeight: '20px',
      usage: 'Button text, labels',
    },
    {
      name: 'Label Medium',
      token: '--ax-type-label-medium',
      size: '12px',
      weight: '500',
      lineHeight: '16px',
      letterSpacing: '0.1px',
      usage: 'Small buttons, chips',
    },
    {
      name: 'Label Small',
      token: '--ax-type-label-small',
      size: '11px',
      weight: '500',
      lineHeight: '16px',
      usage: 'Badges, tags',
    },
  ];

  // Text Color Hierarchy
  textColors: TextColor[] = [
    {
      name: 'Heading',
      token: '--ax-text-heading',
      hex: '#1f2937',
      usage: 'Headings only (h1-h6), not for body text',
    },
    {
      name: 'Primary',
      token: '--ax-text-primary',
      hex: '#374151',
      usage: 'Primary body text, main content',
    },
    {
      name: 'Secondary',
      token: '--ax-text-secondary',
      hex: '#6b7280',
      usage: 'Secondary body text, descriptions',
    },
    {
      name: 'Subtle',
      token: '--ax-text-subtle',
      hex: '#9ca3af',
      usage: 'Subtle text, metadata, timestamps',
    },
    {
      name: 'Disabled',
      token: '--ax-text-disabled',
      hex: '#d1d5db',
      usage: 'Disabled text, placeholders',
    },
    {
      name: 'Inverted',
      token: '--ax-text-inverted',
      hex: '#ffffff',
      usage: 'Text on dark backgrounds',
    },
  ];

  // Font Weights
  fontWeights = [
    {
      name: 'Normal',
      token: '--ax-font-normal',
      value: '400',
      usage: 'Body text',
    },
    {
      name: 'Medium',
      token: '--ax-font-medium',
      value: '500',
      usage: 'Emphasis, labels',
    },
    {
      name: 'Semibold',
      token: '--ax-font-semibold',
      value: '600',
      usage: 'Headings, important text',
    },
    {
      name: 'Bold',
      token: '--ax-font-bold',
      value: '700',
      usage: 'Strong emphasis',
    },
  ];

  // Line Heights
  lineHeights = [
    {
      name: 'Tight',
      token: '--ax-leading-tight',
      value: '1.25',
      usage: 'Headings, compact UI',
    },
    {
      name: 'Normal',
      token: '--ax-leading-normal',
      value: '1.5',
      usage: 'Body text',
    },
    {
      name: 'Relaxed',
      token: '--ax-leading-relaxed',
      value: '1.75',
      usage: 'Long-form content',
    },
  ];

  // Sample text for all demonstrations
  readonly sampleHeading = 'The quick brown fox jumps over the lazy dog';
  readonly sampleBody =
    'Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.';
  readonly sampleLongText =
    'Good typography establishes visual hierarchy, providing readers with a clear structure to navigate content. Through careful selection of typefaces, sizes, weights, and spacing, typography guides the eye and enhances comprehension. Material Design 3 emphasizes expressive yet functional type systems that adapt seamlessly across devices and contexts.';

  /**
   * Track scroll position for back-to-top button and active section
   */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Show/hide back to top button
    this.showBackToTop = window.scrollY > 500;

    // Track active section
    const sections = [
      'type-scale',
      'text-colors',
      'font-weights',
      'line-heights',
      'examples',
    ];

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 300) {
          this.activeSection = sectionId;
          break;
        }
      }
    }
  }

  /**
   * Scroll to a specific section
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Scroll to top of page
   */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Copy token to clipboard
   */
  async copyToClipboard(token: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(`var(${token})`);
      // You could show a snackbar here
      console.log(`Copied: var(${token})`);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }
}
