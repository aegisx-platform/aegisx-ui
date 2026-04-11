import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * AxHubPage — Section landing hub page shell (L7 archetype).
 *
 * Used by section landing pages: /inventory, /inventory/budget,
 * /inventory/procurement, /inventory/main-warehouse, etc. Composes:
 * - Optional breadcrumb
 * - Hero section with an icon tile, title, and description
 *   (consumer can override the hero entirely via the [ax-hub-hero]
 *   slot if a custom hero is needed)
 * - Main content area (default slot) — typically a grid of module
 *   cards, AxLauncher, or custom module tiles
 * - Optional footer slot for recent activity / quick links
 *
 * Projection contracts:
 *   [ax-hub-breadcrumb] — above the hero
 *   [ax-hub-hero]       — custom hero override (replaces default hero)
 *   [ax-hub-actions]    — action buttons on the hero (top-right)
 *   (default)           — main grid / cards / launcher
 *   [ax-hub-footer]     — optional footer content (recent / quick links)
 */
@Component({
  selector: 'ax-hub-page',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ax-hub-page">
      <ng-content select="[ax-hub-breadcrumb]"></ng-content>

      <!-- Custom hero slot: if consumer projects here, CSS sibling
           selector below hides the default hero automatically -->
      <div class="ax-hub-page__hero-custom">
        <ng-content select="[ax-hub-hero]"></ng-content>
      </div>

      <header class="ax-hub-page__hero">
        @if (icon()) {
          <div class="ax-hub-page__hero-icon">
            <mat-icon>{{ icon() }}</mat-icon>
          </div>
        }
        <div class="ax-hub-page__hero-text">
          @if (title()) {
            <h1 class="ax-hub-page__title">{{ title() }}</h1>
          }
          @if (subtitle()) {
            <p class="ax-hub-page__subtitle">{{ subtitle() }}</p>
          }
        </div>
        <div class="ax-hub-page__hero-actions">
          <ng-content select="[ax-hub-actions]"></ng-content>
        </div>
      </header>

      <section class="ax-hub-page__content">
        <ng-content></ng-content>
      </section>

      <div class="ax-hub-page__footer">
        <ng-content select="[ax-hub-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-hub-page {
        display: flex;
        flex-direction: column;
        gap: 28px;
        padding: 32px 24px 48px;
        max-width: 1600px;
        margin: 0 auto;
      }

      /* Custom hero slot wraps the user's own hero if they provide one.
         We render the default hero only when this wrapper is empty. */
      .ax-hub-page__hero-custom:not(:has(*)) {
        display: none;
      }

      /* When a custom hero is projected, hide the default hero via
         the adjacent sibling combinator (CSS-only, no input toggle). */
      .ax-hub-page__hero-custom:has(*) + .ax-hub-page__hero {
        display: none;
      }

      .ax-hub-page__hero {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .ax-hub-page__hero-icon {
        flex-shrink: 0;
        width: 56px;
        height: 56px;
        border-radius: 14px;
        background: var(--ax-brand-faint, #eef2ff);
        color: var(--ax-primary, #6366f1);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ax-hub-page__hero-icon mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .ax-hub-page__hero-text {
        flex: 1 1 auto;
        min-width: 0;
      }

      .ax-hub-page__title {
        font-size: 26px;
        font-weight: 800;
        color: var(--ax-text-heading, #09090b);
        margin: 0;
        letter-spacing: -0.02em;
        line-height: 1.25;
      }

      .ax-hub-page__subtitle {
        font-size: 14px;
        color: var(--ax-text-secondary, #71717a);
        margin: 6px 0 0;
        line-height: 1.5;
        max-width: 720px;
      }

      .ax-hub-page__hero-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
        align-items: center;
      }

      .ax-hub-page__hero-actions:not(:has(*)) {
        display: none;
      }

      .ax-hub-page__content {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .ax-hub-page__footer:not(:has(*)) {
        display: none;
      }

      @media (max-width: 768px) {
        .ax-hub-page {
          padding: 20px 16px 32px;
          gap: 20px;
        }

        .ax-hub-page__hero {
          flex-wrap: wrap;
        }

        .ax-hub-page__title {
          font-size: 22px;
        }
      }
    `,
  ],
})
export class AxHubPageComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<string>('');
}
