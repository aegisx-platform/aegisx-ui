import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { AxCodeTabsComponent, CodeTab } from '@aegisx/ui';
import {
  DocHeaderComponent,
  LivePreviewComponent,
} from '../../../../components/docs';

interface McpTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'components' | 'patterns' | 'crud';
  command: string;
  docsUrl: string;
}

@Component({
  selector: 'ax-mcp-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTabsModule,
    AxCodeTabsComponent,
    DocHeaderComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="mcp-overview">
      <ax-doc-header
        title="AegisX MCP Server"
        icon="smart_toy"
        description="Model Context Protocol server for AI-assisted development with AegisX UI components, patterns, and CRUD generator."
        [breadcrumbs]="[{ label: 'MCP' }]"
        status="stable"
        version="1.1.0"
      ></ax-doc-header>

      <!-- Introduction -->
      <section class="section">
        <h2>Overview</h2>
        <p>
          AegisX MCP Server เป็น Model Context Protocol (MCP) server ที่ช่วยให้
          AI assistants เช่น Claude, Cursor, หรือ VS Code Copilot
          สามารถเข้าถึงข้อมูล components, patterns, และ CRUD generator ของ
          AegisX ได้โดยตรง ทำให้การพัฒนา Angular applications
          เป็นไปอย่างรวดเร็วและมีประสิทธิภาพ
        </p>

        <div class="npm-badge">
          <a
            href="https://www.npmjs.com/package/@aegisx/mcp"
            target="_blank"
            rel="noopener"
          >
            <img
              src="https://img.shields.io/npm/v/@aegisx/mcp.svg"
              alt="npm version"
            />
          </a>
          <a
            href="https://github.com/aegisx-platform/aegisx-mcp"
            target="_blank"
            rel="noopener"
          >
            <img
              src="https://img.shields.io/badge/GitHub-aegisx--mcp-blue"
              alt="GitHub"
            />
          </a>
        </div>
      </section>

      <!-- Installation -->
      <section class="section">
        <h2>Installation</h2>
        <ax-code-tabs [tabs]="installTabs"></ax-code-tabs>
      </section>

      <!-- Configuration -->
      <section class="section">
        <h2>Configuration</h2>

        <div class="config-section">
          <h3>Claude Desktop</h3>
          <p class="config-desc">
            Add to
            <code
              >~/Library/Application
              Support/Claude/claude_desktop_config.json</code
            >:
          </p>
          <h4 class="config-subtitle">
            Option 1: Using npx (no installation needed)
          </h4>
          <ax-code-tabs [tabs]="claudeNpxTabs"></ax-code-tabs>
          <h4 class="config-subtitle">Option 2: Global installation</h4>
          <ax-code-tabs [tabs]="claudeGlobalTabs"></ax-code-tabs>
        </div>

        <div class="config-section">
          <h3>Cursor</h3>
          <p class="config-desc">Add to your Cursor MCP settings:</p>
          <ax-code-tabs [tabs]="cursorTabs"></ax-code-tabs>
        </div>

        <div class="config-section">
          <h3>VS Code</h3>
          <p class="config-desc">Add to your VS Code MCP extension settings:</p>
          <ax-code-tabs [tabs]="vscodeTabs"></ax-code-tabs>
        </div>
      </section>

      <!-- Tool Categories -->
      <section class="section">
        <h2>Available Tools</h2>

        <!-- Components Category -->
        <div class="category">
          <div class="category-header">
            <mat-icon>widgets</mat-icon>
            <h3>Component Tools</h3>
          </div>
          <p class="category-desc">
            ค้นหาและดูรายละเอียด AegisX UI components ทั้ง 42 components
          </p>

          <div class="tools-grid">
            @for (tool of getByCategory('components'); track tool.id) {
              <mat-card
                appearance="outlined"
                class="tool-card"
                [routerLink]="tool.docsUrl"
              >
                <div class="card-header-row">
                  <span class="card-title">{{ tool.name }}</span>
                  <div class="card-icon">
                    <mat-icon>{{ tool.icon }}</mat-icon>
                  </div>
                </div>
                <mat-card-content>
                  <p>{{ tool.description }}</p>
                  <div class="command-preview">
                    <code>{{ tool.command }}</code>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-flat-button color="primary">
                    <mat-icon>menu_book</mat-icon>
                    Docs
                  </button>
                </mat-card-actions>
              </mat-card>
            }
          </div>
        </div>

        <!-- Patterns Category -->
        <div class="category">
          <div class="category-header">
            <mat-icon>pattern</mat-icon>
            <h3>Pattern Tools</h3>
          </div>
          <p class="category-desc">
            ค้นหา development patterns พร้อม code examples
          </p>

          <div class="tools-grid">
            @for (tool of getByCategory('patterns'); track tool.id) {
              <mat-card
                appearance="outlined"
                class="tool-card"
                [routerLink]="tool.docsUrl"
              >
                <div class="card-header-row">
                  <span class="card-title">{{ tool.name }}</span>
                  <div class="card-icon">
                    <mat-icon>{{ tool.icon }}</mat-icon>
                  </div>
                </div>
                <mat-card-content>
                  <p>{{ tool.description }}</p>
                  <div class="command-preview">
                    <code>{{ tool.command }}</code>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-flat-button color="primary">
                    <mat-icon>menu_book</mat-icon>
                    Docs
                  </button>
                </mat-card-actions>
              </mat-card>
            }
          </div>
        </div>

        <!-- CRUD Category -->
        <div class="category">
          <div class="category-header">
            <mat-icon>code</mat-icon>
            <h3>CRUD Generator Tools</h3>
          </div>
          <p class="category-desc">
            สร้าง CRUD modules อัตโนมัติสำหรับ backend และ frontend
          </p>

          <div class="tools-grid">
            @for (tool of getByCategory('crud'); track tool.id) {
              <mat-card
                appearance="outlined"
                class="tool-card"
                [routerLink]="tool.docsUrl"
              >
                <div class="card-header-row">
                  <span class="card-title">{{ tool.name }}</span>
                  <div class="card-icon">
                    <mat-icon>{{ tool.icon }}</mat-icon>
                  </div>
                </div>
                <mat-card-content>
                  <p>{{ tool.description }}</p>
                  <div class="command-preview">
                    <code>{{ tool.command }}</code>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-flat-button color="primary">
                    <mat-icon>menu_book</mat-icon>
                    Docs
                  </button>
                </mat-card-actions>
              </mat-card>
            }
          </div>
        </div>
      </section>

      <!-- Usage Examples -->
      <section class="section">
        <h2>Usage Examples</h2>
        <ax-live-preview variant="bordered" direction="column">
          <div class="examples-grid">
            <div class="example-card">
              <h4>ค้นหา Loading Components</h4>
              <div class="command-block">
                <code>aegisx_components_search query="loading"</code>
              </div>
              <p>ค้นหา components ที่เกี่ยวกับ loading states</p>
            </div>

            <div class="example-card">
              <h4>ดูรายละเอียด Badge Component</h4>
              <div class="command-block">
                <code>aegisx_components_get name="Badge"</code>
              </div>
              <p>แสดง inputs, outputs, และ usage examples</p>
            </div>

            <div class="example-card">
              <h4>ดู Angular Signal Pattern</h4>
              <div class="command-block">
                <code
                  >aegisx_patterns_get name="Angular Signal-based
                  Component"</code
                >
              </div>
              <p>แสดง code example สำหรับ modern Angular patterns</p>
            </div>

            <div class="example-card">
              <h4>สร้าง CRUD Command</h4>
              <div class="command-block">
                <code>aegisx_crud_build_command tableName="products"</code>
              </div>
              <p>สร้าง command สำหรับ generate CRUD module</p>
            </div>
          </div>
        </ax-live-preview>
      </section>

      <!-- Features -->
      <section class="section">
        <h2>Key Features</h2>
        <div class="benefits-grid">
          <mat-card appearance="outlined" class="benefit-card">
            <mat-icon>widgets</mat-icon>
            <h4>42 UI Components</h4>
            <p>
              Component documentation พร้อม inputs, outputs, และ usage examples
            </p>
          </mat-card>
          <mat-card appearance="outlined" class="benefit-card">
            <mat-icon>pattern</mat-icon>
            <h4>11 Development Patterns</h4>
            <p>
              Backend, frontend, database, และ testing patterns พร้อม code
              examples
            </p>
          </mat-card>
          <mat-card appearance="outlined" class="benefit-card">
            <mat-icon>build</mat-icon>
            <h4>CRUD Generator</h4>
            <p>Generate backend และ frontend CRUD modules ด้วย command เดียว</p>
          </mat-card>
          <mat-card appearance="outlined" class="benefit-card">
            <mat-icon>search</mat-icon>
            <h4>Smart Search</h4>
            <p>
              ค้นหา components และ patterns ด้วย keywords หรือ functionality
            </p>
          </mat-card>
        </div>
      </section>

      <!-- Resources -->
      <section class="section">
        <h2>Resources</h2>
        <div class="quick-links">
          <a
            href="https://www.npmjs.com/package/@aegisx/mcp"
            target="_blank"
            rel="noopener"
            class="quick-link"
          >
            <mat-icon>inventory_2</mat-icon>
            <span>NPM Package</span>
            <mat-icon class="arrow">open_in_new</mat-icon>
          </a>
          <a
            href="https://github.com/aegisx-platform/aegisx-mcp"
            target="_blank"
            rel="noopener"
            class="quick-link"
          >
            <mat-icon>code</mat-icon>
            <span>GitHub Repository</span>
            <mat-icon class="arrow">open_in_new</mat-icon>
          </a>
          <a routerLink="/docs/mcp/components" class="quick-link">
            <mat-icon>widgets</mat-icon>
            <span>Component Tools</span>
            <mat-icon class="arrow">arrow_forward</mat-icon>
          </a>
          <a routerLink="/docs/mcp/patterns" class="quick-link">
            <mat-icon>pattern</mat-icon>
            <span>Pattern Tools</span>
            <mat-icon class="arrow">arrow_forward</mat-icon>
          </a>
          <a routerLink="/docs/mcp/crud-generator" class="quick-link">
            <mat-icon>terminal</mat-icon>
            <span>CRUD Generator</span>
            <mat-icon class="arrow">arrow_forward</mat-icon>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .mcp-overview {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .section {
        margin-bottom: 3rem;

        h2 {
          font-size: var(--ax-text-2xl);
          font-weight: var(--ax-font-weight-semibold);
          color: var(--ax-text-heading);
          margin-bottom: 0.75rem;
        }

        > p {
          color: var(--ax-text-secondary);
          margin-bottom: 1.5rem;
          line-height: var(--ax-leading-normal);
          max-width: 800px;
        }
      }

      .npm-badge {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;

        a {
          display: inline-block;
        }

        img {
          height: 24px;
        }
      }

      .config-section {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg);

        h3 {
          margin: 0 0 0.5rem;
          font-size: var(--ax-text-lg);
          font-weight: var(--ax-font-weight-semibold);
          color: var(--ax-text-heading);
        }
      }

      .config-desc {
        color: var(--ax-text-secondary);
        margin-bottom: 1rem;
        font-size: var(--ax-text-sm);

        code {
          background: var(--ax-background-subtle);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-family: var(--ax-font-mono);
          font-size: var(--ax-text-xs);
          color: var(--ax-primary-default);
        }
      }

      .config-subtitle {
        font-size: var(--ax-text-sm);
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 1.5rem 0 0.75rem;

        &:first-of-type {
          margin-top: 0;
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
            font-size: var(--ax-text-xl);
            font-weight: var(--ax-font-weight-semibold);
            color: var(--ax-text-heading);
          }
        }

        .category-desc {
          color: var(--ax-text-secondary);
          margin-bottom: 1.5rem;
          font-size: var(--ax-text-sm);
        }
      }

      .tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .tool-card {
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--ax-background-default);

        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--ax-shadow-lg);
        }

        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          gap: 16px;
        }

        .card-title {
          font-size: var(--ax-text-lg);
          font-weight: var(--ax-font-weight-medium);
          color: var(--ax-text-heading);
        }

        .card-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--ax-radius-lg);
          background: var(--ax-primary-faint);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          mat-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
            color: var(--ax-primary-default);
          }
        }

        mat-card-content {
          padding-top: 1rem;

          p {
            color: var(--ax-text-secondary);
            font-size: var(--ax-text-sm);
            line-height: var(--ax-leading-normal);
            margin-bottom: 1rem;
          }
        }

        .command-preview {
          padding: 0.5rem 0.75rem;
          background: var(--ax-background-subtle);
          border-radius: var(--ax-radius-md);
          font-family: var(--ax-font-mono);
          font-size: var(--ax-text-xs);
          color: var(--ax-success-default);
          overflow-x: auto;
        }

        mat-card-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
        }
      }

      .examples-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
      }

      .example-card {
        padding: 1.25rem;
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-muted);
        border-radius: var(--ax-radius-lg);

        h4 {
          margin: 0 0 0.75rem;
          font-size: var(--ax-text-sm);
          font-weight: var(--ax-font-weight-semibold);
          color: var(--ax-text-heading);
        }

        .command-block {
          padding: 0.75rem 1rem;
          background: var(--ax-background-subtle);
          border: 1px solid var(--ax-border-muted);
          border-radius: var(--ax-radius-md);
          margin-bottom: 0.75rem;

          code {
            font-family: var(--ax-font-mono);
            font-size: var(--ax-text-xs);
            color: var(--ax-text-heading);
          }
        }

        p {
          margin: 0;
          font-size: var(--ax-text-xs);
          color: var(--ax-text-secondary);
        }
      }

      .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
      }

      .benefit-card {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1.5rem;
        background: var(--ax-background-default);
        transition: all 0.2s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--ax-shadow-md);
          border-color: var(--ax-primary-default);
        }

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: var(--ax-primary-default);
        }

        h4 {
          margin: 0;
          font-size: var(--ax-text-base);
          font-weight: var(--ax-font-weight-semibold);
          color: var(--ax-text-heading);
        }

        p {
          margin: 0;
          font-size: var(--ax-text-sm);
          color: var(--ax-text-secondary);
          line-height: 1.5;
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
        font-weight: var(--ax-font-weight-medium);
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
    `,
  ],
})
export class McpOverviewComponent {
  // Installation tabs
  installTabs: CodeTab[] = [
    { label: 'npm', code: 'npm install -g @aegisx/mcp', language: 'bash' },
    { label: 'pnpm', code: 'pnpm add -g @aegisx/mcp', language: 'bash' },
    { label: 'npx (no install)', code: 'npx @aegisx/mcp', language: 'bash' },
  ];

  // Configuration tabs
  claudeNpxTabs: CodeTab[] = [
    {
      label: 'claude_desktop_config.json',
      code: `{
  "mcpServers": {
    "aegisx": {
      "command": "npx",
      "args": ["-y", "@aegisx/mcp"]
    }
  }
}`,
      language: 'json',
    },
  ];

  claudeGlobalTabs: CodeTab[] = [
    {
      label: 'After: npm install -g @aegisx/mcp',
      code: `{
  "mcpServers": {
    "aegisx": {
      "command": "aegisx-mcp"
    }
  }
}`,
      language: 'json',
    },
  ];

  cursorTabs: CodeTab[] = [
    {
      label: 'Cursor MCP Config',
      code: `{
  "mcpServers": {
    "aegisx": {
      "command": "npx",
      "args": ["-y", "@aegisx/mcp"]
    }
  }
}`,
      language: 'json',
    },
  ];

  vscodeTabs: CodeTab[] = [
    {
      label: 'settings.json',
      code: `{
  "mcp.servers": {
    "aegisx": {
      "command": "npx",
      "args": ["-y", "@aegisx/mcp"]
    }
  }
}`,
      language: 'json',
    },
  ];

  tools: McpTool[] = [
    // Components
    {
      id: 'components-list',
      name: 'List Components',
      description: 'แสดงรายการ components ทั้งหมดหรือ filter ตาม category',
      icon: 'view_list',
      category: 'components',
      command: 'aegisx_components_list',
      docsUrl: '/docs/mcp/components',
    },
    {
      id: 'components-get',
      name: 'Get Component',
      description: 'ดูรายละเอียด component รวมถึง inputs, outputs, examples',
      icon: 'info',
      category: 'components',
      command: 'aegisx_components_get name="Badge"',
      docsUrl: '/docs/mcp/components',
    },
    {
      id: 'components-search',
      name: 'Search Components',
      description: 'ค้นหา components ด้วย keyword',
      icon: 'search',
      category: 'components',
      command: 'aegisx_components_search query="loading"',
      docsUrl: '/docs/mcp/components',
    },
    // Patterns
    {
      id: 'patterns-list',
      name: 'List Patterns',
      description: 'แสดงรายการ patterns ทั้งหมดหรือ filter ตาม category',
      icon: 'view_list',
      category: 'patterns',
      command: 'aegisx_patterns_list',
      docsUrl: '/docs/mcp/patterns',
    },
    {
      id: 'patterns-get',
      name: 'Get Pattern',
      description: 'ดู pattern พร้อม code example และ best practices',
      icon: 'code',
      category: 'patterns',
      command: 'aegisx_patterns_get name="Angular Signal-based Component"',
      docsUrl: '/docs/mcp/patterns',
    },
    {
      id: 'patterns-suggest',
      name: 'Suggest Patterns',
      description: 'รับ pattern suggestions สำหรับ task ที่ต้องการ',
      icon: 'lightbulb',
      category: 'patterns',
      command: 'aegisx_patterns_suggest task="create form"',
      docsUrl: '/docs/mcp/patterns',
    },
    // CRUD
    {
      id: 'crud-packages',
      name: 'CRUD Packages',
      description: 'ดูข้อมูล packages ที่มี: standard, enterprise, full',
      icon: 'inventory_2',
      category: 'crud',
      command: 'aegisx_crud_packages',
      docsUrl: '/docs/mcp/crud-generator',
    },
    {
      id: 'crud-build',
      name: 'Build Command',
      description: 'สร้าง CRUD generator command พร้อม options',
      icon: 'terminal',
      category: 'crud',
      command: 'aegisx_crud_build_command tableName="products"',
      docsUrl: '/docs/mcp/crud-generator',
    },
    {
      id: 'crud-workflow',
      name: 'CRUD Workflow',
      description: 'ดู workflow สำหรับสร้าง feature ครบวงจร',
      icon: 'account_tree',
      category: 'crud',
      command: 'aegisx_crud_workflow tableName="products"',
      docsUrl: '/docs/mcp/crud-generator',
    },
  ];

  getByCategory(category: McpTool['category']): McpTool[] {
    return this.tools.filter((t) => t.category === category);
  }
}
