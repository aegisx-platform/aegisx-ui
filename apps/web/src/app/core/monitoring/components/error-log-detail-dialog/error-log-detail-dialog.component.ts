import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { ErrorLog } from '../../models/monitoring.types';

@Component({
  selector: 'app-error-log-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatCardModule,
  ],
  template: `
    <!-- Header -->
    <div class="dialog-header">
      <mat-icon [class]="getLevelIconClass()" class="!leading-[1]">
        {{ getLevelIcon() }}
      </mat-icon>
      <h2
        mat-dialog-title
        class="!text-base !font-semibold !mb-0 !leading-tight !ml-2"
      >
        Error Log Details
      </h2>
      <span class="text-xs text-slate-500 !ml-2">{{
        data.timestamp | date: 'medium'
      }}</span>
      <div class="flex-1"></div>
      <button
        mat-icon-button
        [mat-dialog-close]="null"
        class="close-button !w-8 !h-8"
      >
        <mat-icon class="!text-[20px]">close</mat-icon>
      </button>
    </div>

    <!-- Content -->
    <mat-dialog-content class="dialog-content">
      <!-- Error Info Section -->
      <mat-card
        appearance="outlined"
        class="info-card mb-4 border border-slate-200 rounded-xl"
      >
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 !mb-0">
            <mat-icon
              class="text-blue-500 !text-[20px] !w-[20px] !h-[20px] !leading-[1]"
              >info</mat-icon
            >
            <span>Error Information</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-4">
          <div class="info-grid">
            <!-- Level & Type -->
            <div class="info-row">
              <span class="info-label">Level:</span>
              <mat-chip [class]="getLevelChipClass()">
                {{ data.level.toUpperCase() }}
              </mat-chip>
            </div>
            <div class="info-row">
              <span class="info-label">Type:</span>
              <mat-chip class="type-chip">
                {{ data.type }}
              </mat-chip>
            </div>

            <!-- Message -->
            <div class="info-row full-width">
              <span class="info-label">Message:</span>
              <span class="info-value break-words">{{ data.message }}</span>
            </div>

            <!-- URL (if exists) -->
            <div *ngIf="data.url" class="info-row full-width">
              <span class="info-label">URL:</span>
              <code class="url-code break-all">{{ data.url }}</code>
            </div>

            <!-- Error ID -->
            <div class="info-row full-width">
              <span class="info-label">Error ID:</span>
              <code class="id-code">{{ data.id }}</code>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Stack Trace Section -->
      <mat-card
        *ngIf="data.stack"
        appearance="outlined"
        class="info-card mb-4 border border-slate-200 rounded-xl"
      >
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 !mb-0">
            <mat-icon
              class="text-rose-500 !text-[20px] !w-[20px] !h-[20px] !leading-[1]"
              >code</mat-icon
            >
            <span>Stack Trace</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-4">
          <pre class="stack-trace">{{ data.stack }}</pre>
        </mat-card-content>
      </mat-card>

      <!-- User Context Section -->
      <mat-card
        *ngIf="hasUserContext()"
        appearance="outlined"
        class="info-card mb-4 border border-slate-200 rounded-xl"
      >
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 !mb-0">
            <mat-icon
              class="text-purple-500 !text-[20px] !w-[20px] !h-[20px] !leading-[1]"
              >person</mat-icon
            >
            <span>User Context</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-4">
          <div class="info-grid">
            <div *ngIf="data.userId" class="info-row">
              <span class="info-label">User ID:</span>
              <code class="id-code">{{ data.userId }}</code>
            </div>
            <div *ngIf="data.sessionId" class="info-row">
              <span class="info-label">Session ID:</span>
              <code class="id-code">{{ data.sessionId }}</code>
            </div>
            <div *ngIf="data.userAgent" class="info-row full-width">
              <span class="info-label">User Agent:</span>
              <span class="info-value text-xs break-words">{{
                data.userAgent
              }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Request Context Section -->
      <mat-card
        *ngIf="hasRequestContext()"
        appearance="outlined"
        class="info-card mb-4 border border-slate-200 rounded-xl"
      >
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 !mb-0">
            <mat-icon
              class="text-slate-500 !text-[20px] !w-[20px] !h-[20px] !leading-[1]"
              >http</mat-icon
            >
            <span>Request Context</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-4">
          <div class="info-grid">
            <div *ngIf="data.correlationId" class="info-row">
              <span class="info-label">Correlation ID:</span>
              <code class="id-code">{{ data.correlationId }}</code>
            </div>
            <div *ngIf="data.ipAddress" class="info-row">
              <span class="info-label">IP Address:</span>
              <code class="id-code">{{ data.ipAddress }}</code>
            </div>
            <div *ngIf="data.referer" class="info-row full-width">
              <span class="info-label">Referer:</span>
              <code class="url-code break-all">{{ data.referer }}</code>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Additional Context Section -->
      <mat-card
        *ngIf="data.context"
        appearance="outlined"
        class="info-card border border-slate-200 rounded-xl"
      >
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 !mb-0">
            <mat-icon
              class="text-orange-400 !text-[20px] !w-[20px] !h-[20px] !leading-[1]"
              >data_object</mat-icon
            >
            <span>Additional Context</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-4">
          <pre class="context-json">{{ formatContext(data.context) }}</pre>
        </mat-card-content>
      </mat-card>

      <!-- Timestamps Section -->
      <mat-card
        appearance="outlined"
        class="info-card mt-4 border border-slate-200 rounded-xl"
      >
        <mat-card-header>
          <mat-card-title class="flex items-center gap-2 !mb-0">
            <mat-icon
              class="text-slate-500 !text-[20px] !w-[20px] !h-[20px] !leading-[1]"
              >schedule</mat-icon
            >
            <span>Timestamps</span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-4">
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Client Time:</span>
              <span class="info-value">{{
                data.timestamp | date: 'medium'
              }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Server Time:</span>
              <span class="info-value">{{
                data.serverTimestamp | date: 'medium'
              }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Created At:</span>
              <span class="info-value">{{
                data.createdAt | date: 'medium'
              }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </mat-dialog-content>

    <!-- Footer -->
    <mat-dialog-actions align="end" class="dialog-footer">
      <button mat-button [mat-dialog-close]="null">
        <mat-icon>close</mat-icon>
        Close
      </button>
      <button mat-raised-button color="primary" (click)="copyToClipboard()">
        <mat-icon>content_copy</mat-icon>
        Copy Details
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-header {
        display: flex;
        align-items: center;
        padding: 10px 16px;
        border-bottom: 1px solid #e2e8f0;
        gap: 0;
      }

      .dialog-header h2 {
        margin: 0;
        color: #1f2937;
      }

      .close-button {
        margin: -4px -4px -4px 0;
      }

      .dialog-content {
        max-height: 70vh;
        overflow-y: auto;
        padding: 24px;
      }

      .dialog-footer {
        padding: 16px 24px;
        border-top: 1px solid #e2e8f0;
        gap: 12px;
      }

      .info-card {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .info-card mat-card-header {
        padding: 16px 16px 0;
      }

      .info-card mat-card-title {
        font-size: 1rem;
        font-weight: 600;
        color: #374151;
      }

      .info-card mat-card-content {
        padding: 16px;
      }

      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .info-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .info-row.full-width {
        grid-column: 1 / -1;
      }

      .info-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .info-value {
        font-size: 0.875rem;
        color: #1f2937;
        line-height: 1.5;
      }

      .url-code,
      .id-code {
        font-family: 'Courier New', monospace;
        font-size: 0.813rem;
        background-color: #f3f4f6;
        padding: 6px 10px;
        border-radius: 4px;
        color: #374151;
        display: inline-block;
      }

      .stack-trace {
        font-family: 'Courier New', monospace;
        font-size: 0.813rem;
        background-color: #1f2937;
        color: #f3f4f6;
        padding: 16px;
        border-radius: 6px;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        margin: 0;
        line-height: 1.6;
      }

      .context-json {
        font-family: 'Courier New', monospace;
        font-size: 0.813rem;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        padding: 16px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 0;
        line-height: 1.6;
        color: #1f2937;
      }

      mat-chip.level-error {
        background-color: #fee2e2 !important;
        color: #991b1b !important;
      }

      mat-chip.level-warn {
        background-color: #fef3c7 !important;
        color: #92400e !important;
      }

      mat-chip.level-info {
        background-color: #dbeafe !important;
        color: #1e40af !important;
      }

      mat-chip.type-chip {
        background-color: #ede9fe !important;
        color: #5b21b6 !important;
      }

      .icon-error {
        color: #f43f5e;
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }

      .icon-warn {
        color: #fb923c;
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }

      .icon-info {
        color: #3b82f6;
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }

      ::ng-deep .mat-mdc-dialog-surface {
        border-radius: 12px !important;
      }
    `,
  ],
})
export class ErrorLogDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorLogDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorLog,
  ) {}

  getLevelIcon(): string {
    switch (this.data.level) {
      case 'error':
        return 'error';
      case 'warn':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }

  getLevelIconClass(): string {
    switch (this.data.level) {
      case 'error':
        return 'icon-error';
      case 'warn':
        return 'icon-warn';
      case 'info':
        return 'icon-info';
      default:
        return 'icon-info';
    }
  }

  getLevelChipClass(): string {
    switch (this.data.level) {
      case 'error':
        return 'level-error';
      case 'warn':
        return 'level-warn';
      case 'info':
        return 'level-info';
      default:
        return 'level-info';
    }
  }

  hasUserContext(): boolean {
    return !!(this.data.userId || this.data.sessionId || this.data.userAgent);
  }

  hasRequestContext(): boolean {
    return !!(
      this.data.correlationId ||
      this.data.ipAddress ||
      this.data.referer
    );
  }

  formatContext(context: Record<string, any>): string {
    return JSON.stringify(context, null, 2);
  }

  copyToClipboard(): void {
    const details = this.formatErrorDetails();
    navigator.clipboard.writeText(details).then(
      () => {
        // Success - close dialog and return true to show success message
        this.dialogRef.close(true);
      },
      (err) => {
        console.error('Failed to copy to clipboard:', err);
        // Don't close dialog on error, user can try again
      },
    );
  }

  private formatErrorDetails(): string {
    let details = `Error Log Details
==================

Level: ${this.data.level.toUpperCase()}
Type: ${this.data.type}
Message: ${this.data.message}
${this.data.url ? `URL: ${this.data.url}` : ''}
Error ID: ${this.data.id}

`;

    if (this.data.stack) {
      details += `Stack Trace:
${this.data.stack}

`;
    }

    if (this.hasUserContext()) {
      details += `User Context:
${this.data.userId ? `User ID: ${this.data.userId}` : ''}
${this.data.sessionId ? `Session ID: ${this.data.sessionId}` : ''}
${this.data.userAgent ? `User Agent: ${this.data.userAgent}` : ''}

`;
    }

    if (this.hasRequestContext()) {
      details += `Request Context:
${this.data.correlationId ? `Correlation ID: ${this.data.correlationId}` : ''}
${this.data.ipAddress ? `IP Address: ${this.data.ipAddress}` : ''}
${this.data.referer ? `Referer: ${this.data.referer}` : ''}

`;
    }

    if (this.data.context) {
      details += `Additional Context:
${JSON.stringify(this.data.context, null, 2)}

`;
    }

    details += `Timestamps:
Client Time: ${this.data.timestamp}
Server Time: ${this.data.serverTimestamp}
Created At: ${this.data.createdAt}
`;

    return details;
  }
}
