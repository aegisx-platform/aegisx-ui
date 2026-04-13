import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ax-loading-state',
  standalone: true,
  imports: [MatProgressBarModule, MatIconModule],
  template: `
    <div
      class="ax-loading-state"
      [class.ax-loading-state-compact]="compact"
      [class.ax-loading-state-overlay]="overlay"
    >
      <div class="ax-loading-state-content">
        <!-- Icon (optional) -->
        @if (icon) {
          <mat-icon
            class="ax-loading-state-icon"
            [class.ax-loading-state-icon-lg]="!compact"
            [class.ax-loading-state-icon-md]="compact"
          >
            {{ icon }}
          </mat-icon>
        }

        <!-- Progress Bar -->
        <mat-progress-bar
          [mode]="mode"
          class="ax-loading-state-bar"
        ></mat-progress-bar>

        <!-- Message -->
        @if (message) {
          <p class="ax-loading-state-message">{{ message }}</p>
        }

        <!-- Custom Content Slot -->
        <div class="ax-loading-state-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-loading-state {
        background-color: var(--ax-background-default);
        border-radius: var(--ax-radius-lg);
        border: 1px solid var(--ax-border-default);
        padding: var(--ax-spacing-3xl);
        text-align: center;

        &.ax-loading-state-compact {
          padding: var(--ax-spacing-2xl);
        }

        &.ax-loading-state-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: color-mix(
            in srgb,
            var(--ax-background-default) 75%,
            transparent
          );
          backdrop-filter: blur(4px);
          border: none;
          border-radius: 0;
        }
      }

      .ax-loading-state-content {
        max-width: 24rem;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ax-spacing-md);
      }

      .ax-loading-state-icon {
        color: var(--ax-text-disabled);
        display: block;
        animation: ax-loading-pulse 2s ease-in-out infinite;

        &.ax-loading-state-icon-lg {
          font-size: 48px;
          width: 48px;
          height: 48px;
        }

        &.ax-loading-state-icon-md {
          font-size: 36px;
          width: 36px;
          height: 36px;
        }
      }

      .ax-loading-state-bar {
        width: 100%;
        max-width: 20rem;
        border-radius: var(--ax-radius-full);
      }

      .ax-loading-state-message {
        font-size: var(--ax-text-sm);
        color: var(--ax-text-secondary);
        margin: 0;
        line-height: var(--ax-leading-relaxed);
      }

      .ax-loading-state-body {
        &:empty {
          display: none;
        }
      }

      @keyframes ax-loading-pulse {
        0%,
        100% {
          opacity: 0.4;
        }
        50% {
          opacity: 1;
        }
      }
    `,
  ],
})
export class AxLoadingStateComponent {
  /** Icon to display above the progress bar */
  @Input() icon?: string;
  /** Loading message text */
  @Input() message: string = 'กำลังโหลดข้อมูล...';
  /** Compact mode with smaller padding */
  @Input() compact: boolean = false;
  /** Overlay mode — renders as a translucent backdrop over existing content */
  @Input() overlay: boolean = false;
  /** Progress bar mode */
  @Input() mode: 'indeterminate' | 'query' = 'indeterminate';
}
