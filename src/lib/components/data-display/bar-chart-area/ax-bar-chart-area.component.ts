import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

export interface BarChartPeriod {
  readonly id: string;
  readonly label: string;
}

/**
 * <ax-bar-chart-area>
 *
 * Title + period selector + paired bar chart designed to sit directly
 * on a dark surface (no card background). Two series per x-tick
 * (primary + secondary) with dashed horizontal grid, plus a bottom
 * legend. Uses ng2-charts / Chart.js 4.
 */
@Component({
  selector: 'ax-bar-chart-area',
  standalone: true,
  imports: [MatButtonToggleModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ax-bar-chart-area" role="region" [attr.aria-label]="title">
      <header class="ax-bar-chart-area__header">
        <h3 class="ax-bar-chart-area__title">{{ title }}</h3>
        <mat-button-toggle-group
          class="ax-bar-chart-area__periods"
          [value]="activePeriodSignal()"
          (change)="onPeriodChange($event.value)"
          aria-label="Period selector"
          hideSingleSelectionIndicator
        >
          @for (p of periods; track p.id) {
            <mat-button-toggle [value]="p.id">{{ p.label }}</mat-button-toggle>
          }
        </mat-button-toggle-group>
      </header>

      <div class="ax-bar-chart-area__canvas">
        <canvas
          baseChart
          type="bar"
          [data]="chartData()"
          [options]="chartOptions"
        ></canvas>
      </div>

      <footer class="ax-bar-chart-area__legend">
        <div class="ax-bar-chart-area__legend-item">
          <span
            class="ax-bar-chart-area__legend-dot"
            style="background: var(--ax-dashboard-accent, #3b82f6);"
          ></span>
          <span>{{ primaryLegend }}</span>
        </div>
        @if (secondarySignal()?.length) {
          <div class="ax-bar-chart-area__legend-item">
            <span
              class="ax-bar-chart-area__legend-dot"
              style="background: var(--ax-dashboard-accent-soft, #93c5fd);"
            ></span>
            <span>{{ secondaryLegend }}</span>
          </div>
        }
      </footer>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .ax-bar-chart-area {
        display: flex;
        flex-direction: column;
        gap: 12px;
        color: #fff;
        height: 100%;
        min-height: 280px;
      }

      .ax-bar-chart-area__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      .ax-bar-chart-area__title {
        font-size: 15px;
        font-weight: 600;
        margin: 0;
        color: rgba(255, 255, 255, 0.92);
      }

      .ax-bar-chart-area__periods {
        background: transparent;

        ::ng-deep .mat-button-toggle {
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
          border: none;
        }

        ::ng-deep .mat-button-toggle-checked {
          background: rgba(255, 255, 255, 0.14);
          color: #fff;
          border-radius: 10px;
        }

        ::ng-deep .mat-button-toggle-label-content {
          padding: 4px 12px;
          line-height: 26px;
          font-size: 12px;
        }

        ::ng-deep .mat-button-toggle-appearance-standard {
          border-left: none !important;
        }
      }

      .ax-bar-chart-area__canvas {
        position: relative;
        flex: 1 1 auto;
        min-height: 200px;
      }

      .ax-bar-chart-area__legend {
        display: flex;
        justify-content: flex-end;
        gap: 20px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }

      .ax-bar-chart-area__legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .ax-bar-chart-area__legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
    `,
  ],
})
export class AxBarChartAreaComponent {
  @Input() title = '';
  @Input() periods: readonly BarChartPeriod[] = [
    { id: 'D', label: 'D' },
    { id: 'W', label: 'W' },
    { id: 'M', label: 'M' },
    { id: 'Y', label: 'Y' },
  ];
  @Input() set activePeriod(value: string) {
    this.activePeriodSignal.set(value);
  }
  @Input() labels: readonly string[] = [];
  @Input() set primary(value: readonly number[]) {
    this.primarySignal.set(value);
  }
  @Input() set secondary(value: readonly number[] | undefined) {
    this.secondarySignal.set(value);
  }
  @Input() primaryLegend = 'Primary';
  @Input() secondaryLegend = 'Secondary';

  @Output() periodChange = new EventEmitter<string>();

  readonly activePeriodSignal = signal<string>('M');
  private readonly primarySignal = signal<readonly number[]>([]);
  readonly secondarySignal = signal<readonly number[] | undefined>(undefined);

  readonly chartData = computed<ChartData<'bar'>>(() => {
    const datasets: ChartConfiguration<'bar'>['data']['datasets'] = [
      {
        data: Array.from(this.primarySignal()),
        backgroundColor:
          'var(--ax-dashboard-accent, #3b82f6)' as unknown as string,
        borderRadius: 3,
        barThickness: 8,
        categoryPercentage: 0.6,
        barPercentage: 0.85,
      },
    ];
    const secondary = this.secondarySignal();
    if (secondary && secondary.length > 0) {
      datasets.push({
        data: Array.from(secondary),
        backgroundColor:
          'var(--ax-dashboard-accent-soft, #93c5fd)' as unknown as string,
        borderRadius: 3,
        barThickness: 8,
        categoryPercentage: 0.6,
        barPercentage: 0.85,
      });
    }
    return {
      labels: Array.from(this.labels),
      datasets,
    };
  });

  readonly chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 12, weight: 500 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: 'rgba(255,255,255,0.55)',
          font: { size: 11 },
        },
        border: { display: false },
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.08)',
        },
        ticks: {
          color: 'rgba(255,255,255,0.45)',
          font: { size: 11 },
          stepSize: 300,
        },
        border: { display: false },
        suggestedMax: 900,
      },
    },
  };

  onPeriodChange(value: string): void {
    this.activePeriodSignal.set(value);
    this.periodChange.emit(value);
  }
}
