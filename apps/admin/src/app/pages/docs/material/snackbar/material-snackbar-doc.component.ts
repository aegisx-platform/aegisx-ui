import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-snackbar-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-snackbar-doc">
      <ax-doc-header
        title="Snackbar"
        description="Snackbars provide brief messages about app processes at the bottom of the screen."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-snackbar-doc__header-links">
          <a
            href="https://material.angular.io/components/snack-bar/overview"
            target="_blank"
            rel="noopener"
            class="material-snackbar-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-snackbar-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-snackbar-doc__section">
            <h2 class="material-snackbar-doc__section-title">Snackbar Types</h2>

            <h3 class="material-snackbar-doc__subsection-title">
              Basic Snackbar
            </h3>
            <ax-live-preview title="Simple notification">
              <button mat-flat-button color="primary" (click)="openSnackbar()">
                Show Snackbar
              </button>
            </ax-live-preview>

            <h3 class="material-snackbar-doc__subsection-title">With Action</h3>
            <ax-live-preview title="Snackbar with action button">
              <button
                mat-flat-button
                color="primary"
                (click)="openSnackbarWithAction()"
              >
                Show with Action
              </button>
            </ax-live-preview>

            <h3 class="material-snackbar-doc__subsection-title">
              Custom Duration
            </h3>
            <ax-live-preview title="Different duration options">
              <div class="button-row">
                <button mat-stroked-button (click)="openSnackbarDuration(2000)">
                  2 seconds
                </button>
                <button mat-stroked-button (click)="openSnackbarDuration(5000)">
                  5 seconds
                </button>
                <button
                  mat-stroked-button
                  (click)="openSnackbarDuration(10000)"
                >
                  10 seconds
                </button>
              </div>
            </ax-live-preview>

            <h3 class="material-snackbar-doc__subsection-title">Positions</h3>
            <ax-live-preview title="Different snackbar positions">
              <div class="button-row">
                <button
                  mat-stroked-button
                  (click)="openSnackbarPosition('start', 'bottom')"
                >
                  Bottom Left
                </button>
                <button
                  mat-stroked-button
                  (click)="openSnackbarPosition('center', 'bottom')"
                >
                  Bottom Center
                </button>
                <button
                  mat-stroked-button
                  (click)="openSnackbarPosition('end', 'bottom')"
                >
                  Bottom Right
                </button>
                <button
                  mat-stroked-button
                  (click)="openSnackbarPosition('center', 'top')"
                >
                  Top Center
                </button>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-snackbar-doc__section">
            <h2 class="material-snackbar-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-snackbar-doc__section">
            <h2 class="material-snackbar-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >MatSnackBarConfig</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-snackbar-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>duration</code></td>
                      <td><code>number</code></td>
                      <td>Auto-dismiss time in ms</td>
                    </tr>
                    <tr>
                      <td><code>horizontalPosition</code></td>
                      <td><code>'start' | 'center' | 'end'</code></td>
                      <td>Horizontal position</td>
                    </tr>
                    <tr>
                      <td><code>verticalPosition</code></td>
                      <td><code>'top' | 'bottom'</code></td>
                      <td>Vertical position</td>
                    </tr>
                    <tr>
                      <td><code>panelClass</code></td>
                      <td><code>string | string[]</code></td>
                      <td>Custom CSS class</td>
                    </tr>
                    <tr>
                      <td><code>data</code></td>
                      <td><code>any</code></td>
                      <td>Data for custom component</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-snackbar-doc__section">
            <h2 class="material-snackbar-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="snackbarTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-snackbar-doc {
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
export class MaterialSnackbarDocComponent {
  private snackBar = inject(MatSnackBar);

  openSnackbar() {
    this.snackBar.open('This is a snackbar message', undefined, {
      duration: 3000,
    });
  }

  openSnackbarWithAction() {
    this.snackBar.open('Item deleted', 'Undo', {
      duration: 5000,
    });
  }

  openSnackbarDuration(duration: number) {
    this.snackBar.open(
      `This will close in ${duration / 1000} seconds`,
      undefined,
      {
        duration,
      },
    );
  }

  openSnackbarPosition(
    horizontal: 'start' | 'center' | 'end',
    vertical: 'top' | 'bottom',
  ) {
    this.snackBar.open(`Position: ${horizontal} ${vertical}`, undefined, {
      duration: 3000,
      horizontalPosition: horizontal,
      verticalPosition: vertical,
    });
  }

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatSnackBar } from '@angular/material/snack-bar';

@Component({...})
export class MyComponent {
  private snackBar = inject(MatSnackBar);

  showNotification() {
    // Simple message
    this.snackBar.open('Message sent!', undefined, {
      duration: 3000,
    });

    // With action button
    this.snackBar.open('Item deleted', 'Undo', {
      duration: 5000,
    }).onAction().subscribe(() => {
      console.log('Undo clicked');
    });

    // Custom position
    this.snackBar.open('Hello!', undefined, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}`,
    },
  ];

  snackbarTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-snackbar-container-color',
      usage: 'Background color',
      value: 'var(--ax-background-inverse)',
      category: 'Background',
    },
    {
      cssVar: '--mdc-snackbar-supporting-text-color',
      usage: 'Text color',
      value: 'var(--ax-text-inverse)',
      category: 'Text',
    },
    {
      cssVar: '--mat-snack-bar-button-color',
      usage: 'Action button color',
      value: 'var(--ax-brand-default)',
      category: 'Colors',
    },
    {
      cssVar: '--mdc-snackbar-container-shape',
      usage: 'Border radius',
      value: 'var(--ax-radius-sm)',
      category: 'Shape',
    },
  ];
}
