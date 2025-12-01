import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

interface ComponentInfo {
  name: string;
  icon: string;
  materialDocsUrl: string;
  description: string;
}

const COMPONENT_INFO: Record<string, ComponentInfo> = {
  card: {
    name: 'Card',
    icon: 'credit_card',
    materialDocsUrl: 'https://material.angular.io/components/card',
    description: 'Container for content and actions',
  },
  table: {
    name: 'Table',
    icon: 'table_chart',
    materialDocsUrl: 'https://material.angular.io/components/table',
    description: 'Data tables with sorting and pagination',
  },
  'form-field': {
    name: 'Form Field',
    icon: 'input',
    materialDocsUrl: 'https://material.angular.io/components/form-field',
    description: 'Wrapper for form inputs with labels and hints',
  },
  chips: {
    name: 'Chips',
    icon: 'label',
    materialDocsUrl: 'https://material.angular.io/components/chips',
    description: 'Compact elements for input and attributes',
  },
  dialog: {
    name: 'Dialog',
    icon: 'open_in_new',
    materialDocsUrl: 'https://material.angular.io/components/dialog',
    description: 'Modal dialogs for important interactions',
  },
  menu: {
    name: 'Menu',
    icon: 'menu',
    materialDocsUrl: 'https://material.angular.io/components/menu',
    description: 'Popup menus for navigation and actions',
  },
  tabs: {
    name: 'Tabs',
    icon: 'tab',
    materialDocsUrl: 'https://material.angular.io/components/tabs',
    description: 'Tabbed navigation for organizing content',
  },
  fab: {
    name: 'FAB',
    icon: 'add_circle',
    materialDocsUrl: 'https://material.angular.io/components/button',
    description: 'Floating action buttons for primary actions',
  },
  'button-toggle': {
    name: 'Button Toggle',
    icon: 'toggle_on',
    materialDocsUrl: 'https://material.angular.io/components/button-toggle',
    description: 'Toggle buttons for grouped selections',
  },
  list: {
    name: 'List',
    icon: 'list',
    materialDocsUrl: 'https://material.angular.io/components/list',
    description: 'Lists for displaying rows of data',
  },
  select: {
    name: 'Select',
    icon: 'arrow_drop_down_circle',
    materialDocsUrl: 'https://material.angular.io/components/select',
    description: 'Dropdown selection control',
  },
  datepicker: {
    name: 'Datepicker',
    icon: 'calendar_today',
    materialDocsUrl: 'https://material.angular.io/components/datepicker',
    description: 'Date and date range picker controls',
  },
  snackbar: {
    name: 'Snackbar',
    icon: 'announcement',
    materialDocsUrl: 'https://material.angular.io/components/snack-bar',
    description: 'Brief notifications at bottom of screen',
  },
  'progress-bar': {
    name: 'Progress Bar',
    icon: 'hourglass_empty',
    materialDocsUrl: 'https://material.angular.io/components/progress-bar',
    description: 'Linear progress indicators',
  },
  tooltip: {
    name: 'Tooltip',
    icon: 'info',
    materialDocsUrl: 'https://material.angular.io/components/tooltip',
    description: 'Contextual information on hover',
  },
  expansion: {
    name: 'Expansion Panel',
    icon: 'expand_more',
    materialDocsUrl: 'https://material.angular.io/components/expansion',
    description: 'Collapsible sections for progressive disclosure',
  },
  paginator: {
    name: 'Paginator',
    icon: 'last_page',
    materialDocsUrl: 'https://material.angular.io/components/paginator',
    description: 'Pagination controls for data tables',
  },
  toolbar: {
    name: 'Toolbar',
    icon: 'web_asset',
    materialDocsUrl: 'https://material.angular.io/components/toolbar',
    description: 'Container for headers and navigation',
  },
  badge: {
    name: 'Badge',
    icon: 'notifications',
    materialDocsUrl: 'https://material.angular.io/components/badge',
    description: 'Small status descriptors for UI elements',
  },
  icon: {
    name: 'Icon',
    icon: 'emoji_symbols',
    materialDocsUrl: 'https://material.angular.io/components/icon',
    description: 'Material Design icons',
  },
  'icon-button': {
    name: 'Icon Button',
    icon: 'radio_button_checked',
    materialDocsUrl: 'https://material.angular.io/components/button',
    description: 'Icon-only buttons for compact actions',
  },
  checkbox: {
    name: 'Checkbox',
    icon: 'check_box',
    materialDocsUrl: 'https://material.angular.io/components/checkbox',
    description: 'Checkbox for multiple selections',
  },
  radio: {
    name: 'Radio Button',
    icon: 'radio_button_checked',
    materialDocsUrl: 'https://material.angular.io/components/radio',
    description: 'Radio buttons for single selection',
  },
  slider: {
    name: 'Slider',
    icon: 'tune',
    materialDocsUrl: 'https://material.angular.io/components/slider',
    description: 'Slider for selecting values from a range',
  },
  'slide-toggle': {
    name: 'Slide Toggle',
    icon: 'toggle_on',
    materialDocsUrl: 'https://material.angular.io/components/slide-toggle',
    description: 'Toggle switch for on/off states',
  },
  autocomplete: {
    name: 'Autocomplete',
    icon: 'auto_awesome',
    materialDocsUrl: 'https://material.angular.io/components/autocomplete',
    description: 'Text input with dropdown suggestions',
  },
  stepper: {
    name: 'Stepper',
    icon: 'linear_scale',
    materialDocsUrl: 'https://material.angular.io/components/stepper',
    description: 'Step-by-step workflow navigation',
  },
  divider: {
    name: 'Divider',
    icon: 'horizontal_rule',
    materialDocsUrl: 'https://material.angular.io/components/divider',
    description: 'Horizontal or vertical content separator',
  },
  'grid-list': {
    name: 'Grid List',
    icon: 'grid_view',
    materialDocsUrl: 'https://material.angular.io/components/grid-list',
    description: 'Grid-based layout for cards and media',
  },
  'progress-spinner': {
    name: 'Progress Spinner',
    icon: 'autorenew',
    materialDocsUrl: 'https://material.angular.io/components/progress-spinner',
    description: 'Circular progress indicators',
  },
  'bottom-sheet': {
    name: 'Bottom Sheet',
    icon: 'call_to_action',
    materialDocsUrl: 'https://material.angular.io/components/bottom-sheet',
    description: 'Slide-up panel for mobile interactions',
  },
};

