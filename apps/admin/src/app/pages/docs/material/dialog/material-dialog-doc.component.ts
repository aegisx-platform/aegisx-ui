import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-dialog-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-dialog-doc">
      <ax-doc-header
        title="Dialog"
        description="Dialogs inform users about a task and can contain critical information or actions."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-dialog-doc__header-links">
          <a
            href="https://material.angular.io/components/dialog/overview"
            target="_blank"
            rel="noopener"
            class="material-dialog-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-dialog-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-dialog-doc__section">
            <h2 class="material-dialog-doc__section-title">Dialog Types</h2>

            <h3 class="material-dialog-doc__subsection-title">Basic Dialog</h3>
            <ax-live-preview title="Open a simple dialog">
              <button
                mat-flat-button
                color="primary"
                (click)="openBasicDialog()"
              >
                Open Basic Dialog
              </button>
            </ax-live-preview>

            <h3 class="material-dialog-doc__subsection-title">
              Confirmation Dialog
            </h3>
            <ax-live-preview title="Dialog with confirm/cancel actions">
              <button
                mat-flat-button
                color="warn"
                (click)="openConfirmDialog()"
              >
                Delete Item
              </button>
            </ax-live-preview>

            <h3 class="material-dialog-doc__subsection-title">Dialog Sizes</h3>
            <ax-live-preview title="Different dialog widths">
              <div class="button-row">
                <button mat-stroked-button (click)="openDialog('300px')">
                  Small (300px)
                </button>
                <button mat-stroked-button (click)="openDialog('500px')">
                  Medium (500px)
                </button>
                <button mat-stroked-button (click)="openDialog('800px')">
                  Large (800px)
                </button>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-dialog-doc__section">
            <h2 class="material-dialog-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-dialog-doc__section">
            <h2 class="material-dialog-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >MatDialogConfig</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-dialog-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>width</code></td>
                      <td><code>string</code></td>
                      <td>Dialog width</td>
                    </tr>
                    <tr>
                      <td><code>height</code></td>
                      <td><code>string</code></td>
                      <td>Dialog height</td>
                    </tr>
                    <tr>
                      <td><code>data</code></td>
                      <td><code>any</code></td>
                      <td>Data to pass to dialog</td>
                    </tr>
                    <tr>
                      <td><code>disableClose</code></td>
                      <td><code>boolean</code></td>
                      <td>Prevent closing on backdrop click</td>
                    </tr>
                    <tr>
                      <td><code>panelClass</code></td>
                      <td><code>string | string[]</code></td>
                      <td>Custom CSS class</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-dialog-doc__section">
            <h2 class="material-dialog-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="dialogTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-dialog-doc {
        max-width: 1000px;
        margin: 0 auto;
        &__header-links {
          display: flex;
          gap: var(--ax-spacing-md);
          margin-top: var(--ax-spacing-md);
        }
        &__external-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8125rem;
          color: var(--ax-brand-default);
          text-decoration: none;
          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
          &:hover {
            text-decoration: underline;
          }
        }
        &__tabs {
          margin-top: var(--ax-spacing-lg);
        }
        &__section {
          padding: var(--ax-spacing-lg);
        }
        &__section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ax-text-strong);
          margin: 0 0 var(--ax-spacing-sm) 0;
        }
        &__subsection-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ax-text-strong);
          margin: var(--ax-spacing-xl) 0 var(--ax-spacing-md) 0;
        }
        &__api-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          th,
          td {
            padding: var(--ax-spacing-sm) var(--ax-spacing-md);
            text-align: left;
            border-bottom: 1px solid var(--ax-border-default);
          }
          th {
            font-weight: 600;
            background: var(--ax-background-subtle);
          }
          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
          }
        }
        .button-row {
          display: flex;
          gap: var(--ax-spacing-sm);
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class MaterialDialogDocComponent {
  private dialog = inject(MatDialog);

  openBasicDialog() {
    this.dialog.open(ExampleDialogComponent, {
      width: '400px',
      data: {
        title: 'Basic Dialog',
        message: 'This is a basic dialog with AegisX styling.',
      },
    });
  }

  openConfirmDialog() {
    this.dialog.open(ExampleDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this item?',
        isConfirm: true,
      },
    });
  }

  openDialog(width: string) {
    this.dialog.open(ExampleDialogComponent, {
      width,
      data: { title: 'Dialog', message: `This dialog has width: ${width}` },
    });
  }

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatDialog } from '@angular/material/dialog';

@Component({...})
export class MyComponent {
  private dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(MyDialogComponent, {
      width: '400px',
      data: { title: 'Hello' }
    });
  }
}`,
    },
  ];

  dialogTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-dialog-container-shape',
      usage: 'Border radius',
      value: 'var(--ax-radius-lg)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-dialog-container-elevation',
      usage: 'Shadow',
      value: 'var(--ax-shadow-xl)',
      category: 'Elevation',
    },
    {
      cssVar: '--mdc-dialog-container-color',
      usage: 'Background color',
      value: 'var(--ax-background-default)',
      category: 'Background',
    },
  ];
}

// Simple dialog component for demo
@Component({
  selector: 'app-example-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      @if (data.isConfirm) {
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-flat-button color="warn" mat-dialog-close="confirm">
          Delete
        </button>
      } @else {
        <button mat-flat-button color="primary" mat-dialog-close>Close</button>
      }
    </mat-dialog-actions>
  `,
})
export class ExampleDialogComponent {
  data = inject<{ title: string; message: string; isConfirm?: boolean }>(
    MAT_DIALOG_DATA,
  );
}

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
