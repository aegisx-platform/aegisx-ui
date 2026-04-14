import { Injectable, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { AxNavService } from './ax-nav.service';

@Injectable({ providedIn: 'root' })
export class AxNavShortcutsService {
  private readonly navService = inject(AxNavService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private _initialized = false;

  /** Callback for Cmd/Ctrl+K -- set by shell to open command palette */
  onCommandPalette?: () => void;

  /** Callback for Escape -- set by shell to close overlays */
  onEscape?: () => void;

  initialize(): void {
    if (this._initialized) return;
    this._initialized = true;

    fromEvent<KeyboardEvent>(this.document, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => this.handleKey(e));
  }

  private handleKey(e: KeyboardEvent): void {
    const meta = e.metaKey || e.ctrlKey;

    // Cmd/Ctrl+K -> command palette
    if (meta && e.key === 'k') {
      e.preventDefault();
      this.onCommandPalette?.();
    }

    // Escape -> close overlays
    if (e.key === 'Escape') {
      this.onEscape?.();
    }

    // Cmd/Ctrl+1-9 -> module navigation (skip dividers)
    if (meta && /^[1-9]$/.test(e.key)) {
      e.preventDefault();
      const idx = parseInt(e.key, 10) - 1;
      const modules = this.navService
        .visibleModules()
        .filter((m) => (m.type ?? 'route') !== 'divider');
      if (modules[idx]) {
        this.navService.setActiveModule(modules[idx].id);
      }
    }
  }
}
