import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-slider-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSliderModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-slider-doc">
      <ax-doc-header
        title="Slider"
        description="Sliders allow users to select values from a range by moving a thumb along a track."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-slider-doc__header-links">
          <a
            href="https://material.angular.io/components/slider/overview"
            target="_blank"
            rel="noopener"
            class="material-slider-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group
        class="material-slider-doc__tabs"
        animationDuration="200ms"
      >
        <mat-tab label="Overview">
          <div class="material-slider-doc__section">
            <h2 class="material-slider-doc__section-title">Slider Types</h2>

            <h3 class="material-slider-doc__subsection-title">Basic Slider</h3>
            <ax-live-preview title="Simple value selection">
              <div class="slider-demo">
                <mat-slider min="0" max="100">
                  <input matSliderThumb [(ngModel)]="basicValue" />
                </mat-slider>
                <span class="slider-value">{{ basicValue }}</span>
              </div>
            </ax-live-preview>

            <h3 class="material-slider-doc__subsection-title">With Steps</h3>
            <ax-live-preview title="Discrete value steps">
              <div class="slider-demo">
                <mat-slider min="0" max="100" step="10" [discrete]="true">
                  <input matSliderThumb [(ngModel)]="stepValue" />
                </mat-slider>
                <span class="slider-value">{{ stepValue }}</span>
              </div>
            </ax-live-preview>

            <h3 class="material-slider-doc__subsection-title">Range Slider</h3>
            <ax-live-preview title="Select a range of values">
              <div class="slider-demo">
                <mat-slider min="0" max="100">
                  <input matSliderStartThumb [(ngModel)]="rangeStart" />
                  <input matSliderEndThumb [(ngModel)]="rangeEnd" />
                </mat-slider>
                <span class="slider-value"
                  >{{ rangeStart }} - {{ rangeEnd }}</span
                >
              </div>
            </ax-live-preview>

            <h3 class="material-slider-doc__subsection-title">
              Disabled Slider
            </h3>
            <ax-live-preview title="Disabled state">
              <div class="slider-demo">
                <mat-slider min="0" max="100" disabled>
                  <input matSliderThumb value="50" />
                </mat-slider>
              </div>
            </ax-live-preview>

            <h3 class="material-slider-doc__subsection-title">Slider Colors</h3>
            <ax-live-preview title="Theme color variants">
              <div class="slider-stack">
                <mat-slider min="0" max="100" color="primary">
                  <input matSliderThumb value="30" />
                </mat-slider>
                <mat-slider min="0" max="100" color="accent">
                  <input matSliderThumb value="50" />
                </mat-slider>
                <mat-slider min="0" max="100" color="warn">
                  <input matSliderThumb value="70" />
                </mat-slider>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <mat-tab label="Examples">
          <div class="material-slider-doc__section">
            <h2 class="material-slider-doc__section-title">Usage Examples</h2>
            <ax-code-tabs [tabs]="basicUsageCode" />
          </div>
        </mat-tab>

        <mat-tab label="API">
          <div class="material-slider-doc__section">
            <h2 class="material-slider-doc__section-title">API Reference</h2>
            <mat-card appearance="outlined">
              <mat-card-header
                ><mat-card-title
                  >Slider Properties</mat-card-title
                ></mat-card-header
              >
              <mat-card-content>
                <table class="material-slider-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>min</code></td>
                      <td><code>number</code></td>
                      <td>Minimum value</td>
                    </tr>
                    <tr>
                      <td><code>max</code></td>
                      <td><code>number</code></td>
                      <td>Maximum value</td>
                    </tr>
                    <tr>
                      <td><code>step</code></td>
                      <td><code>number</code></td>
                      <td>Value increment</td>
                    </tr>
                    <tr>
                      <td><code>discrete</code></td>
                      <td><code>boolean</code></td>
                      <td>Show tick marks</td>
                    </tr>
                    <tr>
                      <td><code>showTickMarks</code></td>
                      <td><code>boolean</code></td>
                      <td>Display tick marks</td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td><code>'primary' | 'accent' | 'warn'</code></td>
                      <td>Theme color</td>
                    </tr>
                    <tr>
                      <td><code>disabled</code></td>
                      <td><code>boolean</code></td>
                      <td>Disable slider</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="CSS Tokens">
          <div class="material-slider-doc__section">
            <h2 class="material-slider-doc__section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="sliderTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-slider-doc {
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
        .slider-demo {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-md);
          mat-slider {
            flex: 1;
            min-width: 200px;
          }
          .slider-value {
            min-width: 60px;
            font-size: 0.875rem;
            color: var(--ax-text-subtle);
          }
        }
        .slider-stack {
          display: flex;
          flex-direction: column;
          gap: var(--ax-spacing-md);
          mat-slider {
            width: 100%;
          }
        }
      }
    `,
  ],
})
export class MaterialSliderDocComponent {
  basicValue = 50;
  stepValue = 30;
  rangeStart = 20;
  rangeEnd = 80;

  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Basic Slider -->
<mat-slider min="0" max="100">
  <input matSliderThumb [(ngModel)]="value">
</mat-slider>

<!-- With Steps -->
<mat-slider min="0" max="100" step="10" [discrete]="true">
  <input matSliderThumb [(ngModel)]="discreteValue">
</mat-slider>

<!-- Range Slider -->
<mat-slider min="0" max="100">
  <input matSliderStartThumb [(ngModel)]="minValue">
  <input matSliderEndThumb [(ngModel)]="maxValue">
</mat-slider>`,
    },
  ];

  sliderTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-slider-handle-color',
      usage: 'Thumb color',
      value: 'var(--ax-brand-default)',
      category: 'Colors',
    },
    {
      cssVar: '--mdc-slider-active-track-color',
      usage: 'Active track color',
      value: 'var(--ax-brand-default)',
      category: 'Colors',
    },
    {
      cssVar: '--mdc-slider-inactive-track-color',
      usage: 'Inactive track color',
      value: 'var(--ax-background-subtle)',
      category: 'Background',
    },
    {
      cssVar: '--mdc-slider-handle-shape',
      usage: 'Thumb shape',
      value: '50%',
      category: 'Shape',
    },
  ];
}
