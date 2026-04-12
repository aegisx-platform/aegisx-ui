// AegisX Custom Icon Registry
// ลงทะเบียน domain SVG icons เข้า Angular Material MatIconRegistry

import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

/** All AegisX custom icons (mono variants) */
export const AEGISX_ICONS = [
  // --- Drug Inventory ---
  'drug-master', 'tmt-catalog', 'supplier', 'lot-tracking',
  'purchase-requisition', 'purchase-order', 'budget-ledger',
  'goods-receive', 'bin-location', 'stock-overview', 'stock-count',
  'transfer', 'drug-return', 'zone-picking', 'wave-picking',
  'delivery', 'dispensing', 'auth-lock', 'fefo-expiry',
  'drug-interaction', 'barcode-scan', 'dashboard', 'alert', 'ven-abc',

  // --- HIS Modules ---
  'registration', 'opd', 'ipd', 'emergency', 'pharmacy',
  'laboratory', 'radiology', 'surgery', 'nursing', 'dental',
  'rehab', 'nutrition', 'blood-bank', 'infection-control',
  'discharge', 'med-records', 'referral', 'appointment',
  'queue', 'telehealth', 'kiosk', 'nhso-claims', 'billing',
  'monitoring', 'help-center',

  // --- Admin & System ---
  'users', 'rbac', 'organization', 'settings', 'audit-log',
  'report-builder', 'integration', 'notifications', 'multi-site',
  'migration',

  // --- App Icons ---
  'app-inventory',
] as const;

export type AegisxIcon = (typeof AEGISX_ICONS)[number];

@Injectable({ providedIn: 'root' })
export class AegisxIconRegistry {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private registered = false;

  /** Resolve asset path relative to <base href> so it works
   *  both in dev (base="/") and production (base="/app/" etc.) */
  private resolveAssetPath(relativePath: string): string {
    const base =
      document.querySelector('base')?.getAttribute('href') || '/';
    return `${base}${relativePath}`.replace('//', '/');
  }

  /**
   * Register all AegisX SVG icons (mono).
   * Call once in AppComponent or root shell — idempotent.
   * Uses absolute URL (bypasses API interceptor).
   */
  registerAll(basePath = 'assets/icons/aegisx/svg'): void {
    const resolved = this.resolveAssetPath(basePath);
    if (this.registered) return;
    for (const name of AEGISX_ICONS) {
      this.iconRegistry.addSvgIcon(
        name,
        this.sanitizer.bypassSecurityTrustResourceUrl(`${resolved}/${name}.svg`),
      );
    }
    this.registered = true;
  }

  /** Register a single icon on demand. */
  registerIcon(name: string, path: string): void {
    this.iconRegistry.addSvgIcon(
      name,
      this.sanitizer.bypassSecurityTrustResourceUrl(path),
    );
  }
}
