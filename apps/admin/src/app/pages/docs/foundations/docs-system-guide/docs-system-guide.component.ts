import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  PropsTableComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { AxBadgeComponent, AxLoadingButtonComponent } from '@aegisx/ui';

/**
 * Documentation System Guide Page
 *
 * Comprehensive guide for creating Storybook-style documentation pages
 * in AegisX Admin.
 */
@Component({
  selector: 'ax-docs-system-guide',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    PropsTableComponent,
    ComponentTokensComponent,
    AxBadgeComponent,
    AxLoadingButtonComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="docs-page">
      <ax-doc-header
        title="Documentation System Guide"
        icon="menu_book"
        description="Comprehensive guide for creating Storybook-style documentation pages in AegisX Admin"
        [breadcrumbs]="[
          { label: 'Foundations', link: '/docs/foundations/overview' },
          { label: 'Docs System Guide' },
        ]"
        variant="page"
        [showImport]="false"
        [showStatus]="false"
        [showVersion]="false"
        [showQuickLinks]="false"
      />

      <mat-tab-group class="docs-page__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="docs-page__tab-content">
            <section class="docs-page__section">
              <h2>Architecture</h2>
              <p>
                The AegisX documentation system provides a consistent,
                professional way to document UI components.
              </p>

              <ax-code-tabs [tabs]="architectureTabs" />
            </section>

            <section class="docs-page__section">
              <h2>Shared Components</h2>
              <div class="component-list">
                @for (comp of sharedComponents; track comp.name) {
                  <div class="component-card">
                    <div class="component-card__header">
                      <mat-icon>{{ comp.icon }}</mat-icon>
                      <h3>{{ comp.name }}</h3>
                    </div>
                    <code class="component-card__selector">{{
                      comp.selector
                    }}</code>
                    <p>{{ comp.description }}</p>
                  </div>
                }
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Components Tab -->
        <mat-tab label="Components">
          <div class="docs-page__tab-content">
            <section class="docs-page__section">
              <h2>DocHeaderComponent</h2>
              <p>
                Unified header for all documentation pages with breadcrumbs,
                status badge, version, and import statement.
              </p>

              <h3 class="docs-page__subsection-title">Live Example</h3>
              <ax-live-preview variant="bordered">
                <ax-doc-header
                  title="Example Component"
                  icon="widgets"
                  description="This is a demo of the DocHeader component used for documentation pages."
                  [breadcrumbs]="[
                    { label: 'Category', link: '#' },
                    { label: 'Example' },
                  ]"
                  status="stable"
                  version="1.0.0"
                  importName="ExampleComponent"
                  [showQuickLinks]="false"
                />
              </ax-live-preview>

              <ax-code-tabs [tabs]="docHeaderTabs" />
            </section>

            <section class="docs-page__section">
              <h2>CodeTabsComponent</h2>
              <p>
                Displays code examples with Prism.js syntax highlighting in
                tabbed format.
              </p>

              <h3 class="docs-page__subsection-title">Live Example</h3>
              <ax-live-preview variant="bordered">
                <ax-code-tabs [tabs]="codeTabsDemo" />
              </ax-live-preview>

              <ax-code-tabs [tabs]="codeTabsTabs" />
            </section>

            <section class="docs-page__section">
              <h2>LivePreviewComponent</h2>
              <p>
                Container for displaying live component examples with flexible
                layout.
              </p>

              <h3 class="docs-page__subsection-title">
                Live Example - Row Layout
              </h3>
              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <ax-badge color="primary">Primary</ax-badge>
                <ax-badge color="success">Success</ax-badge>
                <ax-badge color="warning">Warning</ax-badge>
                <ax-badge color="error">Error</ax-badge>
              </ax-live-preview>

              <h3 class="docs-page__subsection-title">
                Live Example - Column Layout
              </h3>
              <ax-live-preview
                variant="bordered"
                direction="column"
                gap="var(--ax-spacing-sm)"
                align="start"
              >
                <ax-badge color="primary">First</ax-badge>
                <ax-badge color="success">Second</ax-badge>
                <ax-badge color="warning">Third</ax-badge>
              </ax-live-preview>

              <ax-code-tabs [tabs]="livePreviewTabs" />
            </section>

            <section class="docs-page__section">
              <h2>ComponentTokensComponent</h2>
              <p>
                Displays CSS tokens/variables used by a component with live
                values.
              </p>

              <h3 class="docs-page__subsection-title">Live Example</h3>
              <ax-component-tokens [tokens]="exampleTokens" />

              <ax-code-tabs [tabs]="componentTokensTabs" />
            </section>

            <section class="docs-page__section">
              <h2>PropsTableComponent</h2>
              <p>Displays component properties in a formatted table.</p>

              <h3 class="docs-page__subsection-title">Live Example</h3>
              <ax-props-table
                [properties]="exampleProps"
                title="Example Properties"
              />

              <ax-code-tabs [tabs]="propsTableTabs" />
            </section>
          </div>
        </mat-tab>

        <!-- Page Structure Tab -->
        <mat-tab label="Page Structure">
          <div class="docs-page__tab-content">
            <section class="docs-page__section">
              <h2>Standard Page Template</h2>
              <p>
                Every documentation page follows this standard structure for
                consistency.
              </p>
              <ax-code-tabs [tabs]="pageTemplateTabs" />
            </section>

            <section class="docs-page__section">
              <h2>Tab Organization</h2>
              <div class="docs-api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Tab</th>
                      <th>Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Overview</strong></td>
                      <td>Basic usage, variants, common examples</td>
                    </tr>
                    <tr>
                      <td><strong>Examples</strong></td>
                      <td>Advanced usage, real-world scenarios</td>
                    </tr>
                    <tr>
                      <td><strong>API</strong></td>
                      <td>Properties, events, methods</td>
                    </tr>
                    <tr>
                      <td><strong>Tokens</strong></td>
                      <td>CSS variables, customization</td>
                    </tr>
                    <tr>
                      <td><strong>Guidelines</strong></td>
                      <td>Do's/Don'ts, accessibility</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Routing Tab -->
        <mat-tab label="Routing">
          <div class="docs-page__tab-content">
            <section class="docs-page__section">
              <h2>Route Configuration</h2>
              <p>
                Documentation routes are organized by category in separate
                files.
              </p>
              <ax-code-tabs [tabs]="routingTabs" />
            </section>

            <section class="docs-page__section">
              <h2>Categories</h2>
              <div class="docs-api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Path</th>
                      <th>Components</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (cat of categories; track cat.name) {
                      <tr>
                        <td>{{ cat.name }}</td>
                        <td>
                          <code>{{ cat.path }}</code>
                        </td>
                        <td>{{ cat.components }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </mat-tab>

        <!-- Best Practices Tab -->
        <mat-tab label="Best Practices">
          <div class="docs-page__tab-content">
            <section class="docs-page__section">
              <h2>Guidelines</h2>
              <div class="docs-guidelines">
                <div class="docs-guideline docs-guideline--do">
                  <h4><mat-icon>check_circle</mat-icon> Do's</h4>
                  <ul>
                    @for (item of dos; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                </div>
                <div class="docs-guideline docs-guideline--dont">
                  <h4><mat-icon>cancel</mat-icon> Don'ts</h4>
                  <ul>
                    @for (item of donts; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                </div>
              </div>
            </section>

            <section class="docs-page__section">
              <h2>Naming Conventions</h2>
              <ax-code-tabs [tabs]="namingTabs" />
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  // Styles are provided by @aegisx/ui theme styles (_docs.scss)
})
export class DocsSystemGuideComponent {
  // Example tokens for ComponentTokens demo - Complete set
  exampleTokens = [
    {
      cssVar: '--ax-brand-default',
      category: 'Colors',
      usage: 'Primary brand color for buttons and links',
    },
    {
      cssVar: '--ax-brand-emphasis',
      category: 'Colors',
      usage: 'Hover state for primary elements',
    },
    {
      cssVar: '--ax-text-heading',
      category: 'Typography',
      usage: 'Headings and important text',
    },
    {
      cssVar: '--ax-text-secondary',
      category: 'Typography',
      usage: 'Descriptions and helper text',
    },
    {
      cssVar: '--ax-spacing-md',
      category: 'Spacing',
      usage: 'Default padding and gaps (0.75rem)',
    },
    {
      cssVar: '--ax-spacing-lg',
      category: 'Spacing',
      usage: 'Container padding (1rem)',
    },
    {
      cssVar: '--ax-radius-lg',
      category: 'Borders',
      usage: 'Card and modal border radius',
    },
    {
      cssVar: '--ax-radius-full',
      category: 'Borders',
      usage: 'Fully rounded elements (pills, avatars)',
    },
    {
      cssVar: '--ax-shadow-sm',
      category: 'Shadows',
      usage: 'Subtle elevation for cards',
    },
    {
      cssVar: '--ax-shadow-lg',
      category: 'Shadows',
      usage: 'Elevated modals and dropdowns',
    },
    {
      cssVar: '--ax-background-subtle',
      category: 'Backgrounds',
      usage: 'Subtle background for sections',
    },
    {
      cssVar: '--ax-border-default',
      category: 'Borders',
      usage: 'Default border color',
    },
  ];

  // Demo tabs for CodeTabs component - Complete realistic example
  codeTabsDemo = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ax-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user!: User;
  @Input() variant: 'compact' | 'detailed' = 'compact';
  @Output() selected = new EventEmitter<User>();

  onSelect(): void {
    this.selected.emit(this.user);
  }
}`,
    },
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<div class="user-card" [class.user-card--detailed]="variant === 'detailed'">
  <img [src]="user.avatar" [alt]="user.name" class="user-card__avatar" />
  <div class="user-card__content">
    <h3 class="user-card__name">{{ user.name }}</h3>
    <p class="user-card__role">{{ user.role }}</p>
  </div>
  <button mat-icon-button (click)="onSelect()">
    <mat-icon>chevron_right</mat-icon>
  </button>
</div>`,
    },
    {
      label: 'SCSS',
      language: 'scss' as const,
      code: `.user-card {
  display: flex;
  align-items: center;
  gap: var(--ax-spacing-md);
  padding: var(--ax-spacing-lg);
  background: var(--ax-background-subtle);
  border-radius: var(--ax-radius-lg);
  border: 1px solid var(--ax-border-default);

  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: var(--ax-radius-full);
    object-fit: cover;
  }

  &__name {
    font-weight: 600;
    color: var(--ax-text-heading);
  }

  &__role {
    font-size: var(--ax-text-sm);
    color: var(--ax-text-secondary);
  }
}`,
    },
  ];

  // Example props for PropsTable demo - Complete component API
  exampleProps = [
    {
      name: 'user',
      type: 'User',
      default: '-',
      description:
        'User object containing name, avatar, role, and other profile data',
      required: true,
    },
    {
      name: 'variant',
      type: "'compact' | 'detailed' | 'minimal'",
      default: "'compact'",
      description: 'Display style variant of the card',
      required: false,
      values: ['compact', 'detailed', 'minimal'],
    },
    {
      name: 'showActions',
      type: 'boolean',
      default: 'true',
      description: 'Show action buttons (edit, delete) on hover',
      required: false,
    },
    {
      name: 'selectable',
      type: 'boolean',
      default: 'false',
      description: 'Enable selection mode with checkbox',
      required: false,
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Show skeleton loading state',
      required: false,
    },
    {
      name: 'selected',
      type: 'EventEmitter<User>',
      default: '-',
      description: 'Emits when user card is clicked or selected',
      required: false,
    },
    {
      name: 'actionClick',
      type: 'EventEmitter<{action: string, user: User}>',
      default: '-',
      description: 'Emits when an action button is clicked',
      required: false,
    },
  ];

  sharedComponents = [
    {
      name: 'DocHeader',
      selector: 'ax-doc-header',
      icon: 'title',
      description:
        'Unified header with breadcrumbs, status badge, version, and import statement.',
    },
    {
      name: 'CodeTabs',
      selector: 'ax-code-tabs',
      icon: 'code',
      description:
        'Code examples with Prism.js syntax highlighting in tabbed format.',
    },
    {
      name: 'LivePreview',
      selector: 'ax-live-preview',
      icon: 'preview',
      description:
        'Container for live component examples with flexible layout.',
    },
    {
      name: 'ComponentTokens',
      selector: 'ax-component-tokens',
      icon: 'palette',
      description: 'Displays CSS tokens/variables used by a component.',
    },
    {
      name: 'PropsTable',
      selector: 'ax-props-table',
      icon: 'table_chart',
      description: 'Component properties displayed in a formatted table.',
    },
  ];

  categories = [
    {
      name: 'Data Display',
      path: 'data-display/',
      components: 'Badge, Card, Avatar, Timeline',
    },
    { name: 'Forms', path: 'forms/', components: 'Input, DatePicker, Knob' },
    {
      name: 'Feedback',
      path: 'feedback/',
      components: 'Alert, Toast, Loading, Skeleton',
    },
    {
      name: 'Navigation',
      path: 'navigation/',
      components: 'Navbar, Breadcrumb, Stepper',
    },
    {
      name: 'Layout',
      path: 'layout/',
      components: 'Drawer, Splitter, Enterprise',
    },
    {
      name: 'Charts',
      path: 'charts/',
      components: 'Sparkline, CircularProgress',
    },
  ];

  dos = [
    'Always use Preview tab for live demos',
    'Keep code examples concise',
    'Use semantic tokens (--ax-*)',
    'Document all inputs/outputs',
    "Include do's and don'ts",
    'Show real-world examples',
    'Test on dark mode',
  ];

  donts = [
    "Don't skip API documentation",
    "Don't use hardcoded colors",
    "Don't forget accessibility notes",
    "Don't make overly complex examples",
    "Don't skip responsive testing",
  ];

  architectureTabs = [
    {
      label: 'Structure',
      language: 'bash' as const,
      code: `apps/admin/src/app/
├── components/docs/           # Shared doc components
│   ├── doc-header/           # Page header with breadcrumbs
│   ├── code-tabs/            # Code examples with syntax highlighting
│   ├── live-preview/         # Live component preview container
│   ├── props-table/          # API properties table
│   ├── component-tokens/     # CSS tokens display
│   └── index.ts              # Barrel export
├── pages/docs/               # Documentation pages
│   └── components/aegisx/
│       ├── data-display/     # Badge, Card, Avatar, etc.
│       ├── forms/            # Input, DatePicker, etc.
│       ├── feedback/         # Alert, Toast, Loading, etc.
│       └── ...
├── routes/docs/              # Documentation routes
└── types/docs.types.ts       # TypeScript interfaces`,
    },
  ];

  docHeaderTabs = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-doc-header
  title="Loading Button"
  icon="smart_button"
  description="Material 3 button with built-in loading state..."
  [breadcrumbs]="[
    { label: 'Feedback', link: '/docs/components/aegisx/feedback' },
    { label: 'Loading Button' }
  ]"
  status="stable"
  version="1.0.0"
  importName="AxLoadingButtonComponent"
