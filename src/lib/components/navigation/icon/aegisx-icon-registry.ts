import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AEGISX_ICON_DATA } from './aegisx-icon-data';
import {
  AEGISX_DIAMOND_DARK_DATA,
  AEGISX_DIAMOND_LIGHT_DATA,
} from './aegisx-icon-diamond-data';
import { AEGISX_FEATURED_DATA } from './aegisx-icon-featured-data';

/**
 * AegisX Icon Registry
 *
 * Registers custom SVG icons as inline literals into Angular Material's
 * MatIconRegistry. Icons are bundled as TS string constants — no HTTP
 * requests, no asset paths, no angular.json config.
 *
 * Four namespaces:
 * - `ax:`   — Mono icons (currentColor, 103 icons)
 * - `axd:`  — Diamond dark (colored bg, light stroke, 67 icons)
 * - `axdl:` — Diamond light (light bg, dark stroke, 67 icons)
 * - `axf:`  — Featured icons (60x60, double-ring with severity colors, 10 icons)
 *
 * @example
 * ```typescript
 * // Register all icons at app root
 * export class AppComponent {
 *   private icons = inject(AegisxIconRegistry);
 *   constructor() { this.icons.registerAll(); }
 * }
 *
 * // Usage in templates
 * <mat-icon svgIcon="ax:pharmacy"></mat-icon>          // mono
 * <mat-icon svgIcon="axd:pharmacy"></mat-icon>         // diamond dark
 * <mat-icon svgIcon="axdl:pharmacy"></mat-icon>        // diamond light
 * <mat-icon svgIcon="axf:err-ban"></mat-icon>          // featured error
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AegisxIconRegistry {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private registered = false;

  /**
   * Register all AegisX icons in namespaces 'ax', 'axd', 'axdl', 'axf'.
   */
  registerAll(): void {
    if (this.registered) return;
    this.registerNamespace('ax', AEGISX_ICON_DATA);
    this.registerNamespace('axd', AEGISX_DIAMOND_DARK_DATA);
    this.registerNamespace('axdl', AEGISX_DIAMOND_LIGHT_DATA);
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
