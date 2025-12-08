import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-autocomplete-doc',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-autocomplete-doc">
      <!-- Header -->
      <ax-doc-header
        title="Autocomplete"
        description="Text input with dropdown suggestions for filtering options."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-autocomplete-doc__header-links">
          <a
            href="https://material.angular.io/components/autocomplete/overview"
            target="_blank"
            rel="noopener"
            class="material-autocomplete-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/menus/overview"
            target="_blank"
            rel="noopener"
            class="material-autocomplete-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group
        class="material-autocomplete-doc__tabs"
        animationDuration="200ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-autocomplete-doc__section">
            <h2 class="material-autocomplete-doc__section-title">
              Autocomplete Types
            </h2>
            <p class="material-autocomplete-doc__section-description">
              Autocomplete provides suggestions as users type. AegisX applies
              consistent styling to match the design system.
            </p>

            <!-- Basic Autocomplete -->
            <h3 class="material-autocomplete-doc__subsection-title">
              Basic Autocomplete
            </h3>
            <ax-live-preview title="Simple autocomplete with string options">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Pick a fruit</mat-label>
                <input
                  type="text"
                  matInput
                  [formControl]="fruitControl"
                  [matAutocomplete]="autoFruit"
                />
                <mat-autocomplete #autoFruit="matAutocomplete">
                  @for (option of filteredFruits(); track option) {
                    <mat-option [value]="option">{{ option }}</mat-option>
                  }
                </mat-autocomplete>
              </mat-form-field>
            </ax-live-preview>

            <!-- With Display Function -->
            <h3 class="material-autocomplete-doc__subsection-title">
              Object Options
            </h3>
            <ax-live-preview title="Autocomplete with object options">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select a country</mat-label>
                <input
                  type="text"
                  matInput
                  [formControl]="countryControl"
                  [matAutocomplete]="autoCountry"
                />
                <mat-autocomplete
                  #autoCountry="matAutocomplete"
                  [displayWith]="displayCountry"
                >
                  @for (country of filteredCountries(); track country.code) {
                    <mat-option [value]="country">
                      <span class="country-option">
                        <span class="country-flag">{{ country.flag }}</span>
                        {{ country.name }}
                      </span>
                    </mat-option>
                  }
                </mat-autocomplete>
              </mat-form-field>
            </ax-live-preview>

            <!-- Autocomplete Groups -->
            <h3 class="material-autocomplete-doc__subsection-title">
              Option Groups
            </h3>
            <ax-live-preview title="Autocomplete with grouped options">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select a city</mat-label>
                <input
                  type="text"
                  matInput
                  [formControl]="cityControl"
                  [matAutocomplete]="autoCity"
                />
                <mat-autocomplete #autoCity="matAutocomplete">
                  @for (group of cityGroups; track group.country) {
                    <mat-optgroup [label]="group.country">
                      @for (city of group.cities; track city) {
                        <mat-option [value]="city">{{ city }}</mat-option>
                      }
                    </mat-optgroup>
                  }
                </mat-autocomplete>
              </mat-form-field>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-autocomplete-doc__section">
            <h2 class="material-autocomplete-doc__section-title">
              Usage Examples
            </h2>

            <!-- Basic Usage -->
            <h3 class="material-autocomplete-doc__subsection-title">
              Basic Usage
            </h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- With Filter -->
            <h3 class="material-autocomplete-doc__subsection-title">
              With Filter
            </h3>
            <ax-code-tabs [tabs]="filterCode" />

            <!-- Custom Display -->
            <h3 class="material-autocomplete-doc__subsection-title">
              Custom Display
            </h3>
            <ax-code-tabs [tabs]="customDisplayCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-autocomplete-doc__section">
            <h2 class="material-autocomplete-doc__section-title">
              API Reference
            </h2>

            <mat-card
              appearance="outlined"
              class="material-autocomplete-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Input Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-autocomplete-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>autoActiveFirstOption</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Auto-activate first option</td>
                    </tr>
                    <tr>
                      <td><code>displayWith</code></td>
                      <td><code>(value: any) => string</code></td>
                      <td>-</td>
                      <td>Function to format display value</td>
                    </tr>
                    <tr>
                      <td><code>panelWidth</code></td>
                      <td><code>string | number</code></td>
                      <td>-</td>
                      <td>Width of the autocomplete panel</td>
                    </tr>
                    <tr>
                      <td><code>requireSelection</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Require option selection</td>
                    </tr>
                    <tr>
                      <td><code>hideSingleSelectionIndicator</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Hide selection indicator</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-autocomplete-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>Output Events</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-autocomplete-doc__api-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>optionSelected</code></td>
                      <td><code>MatAutocompleteSelectedEvent</code></td>
                      <td>Emits when an option is selected</td>
                    </tr>
                    <tr>
                      <td><code>opened</code></td>
                      <td><code>void</code></td>
                      <td>Emits when panel opens</td>
                    </tr>
                    <tr>
                      <td><code>closed</code></td>
                      <td><code>void</code></td>
                      <td>Emits when panel closes</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-autocomplete-doc__section">
            <h2 class="material-autocomplete-doc__section-title">
              Design Tokens
            </h2>
            <p class="material-autocomplete-doc__section-description">
              AegisX overrides these Material Design tokens for autocomplete
              styling.
            </p>
            <ax-component-tokens [tokens]="autocompleteTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-autocomplete-doc__section">
            <h2 class="material-autocomplete-doc__section-title">
              Usage Guidelines
            </h2>

            <mat-card
              appearance="outlined"
              class="material-autocomplete-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-autocomplete-doc__guide-list">
                  <li>
                    <strong>Large option sets:</strong> When users need to
                    select from many options
                  </li>
                  <li>
                    <strong>Search fields:</strong> For filtering/searching
                    content
                  </li>
                  <li>
                    <strong>Known values:</strong> When user knows what they're
                    looking for
                  </li>
                  <li>
                    <strong>Free text with suggestions:</strong> Allow custom
                    input with hints
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-autocomplete-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-autocomplete-doc__guide-list">
                  <li>Don't use for small option sets (use select instead)</li>
                  <li>Don't make filtering case-sensitive unless necessary</li>
                  <li>Don't hide the input label when panel is open</li>
                  <li>Don't use without proper keyboard navigation</li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-autocomplete-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>accessibility</mat-icon>
                <mat-card-title>Accessibility</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-autocomplete-doc__guide-list">
                  <li>Always provide clear labels for the input</li>
                  <li>Ensure keyboard navigation works properly</li>
                  <li>Announce option count to screen readers</li>
                  <li>Use aria-describedby for additional context</li>
                </ul>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-autocomplete-doc {
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

          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
          }
        }
      }

      .full-width {
        width: 100%;
        max-width: 400px;
      }

      .country-option {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .country-flag {
        font-size: 1.25rem;
      }
    `,
  ],
})
export class MaterialAutocompleteDocComponent {
  // Fruit autocomplete
  fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
  fruitControl = new FormControl('');
  filteredFruits = signal(this.fruits);

  // Country autocomplete
  countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
  ];
  countryControl = new FormControl<(typeof this.countries)[0] | string>('');
  filteredCountries = signal(this.countries);

  // City groups
  cityGroups = [
    {
      country: 'United States',
      cities: ['New York', 'Los Angeles', 'Chicago'],
    },
    {
      country: 'United Kingdom',
      cities: ['London', 'Manchester', 'Birmingham'],
    },
    { country: 'Japan', cities: ['Tokyo', 'Osaka', 'Kyoto'] },
  ];
  cityControl = new FormControl('');

  constructor() {
    this.fruitControl.valueChanges.subscribe((value) => {
      this.filteredFruits.set(this._filterFruits(value || ''));
    });

    this.countryControl.valueChanges.subscribe((value) => {
      const filterValue = typeof value === 'string' ? value : value?.name || '';
      this.filteredCountries.set(this._filterCountries(filterValue));
    });
  }

  displayCountry(country: (typeof this.countries)[0]): string {
    return country?.name || '';
  }

  private _filterFruits(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.fruits.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue),
    );
  }

  private _filterCountries(value: string): typeof this.countries {
    const filterValue = value.toLowerCase();
    return this.countries.filter((country) =>
      country.name.toLowerCase().includes(filterValue),
    );
  }

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  template: \`
    <mat-form-field>
      <mat-label>Pick a fruit</mat-label>
      <input matInput [matAutocomplete]="auto">
      <mat-autocomplete #auto="matAutocomplete">
        @for (option of options; track option) {
          <mat-option [value]="option">{{option}}</mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  \`
})
export class MyComponent {
  options = ['Apple', 'Banana', 'Cherry'];
}`,
    },
  ];

  filterCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `fruitControl = new FormControl('');
filteredOptions = signal(this.options);

constructor() {
  this.fruitControl.valueChanges.subscribe(value => {
    this.filteredOptions.set(this._filter(value || ''));
  });
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.options.filter(option =>
    option.toLowerCase().includes(filterValue)
  );
}`,
    },
  ];

  customDisplayCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `interface Country {
  code: string;
  name: string;
}

countries: Country[] = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
];

displayFn(country: Country): string {
  return country?.name || '';
}

// In template:
// <mat-autocomplete [displayWith]="displayFn">`,
    },
  ];

  autocompleteTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-menu-container-shape',
      usage: 'Border radius for dropdown panel',
      value: 'var(--ax-radius-md)',
      category: 'Shape',
    },
    {
      cssVar: '--mat-autocomplete-background-color',
      usage: 'Background color of the panel',
      value: 'var(--ax-background-default)',
      category: 'Color',
    },
    {
      cssVar: '--mat-option-selected-state-layer-color',
      usage: 'Background when option selected',
      value: 'var(--ax-brand-faint)',
      category: 'State',
    },
    {
      cssVar: '--mat-option-hover-state-layer-color',
      usage: 'Background on hover',
      value: 'var(--ax-background-subtle)',
      category: 'State',
    },
  ];
}
