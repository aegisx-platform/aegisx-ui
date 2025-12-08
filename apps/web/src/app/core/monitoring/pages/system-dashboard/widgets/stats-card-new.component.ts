import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface StatsCardDataNew {
  title: string;
  value: string | number;
  icon: string;
  change?: number;
  changeLabel?: string;
  color: 'blue' | 'emerald' | 'amber' | 'cyan' | 'violet' | 'rose';
  trend?: 'up' | 'down' | 'neutral';
}

@Component({
  selector: 'ax-stats-card-new',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div>
      <!-- Header with Icon -->
      <div class="flex items-center justify-between mb-4">
        <div
          [class]="iconBgClass()"
          class="flex h-12 w-12 items-center justify-center rounded-lg"
        >
          <mat-icon [class]="iconColorClass()" class="!text-2xl">{{
            data.icon
          }}</mat-icon>
        </div>
        @if (data.change !== undefined) {
          <div
            class="flex items-center gap-1 text-sm font-medium"
            [class]="changeColorClass()"
          >
            <mat-icon class="!text-base">{{ trendIcon() }}</mat-icon>
            <span>{{ Math.abs(data.change) }}%</span>
          </div>
        }
      </div>

      <!-- Title -->
      <h3 class="text-sm font-medium text-muted mb-1">{{ data.title }}</h3>

      <!-- Value -->
      <div class="flex items-baseline gap-2">
        <p class="text-3xl font-bold text-on-surface">{{ formattedValue() }}</p>
      </div>

      <!-- Change Label -->
      @if (data.changeLabel) {
        <p class="text-xs text-muted mt-2">{{ data.changeLabel }}</p>
      }

      <!-- Sparkline (optional) -->
      @if (showSparkline && sparklineData().length > 0) {
        <div class="mt-4 flex items-end gap-1 h-12">
          @for (point of sparklineData(); track $index) {
            <div
              class="flex-1 rounded-t transition-all duration-300 hover:opacity-70"
              [style.height.%]="point"
              [class]="sparklineColorClass()"
            ></div>
          }
        </div>
      }

      <!-- Action Button -->
      @if (actionLabel) {
        <button
          class="mt-4 w-full text-sm font-medium text-muted hover:text-on-surface
                 flex items-center justify-center gap-1 py-2 rounded-lg  transition-colors"
          (click)="onAction()"
        >
          <span>{{ actionLabel }}</span>
          <mat-icon class="!text-base">arrow_forward</mat-icon>
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class StatsCardNewComponent {
  @Input({ required: true }) data!: StatsCardDataNew;
  @Input() showSparkline = false;
  @Input() actionLabel?: string;

  Math = Math;
  sparklineData = signal<number[]>([]);

  ngOnInit() {
    if (this.showSparkline) {
      this.generateSparklineData();
    }
  }

  formattedValue = computed(() => {
    const value = this.data.value;
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
    }
    return value;
  });

  // Tremor color classes
  iconBgClass = computed(() => {
    const colorMap = {
      blue: 'bg-surface-container',
      emerald: 'bg-surface-container',
      amber: 'bg-surface-container',
      cyan: 'bg-cyan-50',
      violet: 'bg-violet-50',
      rose: 'bg-rose-50',
    };
    return colorMap[this.data.color] || 'bg-surface-container';
  });

  iconColorClass = computed(() => {
    const colorMap = {
      blue: 'text-primary',
      emerald: 'text-success',
      amber: 'text-warning',
      cyan: 'text-cyan-600',
      violet: 'text-violet-600',
      rose: 'text-error',
    };
    return colorMap[this.data.color] || 'text-primary';
  });

  sparklineColorClass = computed(() => {
    const colorMap = {
      blue: 'bg-primary',
      emerald: 'bg-surface-container0',
      amber: 'bg-warning',
      cyan: 'bg-cyan-500',
      violet: 'bg-violet-500',
      rose: 'bg-rose-500',
    };
    return colorMap[this.data.color] || 'bg-primary';
  });

  changeColorClass = computed(() => {
    if (this.data.trend === 'up') {
      return 'text-success';
    } else if (this.data.trend === 'down') {
      return 'text-error';
    }
    return 'text-muted';
  });

  trendIcon = computed(() => {
    if (this.data.trend === 'up') return 'trending_up';
    if (this.data.trend === 'down') return 'trending_down';
    return 'trending_flat';
  });

  generateSparklineData() {
    // Generate 12 random data points for sparkline (simulating monthly data)
    const data = Array.from({ length: 12 }, () => Math.random() * 100);
    this.sparklineData.set(data);
  }

  onAction() {
    console.log('Action clicked for:', this.data.title);
  }
}