/>`,
    },
  ];

  codeTabsTabs = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- With live preview tab -->
<ax-code-tabs [tabs]="[
  { label: 'Preview', code: '', language: 'preview' },
  { label: 'HTML', code: htmlCode, language: 'html' },
  { label: 'TypeScript', code: tsCode, language: 'typescript' }
]">
  <!-- Live component rendered here when Preview tab is active -->
  <ax-loading-button [loading]="isLoading">Click Me</ax-loading-button>
</ax-code-tabs>`,
    },
  ];

  livePreviewTabs = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<!-- Multiple items in row -->
<ax-live-preview
  variant="bordered"
  direction="row"
  gap="var(--ax-spacing-lg)"
>
  <ax-component variant="small" />
  <ax-component variant="medium" />
  <ax-component variant="large" />
</ax-live-preview>`,
    },
  ];

  componentTokensTabs = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-component-tokens [tokens]="[
  { cssVar: '--ax-brand-default', category: 'Colors', usage: 'Primary color' },
  { cssVar: '--ax-spacing-md', category: 'Spacing', usage: 'Default padding' },
  { cssVar: '--ax-shadow-sm', category: 'Shadows', usage: 'Card shadow' }
]" />`,
    },
  ];

  propsTableTabs = [
    {
      label: 'HTML',
      language: 'html' as const,
      code: `<ax-props-table [properties]="[
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Show loading state',
    required: false
  },
  {
    name: 'variant',
    type: 'string',
    default: 'raised',
    description: 'Button style variant',
    values: ['raised', 'stroked', 'flat', 'basic']
  }
]" />`,
    },
  ];

  pageTemplateTabs = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `@Component({
  selector: 'ax-component-name-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    AxComponentName,
    DocHeaderComponent,
    CodeTabsComponent,
    ComponentTokensComponent,
  ],
  template: \`
    <div class="docs-page">
      <ax-doc-header
        title="Component Name"
        icon="icon_name"
        description="Component description..."
        [breadcrumbs]="[
          { label: 'Category', link: '/docs/components/aegisx/category' },
          { label: 'Component Name' }
        ]"
        status="stable"
        version="1.0.0"
        importName="AxComponentName"
      />

      <mat-tab-group class="docs-page__tabs" animationDuration="150ms">
        <mat-tab label="Overview">...</mat-tab>
        <mat-tab label="Examples">...</mat-tab>
        <mat-tab label="API">...</mat-tab>
        <mat-tab label="Tokens">...</mat-tab>
        <mat-tab label="Guidelines">...</mat-tab>
      </mat-tab-group>
    </div>
  \`,
})
export class ComponentNameDocComponent { }`,
    },
  ];

  routingTabs = [
    {
      label: 'TypeScript',
      language: 'typescript' as const,
      code: `// apps/admin/src/app/routes/docs/components-aegisx/feedback.routes.ts
export const FEEDBACK_ROUTES: Route[] = [
  {
    path: 'feedback/loading-button',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/feedback/loading-button/loading-button-doc.component'
      ).then((m) => m.LoadingButtonDocComponent),
    data: {
      title: 'Loading Button',
      description: 'Button with loading state',
    },
  },
];`,
    },
  ];

  namingTabs = [
    {
      label: 'Conventions',
      language: 'bash' as const,
      code: `# Files
[component-name]-doc.component.ts

# Selectors
ax-[component-name]-doc

# CSS Classes
.docs-page { }
.docs-page__tabs { }
.docs-page__tab-content { }
.docs-page__section { }
.docs-page__demo-row { }

# Properties
basicUsageTabs = [];
variantsTabs = [];
componentTokens: ComponentToken[] = [];`,
    },
  ];
}
