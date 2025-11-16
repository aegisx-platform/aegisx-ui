import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ProgressType = 'bar' | 'circle';
export type ProgressVariant =
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';
export type ProgressSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ax-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent {
  @Input() type: ProgressType = 'bar';
  @Input() variant: ProgressVariant = 'primary';
  @Input() size: ProgressSize = 'md';
  @Input() value = 0;
  @Input() max = 100;
  @Input() showLabel = false;
  @Input() indeterminate = false;

  get percentage(): number {
    return Math.min(Math.max((this.value / this.max) * 100, 0), 100);
  }

  get progressClasses(): string {
    const classes = [
      'ax-progress',
      `ax-progress-${this.type}`,
      `ax-progress-${this.variant}`,
      `ax-progress-${this.size}`,
    ];
    if (this.indeterminate) {
      classes.push('ax-progress-indeterminate');
    }
    return classes.join(' ');
  }

  get barStyles(): Record<string, string> {
    if (this.indeterminate) {
      return {};
    }
    return {
      width: `${this.percentage}%`,
    };
  }

  get circleStyles(): Record<string, string> {
    const radius = this.getCircleRadius();
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (this.percentage / 100) * circumference;

    return {
      'stroke-dasharray': `${circumference}`,
      'stroke-dashoffset': this.indeterminate ? '0' : `${offset}`,
    };
  }

  getCircleRadius(): number {
    switch (this.size) {
      case 'sm':
        return 18;
      case 'md':
        return 22;
      case 'lg':
        return 28;
      default:
        return 22;
    }
  }

  getCircleSize(): number {
    const radius = this.getCircleRadius();
    return (radius + 4) * 2;
  }
}
