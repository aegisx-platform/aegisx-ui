import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MasterPosition } from './master-detail.types';

/**
 * Master-Detail Layout Component
 *
 * A split-panel layout with a fixed-width master panel and a flexible detail panel.
 * Both panels scroll independently. Collapses to stacked layout on mobile.
 *
 * @example
 * <ax-master-detail [masterWidth]="340">
 *   <div master>
 *     <!-- Scrollable list -->
 *   </div>
 *   <div detail>
 *     <!-- Detail content -->
 *   </div>
 * </ax-master-detail>
 *
 * @example
 * // Show detail only when item is selected
 * <ax-master-detail [showDetail]="!!selectedId">
 *   <div master>...</div>
 *   <div detail>...</div>
 * </ax-master-detail>
 */
@Component({
  selector: 'ax-master-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './master-detail.component.html',
  styleUrls: ['./master-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AxMasterDetailComponent {
  /** Master panel width in px (default 340) */
  @Input() masterWidth = 340;

  /** Master panel position */
  @Input() masterPosition: MasterPosition = 'left';

  /** Whether to show the detail panel (useful for empty state) */
  @Input() showDetail = true;

  /** Whether the master panel has a border separator */
  @Input() showDivider = true;
}
