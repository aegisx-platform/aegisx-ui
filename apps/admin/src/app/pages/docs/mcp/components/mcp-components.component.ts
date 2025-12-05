import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  DocHeaderComponent,
  LivePreviewComponent,
} from '../../../../components/docs';

interface McpComponent {
  name: string;
  selector: string;
  description: string;
  category: string;
}

interface ComponentCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

@Component({
  selector: 'ax-mcp-components',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    DocHeaderComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="mcp-components">
      <ax-doc-header
        title="MCP Component Tools"
        icon="widgets"
        description="ค้นหาและดูรายละเอียด AegisX UI Components ทั้ง 42 components ผ่าน MCP"
        [breadcrumbs]="[
          { label: 'MCP', link: '/docs/mcp' },
          { label: 'Components' },
        ]"
        status="stable"
        version="1.1.0"
      ></ax-doc-header>

      <!-- Available Tools -->
      <section class="section">
        <h2>Available MCP Tools</h2>

        <div class="category">
          <div class="category-header">
            <mat-icon>terminal</mat-icon>
            <h3>Component Discovery Tools</h3>
          </div>
          <p class="category-desc">
            ใช้ tools เหล่านี้เพื่อค้นหาและดูรายละเอียด AegisX UI Components
          </p>

          <div class="integrations-grid">
            <mat-card appearance="outlined" class="integration-card">
              <mat-card-header>
                <div class="card-icon card-icon--list">
                  <mat-icon>view_list</mat-icon>
                </div>
                <mat-card-title>aegisx_components_list</mat-card-title>
                <mat-card-subtitle>List all components</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>แสดงรายการ components ทั้งหมดหรือ filter ตาม category</p>
                <div class="card-meta">
                  <mat-chip-set>
                    <mat-chip>category (optional)</mat-chip>
                  </mat-chip-set>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-flat-button color="primary">
                  <mat-icon>play_arrow</mat-icon>
                  Try it
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card appearance="outlined" class="integration-card">
              <mat-card-header>
                <div class="card-icon card-icon--get">
                  <mat-icon>info</mat-icon>
                </div>
                <mat-card-title>aegisx_components_get</mat-card-title>
                <mat-card-subtitle>Get component details</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>
                  ดูรายละเอียด component รวมถึง inputs, outputs, usage examples
                </p>
                <div class="card-meta">
                  <mat-chip-set>
                    <mat-chip [highlighted]="true">name (required)</mat-chip>
                  </mat-chip-set>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-flat-button color="primary">
                  <mat-icon>play_arrow</mat-icon>
                  Try it
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card appearance="outlined" class="integration-card">
              <mat-card-header>
                <div class="card-icon card-icon--search">
                  <mat-icon>search</mat-icon>
                </div>
                <mat-card-title>aegisx_components_search</mat-card-title>
                <mat-card-subtitle>Search components</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>ค้นหา components ด้วย keyword หรือ functionality</p>
                <div class="card-meta">
                  <mat-chip-set>
                    <mat-chip [highlighted]="true">query (required)</mat-chip>
                  </mat-chip-set>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-flat-button color="primary">
                  <mat-icon>play_arrow</mat-icon>
                  Try it
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>
      </section>

      <!-- Usage Examples -->
      <section class="section">
        <h2>Usage Examples</h2>

        <mat-expansion-panel class="example-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>view_list</mat-icon>
              List All Components
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="example-content">
            <ax-live-preview variant="bordered" direction="column">
              <div class="code-section">
                <div class="code-header">Command</div>
                <pre><code>{{ listAllExample }}</code></pre>
              </div>
              <div class="result-section">
                <div class="result-header">Result</div>
                <pre class="result-text"><code>{{ listAllResult }}</code></pre>
              </div>
            </ax-live-preview>
          </div>
        </mat-expansion-panel>

        <mat-expansion-panel class="example-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>filter_list</mat-icon>
              Filter by Category
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="example-content">
            <ax-live-preview variant="bordered" direction="column">
              <div class="code-section">
                <div class="code-header">Command</div>
                <pre><code>{{ filterCategoryExample }}</code></pre>
              </div>
              <div class="result-section">
                <div class="result-header">Result</div>
                <pre
                  class="result-text"
                ><code>{{ filterCategoryResult }}</code></pre>
              </div>
            </ax-live-preview>
          </div>
        </mat-expansion-panel>

        <mat-expansion-panel class="example-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>info</mat-icon>
              Get Component Details
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="example-content">
            <ax-live-preview variant="bordered" direction="column">
              <div class="code-section">
                <div class="code-header">Command</div>
                <pre><code>{{ getComponentExample }}</code></pre>
              </div>
              <div class="result-section">
                <div class="result-header">Result (Abbreviated)</div>
                <pre
                  class="result-text"
                ><code>{{ getComponentResult }}</code></pre>
              </div>
            </ax-live-preview>
          </div>
        </mat-expansion-panel>

        <mat-expansion-panel class="example-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>search</mat-icon>
              Search Components
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="example-content">
            <ax-live-preview variant="bordered" direction="column">
              <div class="code-section">
                <div class="code-header">Command</div>
                <pre><code>{{ searchExample }}</code></pre>
              </div>
              <div class="result-section">
                <div class="result-header">Result</div>
                <pre class="result-text"><code>{{ searchResult }}</code></pre>
              </div>
            </ax-live-preview>
          </div>
        </mat-expansion-panel>
      </section>

      <!-- Component Categories -->
      <section class="section">
        <h2>Component Categories</h2>
        <p>AegisX UI มี 42 components แบ่งออกเป็น 8 categories ตามการใช้งาน</p>

        <div class="integrations-grid">
          @for (category of categories; track category.id) {
            <mat-card
              class="integration-card"
              (click)="selectCategory(category.id)"
            >
              <mat-card-header>
                <div class="card-icon" [class]="'card-icon--' + category.id">
                  <mat-icon>{{ category.icon }}</mat-icon>
                </div>
                <mat-card-title>{{ category.name }}</mat-card-title>
                <mat-card-subtitle
                  >{{ category.count }} components</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <p>{{ category.description }}</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-flat-button color="primary">
                  <mat-icon>terminal</mat-icon>
                  List
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      </section>

      <!-- Components List -->
      <section class="section">
        <h2>All 42 Components</h2>

        <div class="search-box">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search components...</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input
              matInput
              [(ngModel)]="searchQuery"
              (input)="filterComponents()"
              placeholder="e.g., badge, loading, form"
            />
          </mat-form-field>
        </div>

        <div class="api-table">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Selector</th>
                <th>Category</th>
                <th>MCP Command</th>
              </tr>
            </thead>
            <tbody>
              @for (component of filteredComponents(); track component.name) {
                <tr>
                  <td>
                    <strong>{{ component.name }}</strong>
                    <div class="desc">{{ component.description }}</div>
                  </td>
                  <td>
                    <code>{{ component.selector }}</code>
                  </td>
                  <td>
                    <mat-chip>{{ component.category }}</mat-chip>
                  </td>
                  <td>
                    <code class="command"
                      >aegisx_components_get "{{ component.name }}"</code
                    >
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Best Practices -->
      <section class="section">
        <h2>Why Custom Wrappers?</h2>
        <ax-live-preview variant="bordered" direction="column">
          <div class="benefits-grid">
            <div class="benefit-card">
              <mat-icon>lightbulb</mat-icon>
              <h4>ใช้ Search ก่อน List</h4>
              <p>
                เมื่อรู้คร่าวๆ ว่าต้องการอะไร ใช้
                <code>aegisx_components_search</code> เพื่อค้นหาตรงเป้าหมาย
              </p>
            </div>
            <div class="benefit-card">
              <mat-icon>category</mat-icon>
              <h4>Filter by Category</h4>
              <p>
                เมื่อต้องการดู components ในกลุ่มเดียวกัน ใช้
                <code>aegisx_components_list "category"</code>
              </p>
            </div>
            <div class="benefit-card">
              <mat-icon>code</mat-icon>
              <h4>ดู Code Examples</h4>
              <p>
                ใช้ <code>aegisx_components_get</code> เพื่อดู usage examples
                ที่พร้อมใช้งาน
              </p>
            </div>
            <div class="benefit-card">
              <mat-icon>content_copy</mat-icon>
              <h4>Copy & Customize</h4>
              <p>Examples ที่ได้สามารถ copy ไปใช้และปรับแต่งได้ทันที</p>
            </div>
          </div>
        </ax-live-preview>
      </section>

      <!-- Quick Links -->
      <section class="section">
        <h2>Quick Links</h2>
        <div class="quick-links">
          <a routerLink="/docs/mcp" class="quick-link">
            <mat-icon>home</mat-icon>
            <span>MCP Overview</span>
            <mat-icon class="arrow">arrow_forward</mat-icon>
          </a>
          <a routerLink="/docs/mcp/patterns" class="quick-link">
            <mat-icon>pattern</mat-icon>
            <span>MCP Patterns</span>
            <mat-icon class="arrow">arrow_forward</mat-icon>
          </a>
          <a routerLink="/docs/mcp/crud-generator" class="quick-link">
            <mat-icon>code</mat-icon>
            <span>CRUD Generator</span>
            <mat-icon class="arrow">arrow_forward</mat-icon>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .mcp-components {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .section {
        margin-bottom: 3rem;

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin-bottom: 0.75rem;
        }

        > p {
          color: var(--ax-text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.6;
          max-width: 800px;
        }
      }

      .category {
        margin-bottom: 2.5rem;
        padding: 1.5rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-xl);

        .category-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;

          mat-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
            color: var(--ax-primary-default);
          }

          h3 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--ax-text-heading);
          }
        }

        .category-desc {
          color: var(--ax-text-secondary);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }
      }

      .integrations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      .integration-card {
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--ax-background-default);

        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--ax-shadow-lg);
        }

        mat-card-header {
          .card-icon {
            width: 48px;
            height: 48px;
            border-radius: var(--ax-radius-lg);
            background: var(--ax-primary-faint);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;

            mat-icon {
              font-size: 28px;
              width: 28px;
              height: 28px;
              color: var(--ax-primary-default);
            }

            &--list {
              background: linear-gradient(
                135deg,
                rgba(99, 102, 241, 0.15),
                rgba(139, 92, 246, 0.15)
              );
              mat-icon {
                color: #6366f1;
              }
            }
            &--get {
              background: linear-gradient(
                135deg,
                rgba(16, 185, 129, 0.15),
                rgba(5, 150, 105, 0.15)
              );
              mat-icon {
                color: #10b981;
              }
            }
            &--search {
              background: linear-gradient(
                135deg,
                rgba(245, 158, 11, 0.15),
                rgba(217, 119, 6, 0.15)
              );
              mat-icon {
                color: #f59e0b;
              }
            }
            &--data-display {
              background: linear-gradient(
                135deg,
                rgba(99, 102, 241, 0.15),
                rgba(139, 92, 246, 0.15)
              );
              mat-icon {
                color: #6366f1;
              }
            }
            &--forms {
              background: linear-gradient(
                135deg,
                rgba(16, 185, 129, 0.15),
                rgba(5, 150, 105, 0.15)
              );
              mat-icon {
                color: #10b981;
              }
            }
            &--feedback {
              background: linear-gradient(
                135deg,
                rgba(245, 158, 11, 0.15),
                rgba(217, 119, 6, 0.15)
              );
              mat-icon {
                color: #f59e0b;
              }
            }
            &--navigation {
              background: linear-gradient(
                135deg,
                rgba(6, 182, 212, 0.15),
                rgba(8, 145, 178, 0.15)
              );
              mat-icon {
                color: #06b6d4;
              }
            }
            &--layout {
              background: linear-gradient(
                135deg,
                rgba(236, 72, 153, 0.15),
                rgba(219, 39, 119, 0.15)
              );
              mat-icon {
                color: #ec4899;
              }
            }
            &--auth {
              background: linear-gradient(
                135deg,
                rgba(239, 68, 68, 0.15),
                rgba(220, 38, 38, 0.15)
              );
              mat-icon {
                color: #ef4444;
              }
            }
            &--advanced {
              background: linear-gradient(
                135deg,
                rgba(139, 92, 246, 0.15),
                rgba(124, 58, 237, 0.15)
              );
              mat-icon {
                color: #8b5cf6;
              }
            }
            &--overlays {
              background: linear-gradient(
                135deg,
                rgba(100, 116, 139, 0.15),
                rgba(71, 85, 105, 0.15)
              );
              mat-icon {
                color: #64748b;
              }
            }
          }
        }

        mat-card-content {
          padding-top: 1rem;

          p {
            color: var(--ax-text-secondary);
            font-size: 0.875rem;
            line-height: 1.5;
            margin-bottom: 1rem;
          }
        }

        .card-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
        }

        mat-card-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--ax-border-muted);
        }
      }

      .example-panel {
        margin-bottom: 1rem;
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-muted);
        border-radius: var(--ax-radius-lg) !important;

        mat-panel-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;

          mat-icon {
            color: var(--ax-primary-default);
          }
        }

        .example-content {
          padding: 0.5rem 0;
        }
      }

      .code-section,
      .result-section {
        margin-bottom: 1rem;

        .code-header,
        .result-header {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ax-text-muted);
          margin-bottom: 0.5rem;
        }

        pre {
          background: #1e1e2e;
          border-radius: var(--ax-radius-md);
          padding: 1rem;
          margin: 0;
          overflow-x: auto;

          code {
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 0.8125rem;
            color: #a6e3a1;
          }
        }

        &.result-section pre code {
          color: #cdd6f4;
        }
      }

      .search-box {
        margin-bottom: 1.5rem;

        .search-field {
          width: 100%;
          max-width: 400px;
        }
      }

      .api-table {
        overflow-x: auto;

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;

          th,
          td {
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--ax-border-default);
          }

          th {
            font-weight: 600;
            color: var(--ax-text-heading);
            background: var(--ax-background-subtle);
          }

          td {
            vertical-align: top;

            strong {
              display: block;
              color: var(--ax-text-heading);
              margin-bottom: 0.25rem;
            }

            .desc {
              font-size: 0.8125rem;
              color: var(--ax-text-secondary);
            }
          }

          code {
            background: var(--ax-background-subtle);
            padding: 0.125rem 0.375rem;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
          }

          .command {
            color: var(--ax-success-default);
            background: var(--ax-success-faint);
          }

          tr:hover {
            background: var(--ax-background-subtle);
          }
        }
      }

      .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .benefit-card {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1.5rem;
        background: var(--ax-background-default);
        border-radius: var(--ax-radius-lg);
        border: 1px solid var(--ax-border-muted);

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: var(--ax-primary-default);
        }

        h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--ax-text-heading);
        }

        p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--ax-text-secondary);
          line-height: 1.5;

          code {
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 0.75rem;
            color: var(--ax-success-default);
            background: var(--ax-success-faint);
            padding: 0.125rem 0.375rem;
            border-radius: 4px;
          }
        }
      }

      .quick-links {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1rem;
      }

      .quick-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        text-decoration: none;
        color: var(--ax-text-heading);
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover {
          border-color: var(--ax-primary-default);
          background: var(--ax-primary-faint);
          transform: translateX(4px);

          .arrow {
            opacity: 1;
            transform: translateX(4px);
          }
        }

        mat-icon:first-child {
          color: var(--ax-primary-default);
        }

        span {
          flex: 1;
        }

        .arrow {
          opacity: 0;
          transition: all 0.2s ease;
          color: var(--ax-primary-default);
        }
      }

      @media (max-width: 768px) {
        .components-table {
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .table-header {
            display: none;
          }

          .table-row {
            .col-category,
            .col-action {
              margin-top: 0.5rem;
            }
          }
        }
      }
    `,
  ],
})
export class McpComponentsComponent {
  searchQuery = '';

  categories: ComponentCategory[] = [
    {
      id: 'data-display',
      name: 'Data Display',
      icon: 'dashboard',
      description: 'Components สำหรับแสดงข้อมูล เช่น Badge, Card, KPI Card',
      count: 12,
    },
    {
      id: 'forms',
      name: 'Forms',
      icon: 'edit_note',
      description: 'Components สำหรับ form inputs เช่น Date Picker, OTP Input',
      count: 6,
    },
    {
      id: 'feedback',
      name: 'Feedback',
      icon: 'notifications',
      description: 'Components สำหรับ feedback เช่น Alert, Loading, Skeleton',
      count: 5,
    },
    {
      id: 'navigation',
      name: 'Navigation',
      icon: 'menu',
      description: 'Components สำหรับ navigation เช่น Breadcrumb, Navbar',
      count: 4,
    },
    {
      id: 'layout',
      name: 'Layout',
      icon: 'view_quilt',
      description: 'Layout components เช่น Classic, Compact, Enterprise Layout',
      count: 4,
    },
    {
      id: 'auth',
      name: 'Auth',
      icon: 'lock',
      description: 'Authentication components เช่น Login Form, Register Form',
      count: 4,
    },
    {
      id: 'advanced',
      name: 'Advanced',
      icon: 'auto_awesome',
      description: 'Advanced components เช่น Calendar, Gridster, File Upload',
      count: 6,
    },
    {
      id: 'overlays',
      name: 'Overlays',
      icon: 'layers',
      description: 'Overlay components เช่น Drawer',
      count: 1,
    },
  ];

  allComponents: McpComponent[] = [
    // Data Display
    {
      name: 'Badge',
      selector: 'ax-badge',
      description:
        'Display status indicators, counts, or labels with customizable colors and styles.',
      category: 'data-display',
    },
    {
      name: 'Avatar',
      selector: 'ax-avatar',
      description:
        'Display user profile images with fallback to initials or icons.',
      category: 'data-display',
    },
    {
      name: 'Card',
      selector: 'ax-card',
      description:
        'Container component for grouping related content with optional header and footer.',
      category: 'data-display',
    },
    {
      name: 'KPI Card',
      selector: 'ax-kpi-card',
      description:
        'Display key performance indicators with value, trend, and comparison.',
      category: 'data-display',
    },
    {
      name: 'Stats Card',
      selector: 'ax-stats-card',
      description: 'Compact statistics display with icon and value.',
      category: 'data-display',
    },
    {
      name: 'List',
      selector: 'ax-list',
      description: 'Flexible list component for displaying items with actions.',
      category: 'data-display',
    },
    {
      name: 'Timeline',
      selector: 'ax-timeline',
      description:
        'Display chronological events or activities in a vertical timeline.',
      category: 'data-display',
    },
    {
      name: 'Circular Progress',
      selector: 'ax-circular-progress',
      description: 'Circular progress indicator with percentage display.',
      category: 'data-display',
    },
    {
      name: 'Segmented Progress',
      selector: 'ax-segmented-progress',
      description: 'Multi-segment progress bar for showing distribution.',
      category: 'data-display',
    },
    {
      name: 'Sparkline',
      selector: 'ax-sparkline',
      description: 'Compact inline chart for showing trends.',
      category: 'data-display',
    },
    {
      name: 'Description List',
      selector: 'ax-description-list',
      description: 'Key-value pair display for detailed information.',
      category: 'data-display',
    },
    {
      name: 'Field Display',
      selector: 'ax-field-display',
      description: 'Display a single field with label and value.',
      category: 'data-display',
    },
    // Forms
    {
      name: 'Date Picker',
      selector: 'ax-date-picker',
      description: 'Date selection with calendar popup and range support.',
      category: 'forms',
    },
    {
      name: 'Input OTP',
      selector: 'ax-input-otp',
      description: 'One-time password input with auto-focus navigation.',
      category: 'forms',
    },
    {
      name: 'Knob',
      selector: 'ax-knob',
      description: 'Rotary knob control for value adjustment.',
      category: 'forms',
    },
    {
      name: 'Popup Edit',
      selector: 'ax-popup-edit',
      description: 'Inline editing with popup form for tables and lists.',
      category: 'forms',
    },
    {
      name: 'Scheduler',
      selector: 'ax-scheduler',
      description: 'Week/day scheduler for appointment booking.',
      category: 'forms',
    },
    {
      name: 'Time Slots',
      selector: 'ax-time-slots',
      description: 'Time slot picker for appointment scheduling.',
      category: 'forms',
    },
    // Feedback
    {
      name: 'Alert',
      selector: 'ax-alert',
      description: 'Contextual feedback messages for user actions.',
      category: 'feedback',
    },
    {
      name: 'Loading Bar',
      selector: 'ax-loading-bar',
      description: 'Top loading bar for page/route transitions.',
      category: 'feedback',
    },
    {
      name: 'Inner Loading',
      selector: 'ax-inner-loading',
      description: 'Loading overlay for specific containers/components.',
      category: 'feedback',
    },
    {
      name: 'Splash Screen',
      selector: 'ax-splash-screen',
      description: 'Full page loading screen for app initialization.',
      category: 'feedback',
    },
    {
      name: 'Skeleton',
      selector: 'ax-skeleton',
      description: 'Placeholder loading animation for content.',
      category: 'feedback',
    },
    // Navigation
    {
      name: 'Breadcrumb',
      selector: 'ax-breadcrumb',
      description: 'Navigation breadcrumbs showing page hierarchy.',
      category: 'navigation',
    },
    {
      name: 'Command Palette',
      selector: 'ax-command-palette',
      description: 'Keyboard-driven command search (Cmd+K style).',
      category: 'navigation',
    },
    {
      name: 'Navbar',
      selector: 'ax-navbar',
      description: 'Top navigation bar with logo, menu, and actions.',
      category: 'navigation',
    },
    {
      name: 'Launcher',
      selector: 'ax-launcher',
      description: 'App launcher grid for quick access to modules.',
      category: 'navigation',
    },
    // Layout
    {
      name: 'Classic Layout',
      selector: 'ax-classic-layout',
      description: 'Traditional layout with sidebar navigation.',
      category: 'layout',
    },
    {
      name: 'Compact Layout',
      selector: 'ax-compact-layout',
      description: 'Space-efficient layout with icon-only sidebar.',
      category: 'layout',
    },
    {
      name: 'Enterprise Layout',
      selector: 'ax-enterprise-layout',
      description:
        'Full-featured enterprise layout with multi-level navigation.',
      category: 'layout',
    },
    {
      name: 'Empty Layout',
      selector: 'ax-empty-layout',
      description: 'Minimal layout for auth pages and standalone views.',
      category: 'layout',
    },
    // Auth
    {
      name: 'Login Form',
      selector: 'ax-login-form',
      description: 'Complete login form with validation and social options.',
      category: 'auth',
    },
    {
      name: 'Register Form',
      selector: 'ax-register-form',
      description: 'User registration form with validation.',
      category: 'auth',
    },
    {
      name: 'Reset Password Form',
      selector: 'ax-reset-password-form',
      description: 'Password reset request form.',
      category: 'auth',
    },
    {
      name: 'Social Login',
      selector: 'ax-social-login',
      description: 'Social login buttons component.',
      category: 'auth',
    },
    // Advanced
    {
      name: 'Calendar',
      selector: 'ax-calendar',
      description: 'Full calendar component with events and multiple views.',
      category: 'advanced',
    },
    {
      name: 'Gridster',
      selector: 'ax-gridster',
      description: 'Drag-and-drop dashboard grid layout.',
      category: 'advanced',
    },
    {
      name: 'File Upload',
      selector: 'ax-file-upload',
      description: 'File upload with drag-and-drop and preview.',
      category: 'advanced',
    },
    {
      name: 'Theme Builder',
      selector: 'ax-theme-builder',
      description: 'Visual theme customization tool.',
      category: 'advanced',
    },
    {
      name: 'Theme Switcher',
      selector: 'ax-theme-switcher',
      description: 'Quick theme/dark mode toggle.',
      category: 'advanced',
    },
    {
      name: 'Code Tabs',
      selector: 'ax-code-tabs',
      description: 'Tabbed code snippets with syntax highlighting.',
      category: 'advanced',
    },
    // Overlays
    {
      name: 'Drawer',
      selector: 'ax-drawer',
      description: 'Slide-out panel for secondary content.',
      category: 'overlays',
    },
  ];

  filteredComponentsSignal = signal<McpComponent[]>(this.allComponents);

  filteredComponents = computed(() => {
    const query = this.searchQuery.toLowerCase();
    if (!query) return this.allComponents;
    return this.allComponents.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.selector.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query),
    );
  });

  filterComponents(): void {
    // Trigger computed update
    this.filteredComponentsSignal.set(this.filteredComponents());
  }

  selectCategory(categoryId: string): void {
    this.searchQuery = categoryId;
    this.filterComponents();
  }

  // Example code blocks
  listAllExample = `aegisx_components_list`;

  listAllResult = `# AegisX UI Components (42 total)

