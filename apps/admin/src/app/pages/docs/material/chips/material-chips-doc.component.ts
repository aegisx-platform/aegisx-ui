import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-chips-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-chips-doc">
      <ax-doc-header
        title="Chips"
        description="Chips are compact elements representing inputs, attributes, or actions."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-chips-doc__header-links">
          <a
            href="https://material.angular.io/components/chips/overview"
            target="_blank"
            rel="noopener"
            class="material-chips-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group class="material-chips-doc__tabs" animationDuration="200ms">
        <mat-tab label="Overview">
          <div class="material-chips-doc__section">
            <h2 class="material-chips-doc__section-title">Chip Types</h2>

            <h3 class="material-chips-doc__subsection-title">Basic Chips</h3>
            <ax-live-preview title="Simple chips">
              <mat-chip-set>
                <mat-chip>Angular</mat-chip>
                <mat-chip>React</mat-chip>
                <mat-chip>Vue</mat-chip>
              </mat-chip-set>
            </ax-live-preview>

            <h3 class="material-chips-doc__subsection-title">
              Chips with Icons
            </h3>
            <ax-live-preview title="Chips with leading icons">
              <mat-chip-set>
                <mat-chip>
                  <mat-icon matChipAvatar>face</mat-icon>
                  John Doe
                </mat-chip>
                <mat-chip>
                  <mat-icon matChipAvatar>verified</mat-icon>
                  Verified
                </mat-chip>
              </mat-chip-set>
            </ax-live-preview>

            <h3 class="material-chips-doc__subsection-title">
              Removable Chips
            </h3>
            <ax-live-preview title="Chips with remove button">
              <mat-chip-set>
                @for (chip of chips; track chip) {
                  <mat-chip (removed)="removeChip(chip)">
                    {{ chip }}
                    <mat-icon matChipRemove>cancel</mat-icon>
                  </mat-chip>
                }
              </mat-chip-set>
            </ax-live-preview>

            <h3 class="material-chips-doc__subsection-title">
              Selection Chips
            </h3>
            <ax-live-preview title="Selectable chip listbox">
              <mat-chip-listbox>
                <mat-chip-option>Small</mat-chip-option>
                <mat-chip-option selected>Medium</mat-chip-option>
                <mat-chip-option>Large</mat-chip-option>
              </mat-chip-listbox>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-chips-doc__section">
            <h2 class="material-chips-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-chips-doc__section">
            <h2 class="material-chips-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Chip Components</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-chips-doc__api-table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mat-chip-set</code></td>
                      <td>Container for chips (no selection)</td>
                    </tr>
                    <tr>
                      <td><code>mat-chip</code></td>
                      <td>Basic chip element</td>
                    </tr>
                    <tr>
                      <td><code>mat-chip-listbox</code></td>
                      <td>Selectable chip container</td>
                    </tr>
                    <tr>
                      <td><code>mat-chip-option</code></td>
                      <td>Selectable chip</td>
                    </tr>
                    <tr>
                      <td><code>matChipRemove</code></td>
                      <td>Remove button directive</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-chips-doc__section">
            <h2 class="material-chips-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="chipsTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-chips-doc {
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
      }
    `,
  ],
})
export class MaterialChipsDocComponent {
  chips = ['Angular', 'TypeScript', 'RxJS'];

  removeChip(chip: string) {
    const index = this.chips.indexOf(chip);
    if (index >= 0) this.chips.splice(index, 1);
  }

  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-chip-set>
  <mat-chip>Chip 1</mat-chip>
  <mat-chip>Chip 2</mat-chip>
  <mat-chip>Chip 3</mat-chip>
</mat-chip-set>

<!-- Selectable -->
<mat-chip-listbox>
  <mat-chip-option>Option 1</mat-chip-option>
  <mat-chip-option selected>Option 2</mat-chip-option>
</mat-chip-listbox>`,
    },
  ];

  chipsTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-chip-container-shape',
      usage: 'Border radius',
      value: 'var(--ax-radius-full)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-chip-elevated-container-color',
      usage: 'Background color',
      value: 'var(--ax-background-subtle)',
      category: 'Background',
    },
    {
      cssVar: '--mdc-chip-label-text-color',
      usage: 'Text color',
      value: 'var(--ax-text-body)',
      category: 'Text',
    },
  ];
}
