import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AEGISX_ICON_DATA } from './aegisx-icon-data';

/**
 * AegisX Icon Registry
 *
 * Registers custom SVG icons as inline literals into Angular Material's
 * MatIconRegistry. Icons are bundled as TS string constants — no HTTP
 * requests, no asset paths, no angular.json config.
 *
 * Follows the ng-icons / Lucide pattern: icons ship as JS, not files.
 *
 * @example
 * ```typescript
 * // Register all 60 icons at app root
 * export class AppComponent {
 *   private icons = inject(AegisxIconRegistry);
 *   constructor() { this.icons.registerAll(); }
 * }
 *
 * // Or register specific icons only (tree-shake)
 * import { budgetLedger, purchaseOrder } from '@aegisx/ui';
 * this.icons.register({ 'budget-ledger': budgetLedger, 'purchase-order': purchaseOrder });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AegisxIconRegistry {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private registered = false;

  /**
   * Register all AegisX icons in namespace 'ax'.
   * Usage: <mat-icon svgIcon="ax:budget-ledger"></mat-icon>
   */
  registerAll(): void {
    if (this.registered) return;
    for (const [name, svg] of Object.entries(AEGISX_ICON_DATA)) {
      this.iconRegistry.addSvgIconLiteralInNamespace(
        'ax',
        name,
        this.sanitizer.bypassSecurityTrustHtml(svg),
      );
    }
    this.registered = true;
  }
}
