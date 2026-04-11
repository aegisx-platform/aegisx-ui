import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Select Card Component
 *
 * Clickable selection card with check indicator for hub/wizard patterns (L1, L5).
 * Emits `true` on click — parent manages which card is active (radio-style).
 *
 * @example
 * <ax-select-card
 *   [selected]="source === 'excel'"
 *   icon="description"
 *   title="Excel / CSV"
 *   description="อัปโหลดไฟล์ .xlsx, .xls, .csv"
 *   (selectedChange)="source = 'excel'">
 * </ax-select-card>
 */
@Component({
  selector: 'ax-select-card',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ax-select-card"
      [class.selected]="selected"
      role="radio"
      [attr.aria-checked]="selected"
      [attr.aria-label]="title"
      tabindex="0"
      (click)="selectedChange.emit(true)"
      (keydown.enter)="selectedChange.emit(true)"
      (keydown.space)="$event.preventDefault(); selectedChange.emit(true)"
    >
      @if (icon) {
        <div class="icon-box" [class.icon-selected]="selected">
          <mat-icon>{{ icon }}</mat-icon>
        </div>
      }
      <div class="content">
        <div class="title">{{ title }}</div>
        @if (description) {
          <div class="desc">{{ description }}</div>
        }
      </div>
      @if (selected) {
        <div class="check-circle">
          <mat-icon>check</mat-icon>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .ax-select-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 20px;
        border-radius: 14px;
        border: 2px solid var(--ax-border-default, #e2e8f0);
        background: var(--ax-background-subtle, #fafbfc);
        cursor: pointer;
        transition: all 0.2s ease;
        outline: none;
      }
      .ax-select-card:hover {
        border-color: var(--ax-border-emphasis, #cbd5e1);
      }
      .ax-select-card:focus-visible {
        box-shadow: 0 0 0 2px var(--ax-info-default, #3b82f6);
      }
      .ax-select-card.selected {
        background: var(--ax-info-faint, #eff6ff);
        border-color: var(--ax-info-default, #3b82f6);
      }
      .icon-box {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        background: var(--ax-background-muted, #f1f5f9);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--ax-text-secondary, #64748b);
        transition: all 0.2s ease;
      }
      .icon-box.icon-selected {
        background: var(--ax-info-faint, rgba(59, 130, 246, 0.1));
        color: var(--ax-info-default, #3b82f6);
      }
      .icon-box mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }
      .content {
        flex: 1;
        min-width: 0;
      }
      .title {
        font-size: 15px;
        font-weight: 700;
        color: var(--ax-text-heading, #0f172a);
      }
      .desc {
        font-size: 12px;
        color: var(--ax-text-secondary, #64748b);
        margin-top: 2px;
      }
      .check-circle {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--ax-info-default, #3b82f6);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .check-circle mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
    `,
  ],
})
export class AxSelectCardComponent {
  @Input() selected: boolean = false;
  @Input() icon?: string;
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Output() selectedChange = new EventEmitter<boolean>();
}
