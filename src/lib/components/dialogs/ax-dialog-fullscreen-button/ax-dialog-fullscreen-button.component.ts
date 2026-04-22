import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

const STORAGE_PREFIX = 'ax:dialog-fullscreen:';

/**
 * `<ax-dialog-fullscreen-button>` — drop-in button for `h2 mat-dialog-title`
 * headers that toggles a CDK overlay pane between its default size and
 * full-viewport coverage via the `.dialog-fullscreen` class shipped by
 * `aegisx-ui` (`libs/aegisx-ui/src/lib/styles/components/_dialog-shared.scss`).
 *
 * Extracted from the stockcard dialog so every dialog that wants a fullscreen
 * toggle (PR / PO create, detail viewers, file-management modal, …) can drop
 * in one tag instead of redefining the signal + DOM walk each time.
 *
 * Persistence:
 *  - If `persistKey` is set, the last user choice is stored in
 *    localStorage under `ax:dialog-fullscreen:<persistKey>`.
 *  - If you need per-user isolation (e.g. shared workstations) bake the
 *    user id into the key, e.g. `persistKey="pr-dialog:{{ userId }}"`.
 *  - Consumers that need richer storage (authenticated UserPreferenceService)
 *    can skip `persistKey` and persist via the `(fullscreenChange)` output.
 *
 * @example
 * ```html
 * <h2 mat-dialog-title class="ax-header ax-header-info">
 *   <div class="ax-icon-info"><mat-icon>add_circle</mat-icon></div>
 *   <div class="header-text">
 *     <div class="ax-title">สร้างใบขอซื้อ</div>
 *     <div class="ax-subtitle">บันทึกใบขอซื้อใหม่</div>
 *   </div>
 *
 *   <ax-dialog-fullscreen-button persistKey="pr-dialog-fullscreen" />
 *
 *   <button mat-icon-button mat-dialog-close>
 *     <mat-icon>close</mat-icon>
 *   </button>
 * </h2>
 * ```
 */
@Component({
  selector: 'ax-dialog-fullscreen-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      type="button"
      (click)="toggle()"
      [attr.aria-pressed]="isFullscreen()"
      [matTooltip]="isFullscreen() ? collapseLabel() : expandLabel()"
      matTooltipPosition="below"
    >
      <mat-icon>{{
        isFullscreen() ? 'fullscreen_exit' : 'fullscreen'
      }}</mat-icon>
    </button>
  `,
})
export class AxDialogFullscreenButtonComponent implements AfterViewInit {
  /**
   * localStorage key (without prefix). When present, the button remembers
   * the last toggle across sessions. Omit for session-only behaviour, or
   * when the caller wants to persist through a richer storage layer via
   * the `fullscreenChange` output.
   */
  readonly persistKey = input<string>();

  /** Initial open state when nothing is persisted for `persistKey` yet. */
  readonly defaultOpen = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  readonly expandLabel = input<string>('เต็มหน้าจอ');
  readonly collapseLabel = input<string>('ย่อหน้าต่าง');

  /** Fires after every toggle (click or initial apply on open). */
  readonly fullscreenChange = output<boolean>();

  protected readonly isFullscreen = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const initial = this.readPersisted() ?? this.defaultOpen();
    if (initial) {
      // Defer one tick so the CDK overlay pane is in the DOM before we
      // try to walk up to it (ngAfterViewInit runs while the dialog is
      // still mid-open on some Material versions).
      queueMicrotask(() => this.apply(true));
    }
  }

  toggle(): void {
    const next = !this.isFullscreen();
    this.apply(next);
    this.writePersisted(next);
  }

  private apply(on: boolean): void {
    this.isFullscreen.set(on);
    const pane = this.findOverlayPane();
    pane?.classList.toggle('dialog-fullscreen', on);
    this.fullscreenChange.emit(on);
  }

  private findOverlayPane(): HTMLElement | null {
    return this.host.nativeElement.closest<HTMLElement>('.cdk-overlay-pane');
  }

  private readPersisted(): boolean | null {
    const key = this.persistKey();
    if (!key) return null;
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === 'true') return true;
      if (raw === 'false') return false;
      return null;
    } catch {
      return null;
    }
  }

  private writePersisted(value: boolean): void {
    const key = this.persistKey();
    if (!key) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + key, String(value));
    } catch {
      // localStorage unavailable (private browsing, quota, SSR)
    }
  }
}
