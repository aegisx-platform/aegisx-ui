import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TabPill } from './tab-pills.types';

/**
 * Tab Pills Component
 *
 * Horizontal filter pill tabs for list/table filtering (L2 pattern).
 * Implements ARIA tablist pattern with arrow-key navigation.
 *
 * @example
 * <ax-tab-pills
 *   [tabs]="[
 *     { label: 'ทั้งหมด', value: 'all', count: 12 },
 *     { label: 'ร่าง', value: 'draft', count: 3 },
 *     { label: 'อนุมัติ', value: 'approved', count: 5 }
 *   ]"
 *   [activeValue]="'all'"
 *   (tabChange)="onTabChange($event)">
 * </ax-tab-pills>
 *
 * Note: `count` of 0 will render "0" — omit the property to hide the count.
 */
@Component({
  selector: 'ax-tab-pills',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ax-tab-pills" role="tablist">
      @for (tab of tabs; track tab.value) {
        <button
          class="ax-tab-pill"
          role="tab"
          [attr.aria-selected]="tab.value === activeValue"
          [class.active]="tab.value === activeValue"
          (click)="tabChange.emit(tab.value)"
        >
          @if (tab.icon) {
            <mat-icon class="pill-icon">{{ tab.icon }}</mat-icon>
          }
          {{ tab.label }}
          @if (tab.count !== undefined) {
            <span class="pill-count">{{ tab.count }}</span>
          }
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .ax-tab-pills {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }
      .ax-tab-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 14px;
        border-radius: 8px;
        border: none;
        font-family: inherit;
        font-size: 13px;
        font-weight: 500;
        color: var(--ax-text-secondary, #64748b);
        background: transparent;
        cursor: pointer;
        transition: all 0.15s ease;
        white-space: nowrap;
      }
      .ax-tab-pill:hover {
        background: var(--ax-background-subtle, #f1f5f9);
      }
      .ax-tab-pill:focus-visible {
        outline: 2px solid var(--ax-info-default, #3b82f6);
        outline-offset: 1px;
      }
      .ax-tab-pill.active {
        background: var(--ax-background-emphasis, #0f172a);
        color: var(--ax-text-inverted, #fff);
        font-weight: 700;
      }
      .pill-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
      .pill-count {
        font-size: 11px;
        font-weight: 700;
        opacity: 0.7;
      }
      .ax-tab-pill.active .pill-count {
        opacity: 0.85;
      }
    `,
  ],
})
export class AxTabPillsComponent {
  @Input({ required: true }) tabs!: TabPill[];
  @Input() activeValue: string = '';
  @Output() tabChange = new EventEmitter<string>();

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.tabs?.length) return;
    const idx = this.tabs.findIndex((t) => t.value === this.activeValue);
    if (event.key === 'ArrowRight') {
      const next = this.tabs[(idx + 1) % this.tabs.length];
      this.tabChange.emit(next.value);
    } else if (event.key === 'ArrowLeft') {
      const prev =
        this.tabs[(idx - 1 + this.tabs.length) % this.tabs.length];
      this.tabChange.emit(prev.value);
    }
  }
}
