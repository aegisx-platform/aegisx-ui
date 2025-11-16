import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonType = 'text' | 'circle' | 'rectangle' | 'avatar';

@Component({
  selector: 'ax-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent {
  @Input() type: SkeletonType = 'text';
  @Input() width = '';
  @Input() height = '';
  @Input() rows = 1;
  @Input() animation = true;

  get skeletonClasses(): string {
    const classes = ['ax-skeleton', `ax-skeleton-${this.type}`];
    if (this.animation) {
      classes.push('ax-skeleton-animated');
    }
    return classes.join(' ');
  }

  get skeletonStyles(): Record<string, string> {
    const styles: Record<string, string> = {};

    if (this.width) {
      styles['width'] = this.width;
    }

    if (this.height) {
      styles['height'] = this.height;
    }

    return styles;
  }

  get rowsArray(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
