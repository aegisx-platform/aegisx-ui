import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-select-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-select-doc">
      <ax-doc-header
        title="Select"
        description="Selects allow users to choose from a list of options in a dropdown menu."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-select-doc__header-links">
          <a
            href="https://material.angular.io/components/select/overview"
            target="_blank"
            rel="noopener"
            class="material-select-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-select-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-select-doc__section">
            <h2 class="material-select-doc__section-title">Select Variants</h2>

            <h3 class="material-select-doc__subsection-title">Basic Select</h3>
            <ax-live-preview title="Simple dropdown select">
              <mat-form-field appearance="outline">
                <mat-label>Favorite food</mat-label>
                <mat-select>
                  <mat-option value="pizza">Pizza</mat-option>
                  <mat-option value="pasta">Pasta</mat-option>
                  <mat-option value="sushi">Sushi</mat-option>
                  <mat-option value="tacos">Tacos</mat-option>
                </mat-select>
              </mat-form-field>
            </ax-live-preview>

            <h3 class="material-select-doc__subsection-title">
              Multiple Selection
            </h3>
            <ax-live-preview title="Select multiple options">
              <mat-form-field appearance="outline">
                <mat-label>Toppings</mat-label>
                <mat-select multiple>
                  <mat-option value="cheese">Extra cheese</mat-option>
                  <mat-option value="mushroom">Mushroom</mat-option>
                  <mat-option value="onion">Onion</mat-option>
                  <mat-option value="pepperoni">Pepperoni</mat-option>
                  <mat-option value="sausage">Sausage</mat-option>
                </mat-select>
              </mat-form-field>
            </ax-live-preview>

            <h3 class="material-select-doc__subsection-title">Option Groups</h3>
            <ax-live-preview title="Grouped options">
              <mat-form-field appearance="outline">
                <mat-label>Pokemon</mat-label>
                <mat-select>
                  <mat-optgroup label="Grass">
                    <mat-option value="bulbasaur">Bulbasaur</mat-option>
                    <mat-option value="oddish">Oddish</mat-option>
                  </mat-optgroup>
                  <mat-optgroup label="Water">
                    <mat-option value="squirtle">Squirtle</mat-option>
                    <mat-option value="psyduck">Psyduck</mat-option>
                  </mat-optgroup>
                  <mat-optgroup label="Fire">
                    <mat-option value="charmander">Charmander</mat-option>
                    <mat-option value="vulpix">Vulpix</mat-option>
                  </mat-optgroup>
                </mat-select>
              </mat-form-field>
            </ax-live-preview>

            <h3 class="material-select-doc__subsection-title">
              Disabled State
            </h3>
            <ax-live-preview title="Disabled select">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Disabled select</mat-label>
                  <mat-select disabled>
                    <mat-option value="option1">Option 1</mat-option>
                    <mat-option value="option2">Option 2</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>With disabled option</mat-label>
                  <mat-select>
                    <mat-option value="one">Option 1</mat-option>
                    <mat-option value="two" disabled
                      >Option 2 (disabled)</mat-option
                    >
                    <mat-option value="three">Option 3</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-select-doc__section">
            <h2 class="material-select-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-select-doc__section">
            <h2 class="material-select-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Select Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-select-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>multiple</code></td>
                      <td><code>boolean</code></td>
                      <td>Allow multiple selections</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable the select</td>
                    </tr>
                    <tr>
                      <td><code>placeholder</code></td>
                      <td><code>string</code></td>
                      <td>Placeholder text</td>
                    </tr>
                    <tr>
                      <td><code>value</code></td>
                      <td><code>any</code></td>
                      <td>Selected value(s)</td>
                    </tr>
                    <tr>
                      <td><code>panelClass</code></td>
                      <td><code>string</code></td>
                      <td>Custom dropdown panel class</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-select-doc__section">
            <h2 class="material-select-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="selectTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-select-doc {
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
        .form-row {
          display: flex;
          gap: var(--ax-spacing-md);
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class MaterialSelectDocComponent {
  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-form-field appearance="outline">
  <mat-label>Select option</mat-label>
  <mat-select [(value)]="selected">
    <mat-option value="opt1">Option 1</mat-option>
    <mat-option value="opt2">Option 2</mat-option>
    <mat-option value="opt3">Option 3</mat-option>
  </mat-select>
</mat-form-field>

<!-- Multiple selection -->
<mat-form-field>
  <mat-label>Multiple</mat-label>
  <mat-select multiple [(value)]="selectedMultiple">
    <mat-option value="a">A</mat-option>
    <mat-option value="b">B</mat-option>
    <mat-option value="c">C</mat-option>
  </mat-select>
</mat-form-field>`,
    },
  ];

  selectTokens: ComponentToken[] = [
    {
      cssVar: '--mat-select-panel-background-color',
      usage: 'Dropdown background',
      value: 'var(--ax-background-default)',
      category: 'Background',
    },
    {
      cssVar: '--mat-select-enabled-trigger-text-color',
      usage: 'Selected text color',
      value: 'var(--ax-text-body)',
      category: 'Text',
    },
    {
      cssVar: '--mat-select-enabled-arrow-color',
      usage: 'Dropdown arrow color',
      value: 'var(--ax-text-subtle)',
      category: 'Icon',
    },
    {
      cssVar: '--mat-option-selected-state-layer-color',
      usage: 'Selected option highlight',
      value: 'var(--ax-brand-default)',
      category: 'State',
    },
  ];
}
