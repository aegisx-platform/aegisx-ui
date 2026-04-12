import {
  ChangeDetectionStrategy,
  Component,
  Input,
  HostBinding,
} from '@angular/core';
import { DividerLayout, DividerType, DividerAlign } from './divider.types';

@Component({
  selector: 'ax-divider',
  standalone: true,
  imports: [],
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AxDividerComponent {
  /** Layout direction: horizontal (default) or vertical */
  @Input() layout: DividerLayout = 'horizontal';

  /** Border style: solid (default), dashed, or dotted */
  @Input() type: DividerType = 'solid';

  /** Content alignment: left, center (default), right, top, bottom */
  @Input() align: DividerAlign = 'center';

  @HostBinding('class')
  get hostClasses(): string {
    return [
      'ax-divider',
      `ax-divider--${this.layout}`,
      `ax-divider--${this.type}`,
      `ax-divider--align-${this.align}`,
    ].join(' ');
  }

  @HostBinding('attr.role')
  get role(): string {
    return 'separator';
  }

  @HostBinding('attr.aria-orientation')
  get ariaOrientation(): string {
    return this.layout;
  }
}
