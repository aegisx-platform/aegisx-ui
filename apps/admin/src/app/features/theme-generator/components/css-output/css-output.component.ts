import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeGeneratorService } from '../../services/theme-generator.service';
import { ExportFormat } from '../../models/theme-generator.types';

@Component({
  selector: 'app-css-output',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="css-output">
      <div class="output-header">
        <h4 class="output-title">Export Theme</h4>
        <div class="format-tabs">
          @for (format of formats; track format.id) {
            <button
              type="button"
              class="format-tab"
              [class.active]="selectedFormat() === format.id"
              (click)="selectedFormat.set(format.id)"
            >
              {{ format.label }}
            </button>
          }
        </div>
      </div>

      <div class="output-content">
        <pre class="code-block"><code>{{ getOutput() }}</code></pre>
      </div>

      <div class="output-actions">
        <div class="action-options">
          <label class="checkbox-option">
            <input type="checkbox" [(ngModel)]="includeComments" />
            <span>Include comments</span>
          </label>
          <label class="checkbox-option">
            <input type="checkbox" [(ngModel)]="minify" />
            <span>Minify</span>
          </label>
        </div>

        <div class="action-buttons">
          <button
            type="button"
            class="btn btn-outline"
            (click)="copyToClipboard()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path
                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
              />
            </svg>
            @if (copied()) {
              Copied!
            } @else {
              Copy
            }
          </button>
          <button type="button" class="btn btn-primary" (click)="download()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        </div>
      </div>

      @if (copied()) {
        <div class="copy-toast">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Copied to clipboard!
        </div>
      }
    </div>
  `,
  styles: [
    `
      .css-output {
        background: var(--ax-background-default, #fff);
        border-radius: 0.75rem;
        overflow: hidden;
        position: relative;
      }

      .output-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        background: var(--ax-background-muted, #f5f5f5);
        border-bottom: 1px solid var(--ax-border-default, #e5e5e5);
      }

      .output-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-default, #333);
      }

      .format-tabs {
        display: flex;
        gap: 0.25rem;
        background: var(--ax-background-default, #fff);
        padding: 0.25rem;
        border-radius: 0.5rem;
      }

      .format-tab {
        padding: 0.375rem 0.75rem;
        border: none;
        background: transparent;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--ax-text-muted, #666);
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .format-tab:hover {
        color: var(--ax-text-default, #333);
      }

      .format-tab.active {
        background: var(--ax-primary, #6366f1);
        color: #fff;
      }

      .output-content {
        max-height: 400px;
        overflow: auto;
      }

      .code-block {
        margin: 0;
        padding: 1rem;
        background: #1e1e1e;
        color: #d4d4d4;
        font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
        font-size: 0.75rem;
        line-height: 1.6;
        white-space: pre;
        overflow-x: auto;
      }

      .output-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--ax-border-default, #e5e5e5);
        background: var(--ax-background-muted, #f5f5f5);
      }

      .action-options {
        display: flex;
        gap: 1rem;
      }

      .checkbox-option {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.75rem;
        color: var(--ax-text-muted, #666);
        cursor: pointer;
      }

      .checkbox-option input {
        width: 0.875rem;
        height: 0.875rem;
        accent-color: var(--ax-primary, #6366f1);
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
      }

      .btn {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.5rem 0.875rem;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .btn-outline {
        background: transparent;
        border: 1px solid var(--ax-border-default, #e5e5e5);
        color: var(--ax-text-default, #333);
      }

      .btn-outline:hover {
        background: var(--ax-background-subtle, #f0f0f0);
      }

      .btn-primary {
        background: var(--ax-primary, #6366f1);
        border: none;
        color: #fff;
      }

      .btn-primary:hover {
        opacity: 0.9;
      }

      .copy-toast {
        position: absolute;
        bottom: 4.5rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--ax-success, #22c55e);
        color: #fff;
        border-radius: 0.5rem;
        font-size: 0.75rem;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: fadeInOut 2s ease-in-out;
      }

      @keyframes fadeInOut {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(10px);
        }
        15% {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        85% {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateX(-50%) translateY(-10px);
        }
      }
    `,
  ],
})
export class CssOutputComponent {
  private themeService = inject(ThemeGeneratorService);

  formats = [
    { id: 'css' as ExportFormat, label: 'CSS' },
    { id: 'scss' as ExportFormat, label: 'SCSS' },
    { id: 'tailwind' as ExportFormat, label: 'Tailwind' },
    { id: 'json' as ExportFormat, label: 'JSON' },
  ];

  selectedFormat = signal<ExportFormat>('css');
  includeComments = true;
  minify = false;
  copied = signal(false);

  getOutput(): string {
    return this.themeService.exportTheme({
      format: this.selectedFormat(),
      includeComments: this.includeComments,
      minify: this.minify,
      variablePrefix: 'ax',
    });
  }

  async copyToClipboard(): Promise<void> {
    await this.themeService.copyToClipboard({
      format: this.selectedFormat(),
      includeComments: this.includeComments,
      minify: this.minify,
      variablePrefix: 'ax',
    });

    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  download(): void {
    this.themeService.downloadTheme({
      format: this.selectedFormat(),
      includeComments: this.includeComments,
      minify: this.minify,
      variablePrefix: 'ax',
    });
  }
}
