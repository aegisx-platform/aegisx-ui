import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-bottom-sheet-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatBottomSheetModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-bottom-sheet-doc">
      <!-- Header -->
      <ax-doc-header
        title="Bottom Sheet"
        description="Slide-up panel for mobile interactions and action sheets."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-bottom-sheet-doc__header-links">
          <a
            href="https://material.angular.io/components/bottom-sheet/overview"
            target="_blank"
            rel="noopener"
            class="material-bottom-sheet-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/bottom-sheets/overview"
            target="_blank"
            rel="noopener"
            class="material-bottom-sheet-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group
        class="material-bottom-sheet-doc__tabs"
        animationDuration="200ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-bottom-sheet-doc__section">
            <h2 class="material-bottom-sheet-doc__section-title">
              Bottom Sheet Types
            </h2>
            <p class="material-bottom-sheet-doc__section-description">
              Bottom sheets slide up from the bottom of the screen and are
              commonly used for action menus and content sharing on mobile.
            </p>

            <!-- Basic Bottom Sheet -->
            <h3 class="material-bottom-sheet-doc__subsection-title">
              Action Sheet
            </h3>
            <ax-live-preview title="Open a basic action sheet">
              <button
                mat-raised-button
                color="primary"
                (click)="openBottomSheet()"
              >
                Open Bottom Sheet
              </button>
            </ax-live-preview>

            <!-- Template Sheet -->
            <h3 class="material-bottom-sheet-doc__subsection-title">
              Template-based
            </h3>
            <ax-live-preview title="Bottom sheet from template">
              <button
                mat-raised-button
                color="accent"
                (click)="openTemplateSheet()"
              >
                Open Share Sheet
              </button>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-bottom-sheet-doc__section">
            <h2 class="material-bottom-sheet-doc__section-title">
              Usage Examples
            </h2>

            <!-- Basic Usage -->
            <h3 class="material-bottom-sheet-doc__subsection-title">
              Component-based
            </h3>
            <ax-code-tabs [tabs]="componentBasedCode" />

            <!-- Template Usage -->
            <h3 class="material-bottom-sheet-doc__subsection-title">
              Template-based
            </h3>
            <ax-code-tabs [tabs]="templateBasedCode" />

            <!-- Configuration -->
            <h3 class="material-bottom-sheet-doc__subsection-title">
              Configuration Options
            </h3>
            <ax-code-tabs [tabs]="configCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-bottom-sheet-doc__section">
            <h2 class="material-bottom-sheet-doc__section-title">
              API Reference
            </h2>

            <mat-card
              appearance="outlined"
              class="material-bottom-sheet-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>MatBottomSheet Service</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-bottom-sheet-doc__api-table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Parameters</th>
                      <th>Returns</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>open()</code></td>
                      <td>
                        <code>component | templateRef, config?</code>
                      </td>
                      <td><code>MatBottomSheetRef</code></td>
                      <td>Opens a bottom sheet</td>
                    </tr>
                    <tr>
                      <td><code>dismiss()</code></td>
                      <td><code>result?</code></td>
                      <td><code>void</code></td>
                      <td>Dismisses current sheet</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-bottom-sheet-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Configuration Options</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-bottom-sheet-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>data</code></td>
                      <td><code>any</code></td>
                      <td>Data to pass to the sheet</td>
                    </tr>
                    <tr>
                      <td><code>hasBackdrop</code></td>
                      <td><code>boolean</code></td>
                      <td>Whether sheet has a backdrop</td>
                    </tr>
                    <tr>
                      <td><code>disableClose</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable close on backdrop click</td>
                    </tr>
                    <tr>
                      <td><code>panelClass</code></td>
                      <td><code>string | string[]</code></td>
                      <td>Custom panel CSS class</td>
                    </tr>
                    <tr>
                      <td><code>ariaLabel</code></td>
                      <td><code>string</code></td>
                      <td>Label for accessibility</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-bottom-sheet-doc__section">
            <h2 class="material-bottom-sheet-doc__section-title">
              Design Tokens
            </h2>
            <p class="material-bottom-sheet-doc__section-description">
              AegisX overrides these tokens for bottom sheet styling.
            </p>
            <ax-component-tokens [tokens]="bottomSheetTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-bottom-sheet-doc__section">
            <h2 class="material-bottom-sheet-doc__section-title">
              Usage Guidelines
            </h2>

            <mat-card
              appearance="outlined"
              class="material-bottom-sheet-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-bottom-sheet-doc__guide-list">
                  <li>
                    <strong>Mobile actions:</strong> Share, save, or quick
                    actions
                  </li>
                  <li><strong>Selection lists:</strong> Pick from options</li>
                  <li>
                    <strong>Contextual menus:</strong> Actions for current
                    content
                  </li>
                  <li>
                    <strong>Form shortcuts:</strong> Quick input for common
                    values
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-bottom-sheet-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-bottom-sheet-doc__guide-list">
                  <li>Don't use for critical confirmations (use dialog)</li>
                  <li>Don't nest multiple bottom sheets</li>
                  <li>Don't use on desktop without mobile-first design</li>
                  <li>Don't include complex forms - keep actions simple</li>
                </ul>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>

      <!-- Bottom Sheet Template -->
      <ng-template #shareSheet>
        <mat-nav-list>
          <a mat-list-item (click)="closeSheet('google')">
            <mat-icon matListItemIcon>g_translate</mat-icon>
            <span matListItemTitle>Share via Google Drive</span>
          </a>
          <a mat-list-item (click)="closeSheet('email')">
            <mat-icon matListItemIcon>email</mat-icon>
            <span matListItemTitle>Share via Email</span>
          </a>
          <a mat-list-item (click)="closeSheet('copy')">
            <mat-icon matListItemIcon>content_copy</mat-icon>
            <span matListItemTitle>Copy Link</span>
          </a>
        </mat-nav-list>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .material-bottom-sheet-doc {
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

        &__section-description {
          font-size: 0.9375rem;
          color: var(--ax-text-body);
          line-height: 1.6;
          margin: 0 0 var(--ax-spacing-xl) 0;
        }

        &__subsection-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ax-text-strong);
          margin: var(--ax-spacing-xl) 0 var(--ax-spacing-md) 0;
        }

        &__api-card {
          margin-bottom: var(--ax-spacing-lg);
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
            color: var(--ax-text-strong);
            background: var(--ax-background-subtle);
          }

          td {
            color: var(--ax-text-body);
          }

          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
            color: var(--ax-text-emphasis);
          }
        }

        &__guide-card {
          margin-bottom: var(--ax-spacing-lg);

          mat-icon[mat-card-avatar] {
            color: var(--ax-success-default);
          }
        }

        &__guide-list {
          margin: 0;
          padding-left: var(--ax-spacing-lg);
          color: var(--ax-text-body);
          line-height: 1.8;

          li {
            margin-bottom: var(--ax-spacing-xs);
          }

          strong {
            color: var(--ax-text-strong);
          }
        }
      }
    `,
  ],
})
export class MaterialBottomSheetDocComponent {
  private bottomSheet = inject(MatBottomSheet);
  private sheetRef?: MatBottomSheetRef;

  @ViewChild('shareSheet') shareSheet!: TemplateRef<unknown>;

  openBottomSheet(): void {
    this.sheetRef = this.bottomSheet.open(this.shareSheet);
  }

  openTemplateSheet(): void {
    this.sheetRef = this.bottomSheet.open(this.shareSheet, {
      ariaLabel: 'Share options',
    });
  }

  closeSheet(result: string): void {
    this.sheetRef?.dismiss(result);
  }

  componentBasedCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({...})
export class MyComponent {
  private bottomSheet = inject(MatBottomSheet);

  openSheet() {
    this.bottomSheet.open(MySheetComponent, {
      data: { name: 'example' }
    });
  }
}

// Sheet Component
@Component({
  template: \`
    <mat-nav-list>
      <a mat-list-item (click)="share('facebook')">
        <mat-icon>facebook</mat-icon>
        Share on Facebook
      </a>
    </mat-nav-list>
  \`
})
export class MySheetComponent {
  private sheetRef = inject(MatBottomSheetRef);

  share(platform: string) {
    this.sheetRef.dismiss(platform);
  }
}`,
    },
  ];

  templateBasedCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<button mat-button (click)="openSheet()">Open</button>

