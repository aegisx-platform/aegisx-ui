import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PriorityAlertChip, PriorityAlertVariant } from './priority-alert.types';

/**
 * Priority Alert — Featured-icon call-to-action card.
 *
 * Use on dashboards / list headers to surface a small cluster of urgent
 * work items. Compact, actionable, dark-mode ready.
 *
 * @example
 * // Basic usage with chips + primary action
 * <ax-priority-alert
 *   variant="error"
 *   icon="priority_high"
 *   title="งานเร่งด่วน 3 รายการ"
 *   [chips]="[
 *     { label: 'ค้างจ่าย 2', color: 'error', link: '/.../backorders' },
 *     { label: 'ใบเบิก 1',   color: 'warning', link: '/.../pending' },
 *   ]">
 *   <button mat-flat-button color="primary" actions>อนุมัติใบเบิก</button>
 * </ax-priority-alert>
 *
 * @example
 * // Without chips (just title + actions)
 * <ax-priority-alert variant="warning" title="มีใบเบิกรออนุมัติ">
 *   <button mat-stroked-button actions>ดู</button>
 * </ax-priority-alert>
 */
@Component({
  selector: 'ax-priority-alert',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './priority-alert.component.html',
  styleUrls: ['./priority-alert.component.scss'],
})
export class AxPriorityAlertComponent {
  /** Semantic variant — drives icon background + left border color. */
  readonly variant = input<PriorityAlertVariant>('error');

  /** Material icon name shown inside the featured icon circle. */
  readonly icon = input<string>('priority_high');

  /** Primary headline (e.g. "งานเร่งด่วน 3 รายการ"). */
  readonly title = input<string>('');

  /** Optional subtitle next to chips. */
  readonly subtitle = input<string>('');

  /** Breakdown chips (each is a pill with dot + label + optional link). */
  readonly chips = input<PriorityAlertChip[]>([]);

  /** Emitted when a chip without a link is clicked. */
  readonly chipClicked = output<PriorityAlertChip>();

  protected onChipClick(chip: PriorityAlertChip, event: Event): void {
    if (chip.onClick) {
      event.preventDefault();
      chip.onClick();
    }
    this.chipClicked.emit(chip);
  }

  /** Resolve dot color — fall back to alert variant when unspecified. */
  protected dotColor(chip: PriorityAlertChip): string {
    return chip.color ?? this.variant();
  }

  /** Coerce array-form routerLink params. */
  protected linkCommands(link: string | string[] | undefined): unknown[] {
    if (!link) return [];
    return Array.isArray(link) ? link : [link];
  }
}
