import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-datepicker-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-datepicker-doc">
      <ax-doc-header
        title="Datepicker"
        description="Datepickers allow users to enter a date through text input or by choosing a date from the calendar."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-datepicker-doc__header-links">
          <a
            href="https://material.angular.io/components/datepicker/overview"
            target="_blank"
            rel="noopener"
            class="material-datepicker-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-datepicker-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-datepicker-doc__section">
            <h2 class="material-datepicker-doc__section-title">
              Datepicker Types
            </h2>

            <h3 class="material-datepicker-doc__subsection-title">
              Basic Datepicker
            </h3>
            <ax-live-preview title="Standard date input with calendar popup">
              <mat-form-field appearance="outline">
                <mat-label>Choose a date</mat-label>
                <input
                  matInput
                  [matDatepicker]="basicPicker"
                  [(ngModel)]="basicDate"
                />
                <mat-hint>MM/DD/YYYY</mat-hint>
                <mat-datepicker-toggle
                  matIconSuffix
                  [for]="basicPicker"
                ></mat-datepicker-toggle>
                <mat-datepicker #basicPicker></mat-datepicker>
              </mat-form-field>
            </ax-live-preview>

            <h3 class="material-datepicker-doc__subsection-title">
              Start Date
            </h3>
            <ax-live-preview title="Datepicker with custom start view">
              <mat-form-field appearance="outline">
                <mat-label>Start date</mat-label>
                <input matInput [matDatepicker]="startPicker" />
                <mat-datepicker-toggle
                  matIconSuffix
                  [for]="startPicker"
                ></mat-datepicker-toggle>
                <mat-datepicker
                  #startPicker
                  [startAt]="startDate"
                ></mat-datepicker>
              </mat-form-field>
            </ax-live-preview>

            <h3 class="material-datepicker-doc__subsection-title">
              Date Range
            </h3>
            <ax-live-preview title="Select a date range">
              <mat-form-field appearance="outline">
                <mat-label>Enter a date range</mat-label>
                <mat-date-range-input [rangePicker]="rangePicker">
                  <input matStartDate placeholder="Start date" />
                  <input matEndDate placeholder="End date" />
                </mat-date-range-input>
                <mat-hint>MM/DD/YYYY – MM/DD/YYYY</mat-hint>
                <mat-datepicker-toggle
                  matIconSuffix
                  [for]="rangePicker"
                ></mat-datepicker-toggle>
                <mat-date-range-picker #rangePicker></mat-date-range-picker>
              </mat-form-field>
            </ax-live-preview>

            <h3 class="material-datepicker-doc__subsection-title">
              Min and Max Dates
            </h3>
            <ax-live-preview title="Datepicker with date constraints">
              <mat-form-field appearance="outline">
                <mat-label>Constrained date</mat-label>
                <input
                  matInput
                  [matDatepicker]="constrainedPicker"
                  [min]="minDate"
                  [max]="maxDate"
                />
                <mat-hint>Between today and 30 days from now</mat-hint>
                <mat-datepicker-toggle
                  matIconSuffix
                  [for]="constrainedPicker"
                ></mat-datepicker-toggle>
                <mat-datepicker #constrainedPicker></mat-datepicker>
              </mat-form-field>
            </ax-live-preview>

            <h3 class="material-datepicker-doc__subsection-title">
              Disabled Datepicker
            </h3>
            <ax-live-preview title="Disabled state">
              <mat-form-field appearance="outline">
                <mat-label>Disabled date</mat-label>
                <input matInput [matDatepicker]="disabledPicker" disabled />
                <mat-datepicker-toggle
                  matIconSuffix
                  [for]="disabledPicker"
                ></mat-datepicker-toggle>
                <mat-datepicker #disabledPicker></mat-datepicker>
              </mat-form-field>
            </ax-live-preview>

            <h3 class="material-datepicker-doc__subsection-title">
              Different Start Views
            </h3>
            <ax-live-preview title="Calendar opens in different views">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Month view</mat-label>
                  <input matInput [matDatepicker]="monthPicker" />
                  <mat-datepicker-toggle
                    matIconSuffix
                    [for]="monthPicker"
                  ></mat-datepicker-toggle>
                  <mat-datepicker
                    #monthPicker
                    startView="month"
                  ></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Year view</mat-label>
                  <input matInput [matDatepicker]="yearPicker" />
                  <mat-datepicker-toggle
                    matIconSuffix
                    [for]="yearPicker"
                  ></mat-datepicker-toggle>
                  <mat-datepicker #yearPicker startView="year"></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Multi-year view</mat-label>
                  <input matInput [matDatepicker]="multiYearPicker" />
                  <mat-datepicker-toggle
                    matIconSuffix
                    [for]="multiYearPicker"
                  ></mat-datepicker-toggle>
                  <mat-datepicker
                    #multiYearPicker
                    startView="multi-year"
                  ></mat-datepicker>
                </mat-form-field>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-datepicker-doc__section">
            <h2 class="material-datepicker-doc__section-title">
              Usage Examples
            </h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-datepicker-doc__section">
            <h2 class="material-datepicker-doc__section-title">
              API Reference
            </h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Datepicker Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-datepicker-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>startAt</code></td>
                      <td><code>Date</code></td>
                      <td>Initial calendar date</td>
                    </tr>
                    <tr>
                      <td><code>startView</code></td>
                      <td><code>'month' | 'year' | 'multi-year'</code></td>
                      <td>Initial view mode</td>
                    </tr>
                    <tr>
                      <td><code>min</code></td>
                      <td><code>Date</code></td>
                      <td>Minimum selectable date</td>
                    </tr>
                    <tr>
                      <td><code>max</code></td>
                      <td><code>Date</code></td>
                      <td>Maximum selectable date</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable datepicker</td>
                    </tr>
                    <tr>
                      <td><code>opened</code></td>
                      <td><code>boolean</code></td>
                      <td>Whether calendar is open</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-datepicker-doc__section">
            <h2 class="material-datepicker-doc__section-title">
              Design Tokens
            </h2>
            <ax-component-tokens [tokens]="datepickerTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-datepicker-doc {
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
export class MaterialDatepickerDocComponent {
  basicDate: Date | null = null;
  startDate = new Date();
  minDate = new Date();
  maxDate = new Date(new Date().setDate(new Date().getDate() + 30));

  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Basic Datepicker -->
<mat-form-field appearance="outline">
  <mat-label>Choose a date</mat-label>
  <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDate">
  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>

<!-- Date Range -->
<mat-form-field appearance="outline">
  <mat-label>Date range</mat-label>
  <mat-date-range-input [rangePicker]="rangePicker">
    <input matStartDate placeholder="Start">
    <input matEndDate placeholder="End">
  </mat-date-range-input>
  <mat-datepicker-toggle matIconSuffix [for]="rangePicker"></mat-datepicker-toggle>
  <mat-date-range-picker #rangePicker></mat-date-range-picker>
</mat-form-field>

<!-- With Min/Max Constraints -->
<mat-form-field>
  <input matInput [matDatepicker]="picker" [min]="minDate" [max]="maxDate">
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  imports: [
    MatDatepickerModule,
    MatNativeDateModule, // or MatMomentDateModule
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class MyComponent {
  selectedDate: Date | null = null;
  minDate = new Date();
  maxDate = new Date(2025, 11, 31);
}`,
    },
  ];

  datepickerTokens: ComponentToken[] = [
    {
      cssVar: '--mat-datepicker-calendar-container-background-color',
      usage: 'Calendar background',
      value: 'var(--ax-background-default)',
      category: 'Background',
    },
    {
      cssVar: '--mat-datepicker-calendar-container-text-color',
      usage: 'Calendar text color',
      value: 'var(--ax-text-body)',
      category: 'Text',
    },
    {
      cssVar: '--mat-datepicker-calendar-date-selected-state-background-color',
      usage: 'Selected date background',
      value: 'var(--ax-brand-default)',
      category: 'State',
    },
    {
      cssVar: '--mat-datepicker-calendar-date-today-outline-color',
      usage: 'Today indicator',
      value: 'var(--ax-brand-default)',
      category: 'Border',
    },
    {
      cssVar: '--mat-datepicker-calendar-container-shape',
      usage: 'Calendar border radius',
      value: 'var(--ax-radius-md)',
      category: 'Shape',
    },
  ];
}
