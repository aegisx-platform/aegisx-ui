import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AxSparklineComponent, AxKpiCardComponent } from '@aegisx/ui';

@Component({
  selector: 'app-sparkline-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    AxSparklineComponent,
    AxKpiCardComponent,
  ],
  template: `
    <div class="docs-page">
      <!-- Page Header -->
      <div class="docs-header">
        <h1 class="docs-title">Sparkline Component</h1>
        <p class="docs-subtitle">
          Lightweight SVG-based sparkline charts for displaying trends inline
          with metrics. Perfect for dashboards and KPI cards.
        </p>
      </div>

      <!-- Pattern 1: Stock Price Trends -->
      <div class="section-header">
        <h2>Pattern 1: Stock Price / Revenue Trends</h2>
        <p>Inline sparklines with KPI values.</p>
      </div>

      <section>
        <h3
          class="text-lg font-semibold mb-4 text-green-700 dark:text-green-400"
        >
          ✨ New: ax-sparkline Component
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Revenue -->
          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="flex items-baseline justify-between mb-2">
                <span class="text-sm text-secondary">Revenue</span>
                <span class="text-sm font-medium text-success">+12.5%</span>
              </div>
              <div class="text-3xl font-semibold text-heading mb-3">
                $45,231
              </div>
              <ax-sparkline
                [data]="revenueData"
                variant="area"
                size="md"
                color="var(--ax-success-default)"
                [fillOpacity]="0.2"
              >
              </ax-sparkline>
            </mat-card-content>
          </mat-card>

          <!-- Users -->
          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="flex items-baseline justify-between mb-2">
                <span class="text-sm text-secondary">Active Users</span>
                <span class="text-sm font-medium text-info">+8.3%</span>
              </div>
              <div class="text-3xl font-semibold text-heading mb-3">2,543</div>
              <ax-sparkline
                [data]="usersData"
                variant="area"
                size="md"
                color="var(--ax-info-default)"
                [fillOpacity]="0.2"
              >
              </ax-sparkline>
            </mat-card-content>
          </mat-card>

          <!-- Orders -->
          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="flex items-baseline justify-between mb-2">
                <span class="text-sm text-secondary">Orders</span>
                <span class="text-sm font-medium text-error">-3.2%</span>
              </div>
              <div class="text-3xl font-semibold text-heading mb-3">892</div>
              <ax-sparkline
                [data]="ordersData"
                variant="area"
                size="md"
                color="var(--ax-error)"
                [fillOpacity]="0.2"
              >
              </ax-sparkline>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <!-- Pattern 2: Line vs Area Variants -->
      <div class="section-header">
        <h2>Pattern 2: Line vs Area Variants</h2>
        <p>Different visual styles for sparklines.</p>
      </div>

      <section>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Line Variant -->
          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="text-sm font-medium mb-3">Line Variant</div>
              <div class="flex items-center gap-4">
                <div class="flex-1">
                  <div class="text-2xl font-semibold text-heading">$2,845</div>
                  <div class="text-xs text-secondary mt-1">Daily average</div>
                </div>
                <ax-sparkline
                  [data]="trendData"
                  variant="line"
                  size="md"
                  color="var(--ax-info-default)"
                  [strokeWidth]="2"
                >
                </ax-sparkline>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Area Variant -->
          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="text-sm font-medium mb-3">Area Variant</div>
              <div class="flex items-center gap-4">
                <div class="flex-1">
                  <div class="text-2xl font-semibold text-heading">$2,845</div>
                  <div class="text-xs text-secondary mt-1">Daily average</div>
                </div>
                <ax-sparkline
                  [data]="trendData"
                  variant="area"
                  size="md"
                  color="var(--ax-info-default)"
                  [fillOpacity]="0.3"
                >
                </ax-sparkline>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <!-- Pattern 3: Size Variants -->
      <div class="section-header">
        <h2>Pattern 3: Size Variants</h2>
        <p>Small, medium, and large sparklines.</p>
      </div>

      <section>
        <div class="space-y-4">
          <!-- Small -->
          <div class="flex items-center gap-4">
            <div class="w-32">
              <div class="text-sm font-medium">Small (60x24)</div>
            </div>
            <ax-sparkline
              [data]="sampleData"
              variant="line"
              size="sm"
              color="var(--ax-info-default)"
            >
            </ax-sparkline>
          </div>

          <!-- Medium -->
          <div class="flex items-center gap-4">
            <div class="w-32">
              <div class="text-sm font-medium">Medium (100x40)</div>
            </div>
            <ax-sparkline
              [data]="sampleData"
              variant="line"
              size="md"
              color="var(--ax-info-default)"
            >
            </ax-sparkline>
          </div>

          <!-- Large -->
          <div class="flex items-center gap-4">
            <div class="w-32">
              <div class="text-sm font-medium">Large (150x60)</div>
            </div>
            <ax-sparkline
              [data]="sampleData"
              variant="line"
              size="lg"
              color="var(--ax-info-default)"
            >
            </ax-sparkline>
          </div>
        </div>
      </section>

      <!-- Pattern 4: Color Variants -->
      <div class="section-header">
        <h2>Pattern 4: Color Variants</h2>
        <p>Different colors for different metric types.</p>
      </div>

      <section>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="text-center">
            <ax-sparkline
              [data]="sampleData"
              variant="area"
              size="md"
              color="var(--ax-info-default)"
            >
            </ax-sparkline>
            <div class="text-xs text-secondary mt-2">Info</div>
          </div>

          <div class="text-center">
            <ax-sparkline
              [data]="sampleData"
              variant="area"
              size="md"
              color="var(--ax-success-default)"
            >
            </ax-sparkline>
            <div class="text-xs text-secondary mt-2">Success</div>
          </div>

          <div class="text-center">
            <ax-sparkline
              [data]="sampleData"
              variant="area"
              size="md"
              color="var(--ax-warning-default)"
            >
            </ax-sparkline>
            <div class="text-xs text-secondary mt-2">Warning</div>
          </div>

          <div class="text-center">
            <ax-sparkline
              [data]="sampleData"
              variant="area"
              size="md"
              color="var(--ax-error)"
            >
            </ax-sparkline>
            <div class="text-xs text-secondary mt-2">Error</div>
          </div>

          <div class="text-center">
            <ax-sparkline
              [data]="sampleData"
              variant="area"
              size="md"
              color="var(--ax-purple-default)"
            >
            </ax-sparkline>
            <div class="text-xs text-secondary mt-2">Purple</div>
          </div>
        </div>
      </section>

      <!-- Pattern 5: Smooth vs Linear -->
      <div class="section-header">
        <h2>Pattern 5: Smooth Curves vs Straight Lines</h2>
        <p>Toggle between smooth curves and linear interpolation.</p>
      </div>

      <section>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Smooth -->
          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="text-sm font-medium mb-3">Smooth Curves</div>
              <ax-sparkline
                [data]="volatileData"
                variant="line"
                size="lg"
                color="var(--ax-info-default)"
                [smooth]="true"
                [strokeWidth]="2"
              >
              </ax-sparkline>
            </mat-card-content>
          </mat-card>

          <!-- Linear -->
          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="text-sm font-medium mb-3">Straight Lines</div>
              <ax-sparkline
                [data]="volatileData"
                variant="line"
                size="lg"
                color="var(--ax-info-default)"
                [smooth]="false"
                [strokeWidth]="2"
              >
              </ax-sparkline>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <!-- Pattern 6: With Data Points -->
      <div class="section-header">
        <h2>Pattern 6: Data Point Indicators</h2>
        <p>Show dots on data points (visible on hover).</p>
      </div>

      <section>
        <mat-card class="kpi-card max-w-md">
          <mat-card-content>
            <div class="text-sm font-medium mb-3">Hover to see data points</div>
            <ax-sparkline
              [data]="sampleData"
              variant="area"
              size="lg"
              color="var(--ax-info-default)"
              [showDots]="false"
              [dotRadius]="4"
              [fillOpacity]="0.2"
            >
            </ax-sparkline>
          </mat-card-content>
        </mat-card>
      </section>

      <!-- Benefits Summary -->
      <div class="section-header">
        <h2>Component Benefits</h2>
      </div>

      <section>
        <mat-card class="kpi-card">
          <mat-card-content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-semibold mb-3">✨ Features</h3>
                <ul class="space-y-2 text-sm">
                  <li>✅ SVG-based (lightweight)</li>
                  <li>✅ Line and area variants</li>
                  <li>✅ 3 size options (sm, md, lg)</li>
                  <li>✅ Smooth curves or linear interpolation</li>
                  <li>✅ Optional data point dots</li>
                  <li>✅ Custom colors via design tokens</li>
                  <li>✅ Automatic scaling</li>
                  <li>✅ Full dark mode support</li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-3">🎨 Use Cases</h3>
                <ul class="space-y-2 text-sm">
                  <li>• Stock price trends</li>
                  <li>• Revenue/sales trends</li>
                  <li>• User activity patterns</li>
                  <li>• Server metrics (CPU, memory)</li>
                  <li>• Response time trends</li>
                  <li>• Dashboard KPIs</li>
                </ul>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </section>
    </div>
  `,
  styles: [
    `
      .kpi-card {
        background-color: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        transition: all 0.2s ease;
      }

      .kpi-card:hover {
        box-shadow: var(--ax-shadow-sm);
      }
    `,
  ],
})
export class SparklineDemoComponent {
  // Sample data for demos
  revenueData = [28000, 32000, 29500, 35000, 38000, 36000, 40000, 42000, 45231];
  usersData = [1800, 1950, 2100, 2050, 2200, 2300, 2400, 2500, 2543];
  ordersData = [950, 920, 900, 880, 910, 905, 895, 900, 892];
  trendData = [1500, 2100, 1800, 2400, 2800, 2600, 3000, 2845];
  sampleData = [10, 30, 20, 50, 40, 60, 55, 70];
  volatileData = [20, 45, 28, 60, 35, 75, 40, 85, 50, 90, 65, 95];
}
