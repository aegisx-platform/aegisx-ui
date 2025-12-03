import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatTreeModule,
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Cherry' }],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Spinach' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Carrot' }, { name: 'Pumpkin' }],
      },
    ],
  },
];

@Component({
  selector: 'app-material-tree-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTreeModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-tree-doc">
      <!-- Header -->
      <ax-doc-header
        title="Tree"
        description="Hierarchical list component for displaying nested data structures."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-tree-doc__header-links">
          <a
            href="https://material.angular.io/components/tree/overview"
            target="_blank"
            rel="noopener"
            class="material-tree-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group class="material-tree-doc__tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-tree-doc__section">
            <h2 class="material-tree-doc__section-title">Tree Types</h2>
            <p class="material-tree-doc__section-description">
              Trees display hierarchical data with expandable/collapsible nodes.
              They can be flat or nested structures.
            </p>

            <!-- Flat Tree -->
            <h3 class="material-tree-doc__subsection-title">Flat Tree</h3>
            <ax-live-preview title="Tree with flat data source">
              <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
                <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
                  <button mat-icon-button disabled></button>
                  {{ node.name }}
                </mat-tree-node>

                <mat-tree-node
                  *matTreeNodeDef="let node; when: hasChild"
                  matTreeNodePadding
                >
                  <button
                    mat-icon-button
                    matTreeNodeToggle
                    [attr.aria-label]="'Toggle ' + node.name"
                  >
                    <mat-icon class="mat-icon-rtl-mirror">
                      {{
                        treeControl.isExpanded(node)
                          ? 'expand_more'
                          : 'chevron_right'
                      }}
                    </mat-icon>
                  </button>
                  {{ node.name }}
                </mat-tree-node>
              </mat-tree>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-tree-doc__section">
            <h2 class="material-tree-doc__section-title">Usage Examples</h2>

            <!-- Basic Usage -->
            <h3 class="material-tree-doc__subsection-title">Flat Tree Setup</h3>
            <ax-code-tabs [tabs]="flatTreeCode" />

            <!-- With Checkboxes -->
            <h3 class="material-tree-doc__subsection-title">With Checkboxes</h3>
            <ax-code-tabs [tabs]="checkboxCode" />

            <!-- Async Data -->
            <h3 class="material-tree-doc__subsection-title">Async Loading</h3>
            <ax-code-tabs [tabs]="asyncCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-tree-doc__section">
            <h2 class="material-tree-doc__section-title">API Reference</h2>

            <mat-card appearance="outlined" class="material-tree-doc__api-card">
              <mat-card-header>
                <mat-card-title>MatTree Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-tree-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>dataSource</code></td>
                      <td><code>DataSource | Observable | T[]</code></td>
                      <td>Data source for the tree</td>
                    </tr>
                    <tr>
                      <td><code>treeControl</code></td>
                      <td><code>TreeControl</code></td>
                      <td>Controls expand/collapse</td>
                    </tr>
                    <tr>
                      <td><code>trackBy</code></td>
                      <td><code>TrackByFunction</code></td>
                      <td>Track function for nodes</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card appearance="outlined" class="material-tree-doc__api-card">
              <mat-card-header>
                <mat-card-title>Directives</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-tree-doc__api-table">
                  <thead>
                    <tr>
                      <th>Directive</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>matTreeNodeDef</code></td>
                      <td>Template for tree nodes</td>
                    </tr>
                    <tr>
                      <td><code>matTreeNodePadding</code></td>
                      <td>Adds indentation</td>
                    </tr>
                    <tr>
                      <td><code>matTreeNodeToggle</code></td>
                      <td>Toggle expand/collapse</td>
                    </tr>
                    <tr>
                      <td><code>matTreeNodeOutlet</code></td>
                      <td>Outlet for child nodes</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-tree-doc__section">
            <h2 class="material-tree-doc__section-title">Design Tokens</h2>
            <p class="material-tree-doc__section-description">
              AegisX overrides these tokens for tree styling.
            </p>
            <ax-component-tokens [tokens]="treeTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="material-tree-doc__section">
            <h2 class="material-tree-doc__section-title">Usage Guidelines</h2>

            <mat-card
              appearance="outlined"
              class="material-tree-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar>check_circle</mat-icon>
                <mat-card-title>When to Use</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-tree-doc__guide-list">
                  <li><strong>File systems:</strong> Folders and files</li>
                  <li>
                    <strong>Organization charts:</strong> Hierarchical
                    structures
                  </li>
                  <li><strong>Nested menus:</strong> Multi-level navigation</li>
                  <li><strong>Categories:</strong> Nested categorization</li>
                </ul>
              </mat-card-content>
            </mat-card>

            <mat-card
              appearance="outlined"
              class="material-tree-doc__guide-card"
            >
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">cancel</mat-icon>
                <mat-card-title>Avoid</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="material-tree-doc__guide-list">
                  <li>Don't use for flat data (use list instead)</li>
                  <li>Don't nest too deeply (more than 5 levels)</li>
                  <li>Don't expand all nodes by default</li>
                  <li>Don't use without clear visual hierarchy</li>
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
      .material-tree-doc {
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
export class MaterialTreeDocComponent {
  private _transformer = (node: FoodNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level: level,
  });

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  flatTreeCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

private transformer = (node: FoodNode, level: number): FlatNode => ({
  expandable: !!node.children && node.children.length > 0,
  name: node.name,
  level: level,
});

treeControl = new FlatTreeControl<FlatNode>(
  node => node.level,
  node => node.expandable
);

treeFlattener = new MatTreeFlattener(
  this.transformer,
  node => node.level,
  node => node.expandable,
  node => node.children
);

dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

hasChild = (_: number, node: FlatNode) => node.expandable;`,
    },
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
  <!-- Leaf nodes -->
  <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
    <button mat-icon-button disabled></button>
    {{node.name}}
  </mat-tree-node>

  <!-- Expandable nodes -->
  <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
    <button mat-icon-button matTreeNodeToggle>
      <mat-icon>
        {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
      </mat-icon>
    </button>
    {{node.name}}
  </mat-tree-node>
</mat-tree>`,
    },
  ];

  checkboxCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
  <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
    <button mat-icon-button disabled></button>
    <mat-checkbox [checked]="node.selected"
                  (change)="leafItemSelectionToggle(node)">
      {{node.name}}
    </mat-checkbox>
  </mat-tree-node>

  <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
    <button mat-icon-button matTreeNodeToggle>
      <mat-icon>
        {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
      </mat-icon>
    </button>
    <mat-checkbox [checked]="descendantsAllSelected(node)"
                  [indeterminate]="descendantsPartiallySelected(node)"
                  (change)="itemSelectionToggle(node)">
      {{node.name}}
    </mat-checkbox>
  </mat-tree-node>
</mat-tree>`,
    },
  ];

  asyncCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `// Dynamic data source for lazy loading
export class DynamicDataSource implements DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: DynamicDatabase
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (change.added || change.removed) {
        this.handleTreeControl(change);
      }
    });
    return merge(collectionViewer.viewChange, this.dataChange);
  }

  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    change.added.forEach(node => this.loadChildren(node));
    change.removed.forEach(node => this.removeChildren(node));
  }
}`,
    },
  ];

  treeTokens: ComponentToken[] = [
    {
      cssVar: '--mat-tree-node-min-height',
      usage: 'Minimum node height',
      value: '48px',
      category: 'Size',
    },
    {
      cssVar: '--mat-tree-node-text-color',
      usage: 'Node text color',
      value: 'var(--ax-text-body)',
      category: 'Color',
    },
  ];
}
