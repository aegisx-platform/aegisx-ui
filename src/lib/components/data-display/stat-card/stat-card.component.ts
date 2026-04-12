import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StatCardColor } from './stat-card.types';

/**
 * Stat Card Component
 *
 * A compact card for displaying a single statistic with an icon,
 * designed for list page headers with clickable filter functionality.
 *
 * @example
 * // Basic stat card
 * <ax-stat-card
 *   icon="medication"
 *   color="info"
 *   [value]="1250"
 *   label="ทั้งหมด"
 *   subtitle="1,250 รายการ">
 * </ax-stat-card>
 *
 * @example
 * // Clickable filter card
 * <ax-stat-card
 *   icon="check_circle"
 *   color="success"
 *   [value]="980"
 *   label="ใช้งาน"
 *   subtitle="78%"
 *   [active]="activeFilter() === 'active'"
 *   (clicked)="onFilter('active')">
 * </ax-stat-card>
 *
 * @example
 * // Display-only (non-clickable)
 * <ax-stat-card
 *   icon="inventory"
 *   color="info"
 *   [value]="23450"
 *   label="คงคลัง"
 *   subtitle="TAB (47%)"
 *   [clickable]="false">
 * </ax-stat-card>
 */
@Component({
  selector: 'ax-stat-card',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AxStatCardComponent {
  /** Material icon name */
  @Input() icon = '';

  /** Semantic color — controls icon bg and active border */
  @Input() color: StatCardColor = 'info';

  /** Stat value (number or formatted string) */
  @Input() value: string | number = '';

  /** Card label */
  @Input() label = '';

  /** Optional subtitle */
  @Input() subtitle = '';

  /** Whether the card is in active/selected state */
  @Input() active = false;

  /** Whether the card is clickable (default true) */
  @Input() clickable = true;

  /** Emitted when card is clicked */
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (this.clickable) {
      this.clicked.emit();
    }
  }
}
