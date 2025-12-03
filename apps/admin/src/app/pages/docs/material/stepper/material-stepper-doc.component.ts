import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
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
  selector: 'app-material-stepper-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-stepper-doc">
      <!-- Header -->
      <ax-doc-header
        title="Stepper"
        description="Step-by-step workflow navigation for multi-step processes."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-stepper-doc__header-links">
          <a
            href="https://material.angular.io/components/stepper/overview"
            target="_blank"
            rel="noopener"
            class="material-stepper-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group
        class="material-stepper-doc__tabs"
        animationDuration="200ms"
      >
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-stepper-doc__section">
            <h2 class="material-stepper-doc__section-title">Stepper Types</h2>
            <p class="material-stepper-doc__section-description">
              Steppers guide users through multi-step workflows. They can be
              horizontal, vertical, linear, or non-linear.
            </p>

            <!-- Horizontal Stepper -->
            <h3 class="material-stepper-doc__subsection-title">
              Horizontal Stepper
            </h3>
            <ax-live-preview title="Basic horizontal stepper">
              <mat-stepper orientation="horizontal" #stepper>
                <mat-step [stepControl]="firstFormGroup">
                  <ng-template matStepLabel>Account</ng-template>
                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input
                      matInput
                      [formControl]="firstFormGroup.controls.email"
                    />
                  </mat-form-field>
                  <div class="step-actions">
                    <button mat-button matStepperNext>Next</button>
                  </div>
                </mat-step>

                <mat-step [stepControl]="secondFormGroup">
                  <ng-template matStepLabel>Profile</ng-template>
                  <mat-form-field appearance="outline">
                    <mat-label>Name</mat-label>
                    <input
                      matInput
                      [formControl]="secondFormGroup.controls.name"
                    />
                  </mat-form-field>
                  <div class="step-actions">
                    <button mat-button matStepperPrevious>Back</button>
                    <button mat-button matStepperNext>Next</button>
                  </div>
                </mat-step>

                <mat-step>
                  <ng-template matStepLabel>Done</ng-template>
                  <p>All steps completed!</p>
                  <div class="step-actions">
                    <button mat-button matStepperPrevious>Back</button>
                    <button mat-button (click)="stepper.reset()">Reset</button>
                  </div>
                </mat-step>
              </mat-stepper>
            </ax-live-preview>

            <!-- Vertical Stepper -->
            <h3 class="material-stepper-doc__subsection-title">
              Vertical Stepper
            </h3>
            <ax-live-preview title="Vertical orientation">
              <mat-stepper orientation="vertical">
                <mat-step label="Step 1">
                  <p>Content for step 1</p>
                  <button mat-button matStepperNext>Next</button>
                </mat-step>
                <mat-step label="Step 2">
                  <p>Content for step 2</p>
                  <button mat-button matStepperPrevious>Back</button>
                  <button mat-button matStepperNext>Next</button>
                </mat-step>
                <mat-step label="Step 3">
                  <p>Content for step 3</p>
                  <button mat-button matStepperPrevious>Back</button>
                </mat-step>
              </mat-stepper>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-stepper-doc__section">
            <h2 class="material-stepper-doc__section-title">Usage Examples</h2>

            <!-- Basic Usage -->
            <h3 class="material-stepper-doc__subsection-title">Basic Usage</h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <!-- With Forms -->
            <h3 class="material-stepper-doc__subsection-title">
              With Form Validation
            </h3>
            <ax-code-tabs [tabs]="formsCode" />

            <!-- Custom Icons -->
            <h3 class="material-stepper-doc__subsection-title">Custom Icons</h3>
            <ax-code-tabs [tabs]="iconsCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-stepper-doc__section">
            <h2 class="material-stepper-doc__section-title">API Reference</h2>

            <mat-card
              appearance="outlined"
              class="material-stepper-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>MatStepper Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-stepper-doc__api-table">
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
                      <td><code>orientation</code></td>
                      <td><code>'horizontal' | 'vertical'</code></td>
                      <td><code>'horizontal'</code></td>
                      <td>Stepper orientation</td>
                    </tr>
                    <tr>
                      <td><code>linear</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Require steps in order</td>
                    </tr>
                    <tr>
                      <td><code>selectedIndex</code></td>
                      <td><code>number</code></td>
                      <td><code>0</code></td>
                      <td>Active step index</td>
                    </tr>
                    <tr>
                      <td><code>animationDuration</code></td>
                      <td><code>string</code></td>
                      <td><code>'500ms'</code></td>
                      <td>Animation duration</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-stepper-doc__api-card"
            >
              <mat-card-header>
                <mat-card-title>MatStep Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-stepper-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>label</code></td>
                      <td><code>string</code></td>
                      <td>Step label text</td>
                    </tr>
                    <tr>
                      <td><code>stepControl</code></td>
                      <td><code>AbstractControl</code></td>
                      <td>Form control for validation</td>
                    </tr>
                    <tr>
                      <td><code>optional</code></td>
                      <td><code>boolean</code></td>
                      <td>Mark step as optional</td>
                    </tr>
                    <tr>
                      <td><code>editable</code></td>
                      <td><code>boolean</code></td>
                      <td>Allow returning to step</td>
                    </tr>
                    <tr>
                      <td><code>completed</code></td>
                      <td><code>boolean</code></td>
                      <td>Mark as completed</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-stepper-doc__section">
            <h2 class="material-stepper-doc__section-title">Design Tokens</h2>
            <p class="material-stepper-doc__section-description">
              AegisX overrides these tokens for stepper styling.
            </p>
            <ax-component-tokens [tokens]="stepperTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-stepper-doc__section">
            <h2 class="material-stepper-doc__section-title">
              Usage Guidelines
            </h2>

            <mat-card
              appearance="outlined"
              class="material-stepper-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-stepper-doc__guide-list">
                  <li>
                    <strong>Multi-step forms:</strong> Registration, checkout
                  </li>
                  <li><strong>Wizards:</strong> Setup flows, onboarding</li>
                  <li><strong>Sequential tasks:</strong> Ordered processes</li>
                  <li>
                    <strong>Progress tracking:</strong> Show completion status
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-stepper-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-stepper-doc__guide-list">
                  <li>Don't use for less than 3 steps</li>
                  <li>Don't use more than 7 steps</li>
                  <li>Don't hide required information in later steps</li>
                  <li>Don't prevent users from reviewing previous steps</li>
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
      .material-stepper-doc {
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

      .step-actions {
        margin-top: var(--ax-spacing-md);
        display: flex;
        gap: var(--ax-spacing-sm);
      }
    `,
  ],
})
export class MaterialStepperDocComponent {
  private fb = new FormBuilder();

  firstFormGroup = this.fb.group({
    email: ['', Validators.email],
  });

  secondFormGroup = this.fb.group({
    name: [''],
  });

  basicUsageCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatStepperModule } from '@angular/material/stepper';

@Component({
  imports: [MatStepperModule, MatButtonModule],
  template: \`
    <mat-stepper>
      <mat-step label="Step 1">
        <p>Step 1 content</p>
        <button mat-button matStepperNext>Next</button>
      </mat-step>
      <mat-step label="Step 2">
        <p>Step 2 content</p>
        <button mat-button matStepperPrevious>Back</button>
        <button mat-button matStepperNext>Next</button>
      </mat-step>
      <mat-step label="Done">
        <p>Completed!</p>
      </mat-step>
    </mat-stepper>
  \`
})
export class MyComponent {}`,
    },
  ];

  formsCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `firstFormGroup = this.fb.group({
  name: ['', Validators.required]
});

secondFormGroup = this.fb.group({
  email: ['', [Validators.required, Validators.email]]
});`,
    },
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-stepper linear>
  <mat-step [stepControl]="firstFormGroup">
    <form [formGroup]="firstFormGroup">
      <ng-template matStepLabel>Personal</ng-template>
      <mat-form-field>
        <input matInput formControlName="name" required>
      </mat-form-field>
      <button mat-button matStepperNext>Next</button>
    </form>
  </mat-step>
  <mat-step [stepControl]="secondFormGroup">
    <!-- Similar structure -->
  </mat-step>
