import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AEGISX_ICON_DATA } from './aegisx-icon-data';
import { AEGISX_FEATURED_DATA } from './aegisx-icon-featured-data';

/**
 * AegisX Icon Registry
 *
 * Registers custom SVG icons as inline literals into Angular Material's
 * MatIconRegistry. Icons are bundled as TS string constants — no HTTP
 * requests, no asset paths, no angular.json config.
 *
 * Two namespaces:
 * - `ax:`  — Mono icons (currentColor, 153 icons)
 * - `axf:` — Featured icons (60x60, double-ring with severity colors, 10 icons)
 *
 * For diamond-shaped icons, use the `<ax-diamond-icon>` component
 * which wraps any `ax:` icon in a CSS-rotated diamond container.
 *
 * @example
 * ```typescript
 * export class AppComponent {
 *   private icons = inject(AegisxIconRegistry);
 *   constructor() { this.icons.registerAll(); }
 * }
 *
 * // Usage in templates
 * <mat-icon svgIcon="ax:pharmacy"></mat-icon>          // mono
 * <mat-icon svgIcon="axf:err-ban"></mat-icon>          // featured error
 * <ax-diamond-icon icon="pharmacy" bg="#4338ca" />     // diamond
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AegisxIconRegistry {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private registered = false;

  /**
   * Register all AegisX icons in namespaces 'ax' and 'axf'.
   */
  registerAll(): void {
    if (this.registered) return;
    this.registerNamespace('ax', AEGISX_ICON_DATA);
    this.registerNamespace('axf', AEGISX_FEATURED_DATA);
    this.registered = true;
  }

  private registerNamespace(
    namespace: string,
    data: Record<string, string>,
  ): void {
    for (const [name, svg] of Object.entries(data)) {
      this.iconRegistry.addSvgIconLiteralInNamespace(
        namespace,
        name,
        this.sanitizer.bypassSecurityTrustHtml(svg),
      );
    }
  }
}