@Component({
  selector: 'app-material-placeholder',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="material-placeholder">
      <mat-card appearance="outlined" class="material-placeholder__card">
        <mat-card-content class="material-placeholder__content">
          <!-- Icon -->
          <div class="material-placeholder__icon-wrapper">
            <mat-icon class="material-placeholder__icon">{{
              componentInfo().icon
            }}</mat-icon>
          </div>

          <!-- Title -->
          <h1 class="material-placeholder__title">
            {{ componentInfo().name }}
          </h1>
          <p class="material-placeholder__description">
            {{ componentInfo().description }}
          </p>

          <!-- Coming Soon Badge -->
          <div class="material-placeholder__badge">
            <mat-icon>schedule</mat-icon>
            <span>Documentation Coming Soon</span>
          </div>

          <!-- Description -->
          <p class="material-placeholder__info">
            This component documentation is being developed. In the meantime,
            you can explore the official Angular Material documentation or check
            out our Button example for the documentation format we're building.
          </p>

          <!-- Actions -->
          <div class="material-placeholder__actions">
            <a
              mat-flat-button
              color="primary"
              [href]="componentInfo().materialDocsUrl"
              target="_blank"
              rel="noopener"
            >
              <mat-icon>open_in_new</mat-icon>
              Angular Material Docs
            </a>
            <a mat-stroked-button routerLink="/docs/material/button">
              <mat-icon>visibility</mat-icon>
              View Button Example
            </a>
            <a mat-stroked-button routerLink="/docs/material/overview">
              <mat-icon>apps</mat-icon>
              Back to Overview
            </a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .material-placeholder {
        max-width: 600px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl);

        &__card {
          text-align: center;
        }

        &__content {
          padding: var(--ax-spacing-2xl) !important;
        }

        &__icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto var(--ax-spacing-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--ax-brand-faint);
          border-radius: var(--ax-radius-lg);
        }

        &__icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          color: var(--ax-brand-default);
        }

        &__title {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--ax-text-strong);
          margin: 0 0 var(--ax-spacing-xs) 0;
        }

        &__description {
          font-size: 1rem;
          color: var(--ax-text-body);
          margin: 0 0 var(--ax-spacing-lg) 0;
        }

        &__badge {
          display: inline-flex;
          align-items: center;
          gap: var(--ax-spacing-xs);
          padding: var(--ax-spacing-sm) var(--ax-spacing-md);
          background: var(--ax-warning-faint);
          color: var(--ax-warning-emphasis);
          border-radius: var(--ax-radius-full);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: var(--ax-spacing-lg);

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }

        &__info {
          font-size: 0.875rem;
          color: var(--ax-text-subtle);
          line-height: 1.6;
          margin: 0 0 var(--ax-spacing-xl) 0;
          max-width: 450px;
          margin-left: auto;
          margin-right: auto;
        }

        &__actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ax-spacing-sm);

          a {
            mat-icon {
              margin-right: var(--ax-spacing-xs);
            }
          }
        }
      }
    `,
  ],
})
export class MaterialPlaceholderComponent {
  private route = inject(ActivatedRoute);

  private componentParam = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('component') || '')),
    { initialValue: '' },
  );

  componentInfo = computed<ComponentInfo>(() => {
    const param = this.componentParam();
    return (
      COMPONENT_INFO[param] || {
        name: this.formatComponentName(param),
        icon: 'widgets',
        materialDocsUrl: 'https://material.angular.io/components',
        description: 'Material Design component',
      }
    );
  });

  private formatComponentName(param: string): string {
    return param
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
