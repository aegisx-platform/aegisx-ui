import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  DashboardService,
  SystemMetrics,
} from '../../../services/dashboard.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ax-system-metrics-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div>
      <!-- Header -->
      <div>
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container"
          >
            <mat-icon class="text-primary !text-xl">speed</mat-icon>
          </div>
          <div>
            <h3 class="text-base font-semibold text-on-surface">
              System Metrics
            </h3>
            <p class="text-xs text-muted">Real-time monitoring</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-success"
            ></span>
          </span>
          <span class="text-xs text-muted">Live</span>
        </div>
      </div>

      <!-- Content -->
      @if (loading() && !metrics()) {
        <div class="px-6 py-12 text-center">
          <div
            class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
          ></div>
          <p class="mt-3 text-sm text-muted">Loading metrics...</p>
        </div>
      } @else if (error()) {
        <div class="px-6 py-8 text-center">
          <mat-icon class="text-error !text-4xl mb-2">error_outline</mat-icon>
          <p class="text-sm text-muted">{{ error() }}</p>
        </div>
      } @else if (metrics()) {
        <div class="p-6 space-y-4">
          <!-- CPU Usage -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <mat-icon class="text-primary !text-lg">memory</mat-icon>
                <span class="text-sm font-medium text-on-surface"
                  >CPU Usage</span
                >
              </div>
              <span
                class="text-sm font-bold"
                [class.text-error]="cpuUsage() > 80"
                [class.text-warning]="cpuUsage() > 60 && cpuUsage() <= 80"
                [class.text-success]="cpuUsage() <= 60"
              >
                {{ cpuUsage() }}%
              </span>
            </div>
            <div
              class="flex h-3 rounded-full overflow-hidden bg-surface-container"
            >
              <div
                class="transition-all duration-500"
                [style.width.%]="cpuUsage()"
                [class.bg-error]="cpuUsage() > 80"
                [class.bg-warning]="cpuUsage() > 60 && cpuUsage() <= 80"
                [class.bg-surface-container0]="cpuUsage() <= 60"
              ></div>
            </div>
            <div class="mt-1 text-xs text-muted">
              {{ metrics()!.cpu.cores }} cores • Load:
              {{ metrics()!.cpu.loadAverage[0].toFixed(2) }}
            </div>
          </div>

          <!-- Memory Usage -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <mat-icon class="text-purple-600 !text-lg">storage</mat-icon>
                <span class="text-sm font-medium text-on-surface">Memory</span>
              </div>
              <span
                class="text-sm font-bold"
                [class.text-error]="memoryUsagePercent() > 85"
                [class.text-warning]="
                  memoryUsagePercent() > 70 && memoryUsagePercent() <= 85
                "
                [class.text-success]="memoryUsagePercent() <= 70"
              >
                {{ memoryUsagePercent() }}%
              </span>
            </div>
            <div
              class="flex h-3 rounded-full overflow-hidden bg-surface-container"
            >
              <div
                class="transition-all duration-500"
                [style.width.%]="memoryUsagePercent()"
                [class.bg-error]="memoryUsagePercent() > 85"
                [class.bg-warning]="
                  memoryUsagePercent() > 70 && memoryUsagePercent() <= 85
                "
                [class.bg-purple-500]="memoryUsagePercent() <= 70"
              ></div>
            </div>
            <div class="mt-1 text-xs text-muted">
              {{ formatBytes(metrics()!.memory.used) }} /
              {{ formatBytes(metrics()!.memory.total) }}
            </div>
          </div>

          <!-- Process Info -->
          <div>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-muted !text-base">timer</mat-icon>
                <div>
                  <div class="text-xs text-muted">Uptime</div>
                  <div class="text-sm font-semibold text-on-surface">
                    {{ formatUptime(metrics()!.process.uptime) }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <mat-icon class="text-muted !text-base">insights</mat-icon>
                <div>
                  <div class="text-xs text-muted">Process</div>
                  <div class="text-sm font-semibold text-on-surface">
                    {{ formatBytes(metrics()!.process.memoryUsage) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div>
          <div class="flex items-center justify-between text-xs text-muted">
            <span>Updated: {{ formatTimestamp(metrics()!.timestamp) }}</span>
            <span>Refreshes every 5s</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SystemMetricsWidget implements OnInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private metricsSubscription?: Subscription;

  metrics = signal<SystemMetrics | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    // Load immediately
    this.loadMetrics();

    // Refresh every 5 seconds
    this.metricsSubscription = interval(5000)
      .pipe(switchMap(() => this.dashboardService.getSystemMetrics()))
      .subscribe({
        next: (response) => {
          this.metrics.set(response.data);
          this.error.set(null);
        },
        error: (err) => {
          console.error('Failed to load system metrics:', err);
          this.error.set('Failed to load system metrics');
        },
      });
  }

  ngOnDestroy() {
    this.metricsSubscription?.unsubscribe();
  }

  loadMetrics() {
    this.loading.set(true);
    this.dashboardService.getSystemMetrics().subscribe({
      next: (response) => {
        this.metrics.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load system metrics:', err);
        this.error.set('Failed to load system metrics');
        this.loading.set(false);
      },
    });
  }

  cpuUsage(): number {
    return Math.round(this.metrics()?.cpu.usage || 0);
  }

  memoryUsagePercent(): number {
    return Math.round(this.metrics()?.memory.usagePercent || 0);
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }

  formatUptime(seconds: number): string {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  }
}