<ng-template #mySheet>
  <mat-nav-list>
    <a mat-list-item (click)="closeSheet('option1')">
      Option 1
    </a>
    <a mat-list-item (click)="closeSheet('option2')">
      Option 2
    </a>
  </mat-nav-list>
</ng-template>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `@ViewChild('mySheet') mySheet!: TemplateRef<unknown>;

openSheet() {
  this.sheetRef = this.bottomSheet.open(this.mySheet);
}

closeSheet(result: string) {
  this.sheetRef?.dismiss(result);
}`,
    },
  ];

  configCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `this.bottomSheet.open(MySheetComponent, {
  data: { name: 'example' },
  hasBackdrop: true,
  disableClose: false,
  panelClass: 'custom-sheet',
  ariaLabel: 'Action options',
  backdropClass: 'custom-backdrop',
});`,
    },
  ];

  bottomSheetTokens: ComponentToken[] = [
    {
      cssVar: '--mat-bottom-sheet-container-shape',
      usage: 'Border radius of the sheet',
      value: 'var(--ax-radius-lg) var(--ax-radius-lg) 0 0',
      category: 'Shape',
    },
    {
      cssVar: '--mat-bottom-sheet-container-background-color',
      usage: 'Background color',
      value: 'var(--ax-background-default)',
      category: 'Color',
    },
    {
      cssVar: '--mat-bottom-sheet-container-text-color',
      usage: 'Text color',
      value: 'var(--ax-text-body)',
      category: 'Color',
    },
  ];
}
