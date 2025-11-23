import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AxCardComponent, AxSparklineComponent } from '@aegisx/ui';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-card-colors-demo',
  standalone: true,
  imports: [
    CommonModule,
    AxCardComponent,
    AxSparklineComponent,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './card-colors-demo.component.html',
  styleUrls: ['./card-colors-demo.component.scss'],
})
export class CardColorsDemoComponent {
  // Sparkline data for project cards
  projectProgress = [30, 35, 32, 38, 42, 45, 48, 52, 58, 62, 68, 75];

  // Task completion trends
  taskTrends = [12, 15, 13, 18, 22, 20, 25, 28, 30, 32, 35, 38];

  // System metrics
  cpuUsage = [45, 48, 52, 49, 55, 58, 62, 59, 65, 68, 70, 72];
  memoryUsage = [60, 62, 65, 63, 68, 70, 75, 72, 78, 80, 82, 85];
}
