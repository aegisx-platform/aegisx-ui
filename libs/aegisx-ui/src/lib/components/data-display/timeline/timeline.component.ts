import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimelineItem {
  title: string;
  description?: string;
  timestamp?: string;
  icon?: string;
  color?: string;
}

@Component({
  selector: 'ax-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  @Input() items: TimelineItem[] = [];

  trackByIndex(index: number): number {
    return index;
  }
}