</mat-stepper>`,
    },
  ];

  iconsCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-stepper>
  <ng-template matStepperIcon="edit">
    <mat-icon>edit</mat-icon>
  </ng-template>
  <ng-template matStepperIcon="done">
    <mat-icon>check</mat-icon>
  </ng-template>
  <ng-template matStepperIcon="number" let-index="index">
    {{index + 1}}
  </ng-template>

  <mat-step label="Step 1">...</mat-step>
</mat-stepper>`,
    },
  ];

  stepperTokens: ComponentToken[] = [
    {
      cssVar: '--mat-stepper-header-selected-state-icon-background-color',
      usage: 'Active step icon background',
      value: 'var(--ax-brand-default)',
      category: 'Color',
    },
    {
      cssVar: '--mat-stepper-header-done-state-icon-background-color',
      usage: 'Completed step icon background',
      value: 'var(--ax-brand-default)',
      category: 'Color',
    },
    {
      cssVar: '--mat-stepper-header-edit-state-icon-background-color',
      usage: 'Edit state icon background',
      value: 'var(--ax-brand-default)',
      category: 'Color',
    },
    {
      cssVar: '--mat-stepper-line-color',
      usage: 'Connector line color',
      value: 'var(--ax-border-default)',
      category: 'Color',
    },
  ];
}