## Data display
- **Badge** (\`ax-badge\`) - Display status indicators...
- **Avatar** (\`ax-avatar\`) - Display user profile images...
...

## Forms
- **Date Picker** (\`ax-date-picker\`) - Date selection...
...`;

  filterCategoryExample = `aegisx_components_list category="forms"`;

  filterCategoryResult = `# AegisX UI Components - Forms (6 components)

- **Date Picker** (\`ax-date-picker\`) - Date selection with calendar popup and range support.
- **Input OTP** (\`ax-input-otp\`) - One-time password input with auto-focus navigation.
- **Knob** (\`ax-knob\`) - Rotary knob control for value adjustment.
- **Popup Edit** (\`ax-popup-edit\`) - Inline editing with popup form for tables and lists.
- **Scheduler** (\`ax-scheduler\`) - Week/day scheduler for appointment booking.
- **Time Slots** (\`ax-time-slots\`) - Time slot picker for appointment scheduling.`;

  getComponentExample = `aegisx_components_get "Badge"`;

  getComponentResult = `# Badge Component

**Selector:** \`ax-badge\`
**Category:** data-display

## Description
Display status indicators, counts, or labels with customizable colors and styles.

## Inputs
| Name | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'solid' | 'outline' | 'soft' | 'solid' | Badge style variant |
| color | string | 'primary' | Badge color |
| size | 'sm' | 'md' | 'lg' | 'md' | Badge size |
...

## Usage Example
\`\`\`html
<ax-badge variant="solid" color="success">Active</ax-badge>
\`\`\``;

  searchExample = `aegisx_components_search "loading"`;

  searchResult = `# Search Results for "loading" (4 matches)

1. **Loading Bar** (\`ax-loading-bar\`)
   Category: feedback
   Top loading bar for page/route transitions.

2. **Inner Loading** (\`ax-inner-loading\`)
   Category: feedback
   Loading overlay for specific containers/components.

3. **Splash Screen** (\`ax-splash-screen\`)
   Category: feedback
   Full page loading screen for app initialization.

4. **Skeleton** (\`ax-skeleton\`)
   Category: feedback
   Placeholder loading animation for content.`;
}
