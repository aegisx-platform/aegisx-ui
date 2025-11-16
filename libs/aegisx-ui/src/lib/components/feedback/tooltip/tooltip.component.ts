import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'ax-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  @Input() text = '';
  @Input() position: TooltipPosition = 'top';
  @Input() top = 0;
  @Input() left = 0;

  get tooltipClasses(): string {
    const classes = ['ax-tooltip', `ax-tooltip-${this.position}`];
    return classes.join(' ');
  }

  get tooltipStyles(): Record<string, string> {
    return {
      top: `${this.top}px`,
      left: `${this.left}px`,
    };
  }
}
