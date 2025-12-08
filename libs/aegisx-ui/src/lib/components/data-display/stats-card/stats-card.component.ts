import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type StatsCardTrend = 'up' | 'down' | 'neutral';

@Component({
  selector: 'ax-stats-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
})
export class AxStatsCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() change = '';
  @Input() trend: StatsCardTrend = 'neutral';
  @Input() icon = '';

  get statsClasses(): string {
    const classes = ['ax-stats-card'];
    return classes.join(' ');
  }

  get trendClasses(): string {
    const classes = ['ax-stats-card-trend'];
    classes.push(`ax-stats-card-trend-${this.trend}`);
    return classes.join(' ');
  }
}
