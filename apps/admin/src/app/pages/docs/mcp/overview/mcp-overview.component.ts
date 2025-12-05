import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
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
          AegisX MCP Server เป็น Model Context Protocol (MCP) server ที่ช่วยให้ AI assistants
          เช่น Claude, Cursor, หรือ VS Code Copilot สามารถเข้าถึงข้อมูล components, patterns,
          และ CRUD generator ของ AegisX ได้โดยตรง ทำให้การพัฒนา Angular applications
          เป็นไปอย่างรวดเร็วและมีประสิทธิภาพ
        </p>

        <div class="npm-badge">
          <a href="https://www.npmjs.com/package/@aegisx/mcp" target="_blank" rel="noopener">
            <img src="https://img.shields.io/npm/v/@aegisx/mcp.svg" alt="npm version">
          </a>
          <a href="https://github.com/aegisx-platform/aegisx-mcp" target="_blank" rel="noopener">
            <img src="https://img.shields.io/badge/GitHub-aegisx--mcp-blue" alt="GitHub">
          </a>
        </div>
      </section>

      <!-- Installation -->
      <section class="section">
        <h2>Installation</h2>

        <mat-tab-group animationDuration="200ms">
          <mat-tab label="npm">
            <div class="tab-content">
              <ax-live-preview variant="bordered" direction="column">
                <div class="code-block">
                  <div class="code-header">
                    <span class="file-name">Terminal</span>
                  </div>
                  <pre><code>npm install -g @aegisx/mcp</code></pre>
                </div>
              </ax-live-preview>
            </div>
          </mat-tab>
          <mat-tab label="pnpm">
            <div class="tab-content">
              <ax-live-preview variant="bordered" direction="column">
                <div class="code-block">
                  <div class="code-header">
                    <span class="file-name">Terminal</span>
                  </div>
                  <pre><code>pnpm add -g @aegisx/mcp</code></pre>
                </div>
              </ax-live-preview>
            </div>
          </mat-tab>
          <mat-tab label="npx (no install)">
            <div class="tab-content">
              <ax-live-preview variant="bordered" direction="column">
                <div class="code-block">
                  <div class="code-header">
                    <span class="file-name">Use directly with npx</span>
                  </div>
                  <pre><code>npx @aegisx/mcp</code></pre>
                </div>
              </ax-live-preview>
            </div>
          </mat-tab>
        </mat-tab-group>
      </section>

      <!-- Configuration -->
      <section class="section">
        <h2>Configuration</h2>

        <mat-tab-group animationDuration="200ms">
          <mat-tab label="Claude Desktop">
            <div class="tab-content">
              <p class="config-desc">
                Add to <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>:
              </p>

              <h4 class="config-subtitle">Option 1: Using npx (no installation needed)</h4>
              <ax-live-preview variant="bordered" direction="column">
                <div class="code-block">
                  <div class="code-header">
                    <span class="file-name">claude_desktop_config.json</span>
                  </div>
                  <pre><code>{{ claudeConfigCode }}</code></pre>
                </div>
              </ax-live-preview>

              <h4 class="config-subtitle">Option 2: Global installation</h4>
              <ax-live-preview variant="bordered" direction="column">
                <div class="code-block">
                  <div class="code-header">
                    <span class="file-name">After: npm install -g &#64;aegisx/mcp</span>
                  </div>
                  <pre><code>{{ claudeGlobalCode }}</code></pre>
                </div>
              </ax-live-preview>
            </div>
          </mat-tab>
          <mat-tab label="Cursor">
            <div class="tab-content">
              <p class="config-desc">
                Add to your Cursor MCP settings:
              </p>
              <ax-live-preview variant="bordered" direction="column">
                <div class="code-block">
                  <div class="code-header">
                    <span class="file-name">Cursor MCP Config</span>
                  </div>
                  <pre><code>{{ cursorConfigCode }}</code></pre>
                </div>
              </ax-live-preview>
            </div>
          </mat-tab>
          <mat-tab label="VS Code">
            <div class="tab-content">
              <p class="config-desc">
                Add to your VS Code MCP extension settings:
              </p>
              <ax-live-preview variant="bordered" direction="column">
                <div class="code-block">
                  <div class="code-header">
                    <span class="file-name">VS Code settings.json</span>
                  </div>
                  <pre><code>{{ vscodeConfigCode }}</code></pre>
                </div>
              </ax-live-preview>
            </div>
          </mat-tab>
        </mat-tab-group>
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
              <mat-card appearance="outlined" class="tool-card" [routerLink]="tool.docsUrl">
                <mat-card-header>
                  <div class="card-icon">
                    <mat-icon>{{ tool.icon }}</mat-icon>
                  </div>
                  <mat-card-title>{{ tool.name }}</mat-card-title>
                </mat-card-header>
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
              <mat-card appearance="outlined" class="tool-card" [routerLink]="tool.docsUrl">
                <mat-card-header>
                  <div class="card-icon">
                    <mat-icon>{{ tool.icon }}</mat-icon>
                  </div>
                  <mat-card-title>{{ tool.name }}</mat-card-title>
                </mat-card-header>
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
              <mat-card appearance="outlined" class="tool-card" [routerLink]="tool.docsUrl">
                <mat-card-header>
                  <div class="card-icon">
                    <mat-icon>{{ tool.icon }}</mat-icon>
                  </div>
                  <mat-card-title>{{ tool.name }}</mat-card-title>
                </mat-card-header>
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
                <code>aegisx_patterns_get name="Angular Signal-based Component"</code>
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
              Component documentation พร้อม inputs, outputs,
              และ usage examples
            </p>
          </mat-card>
          <mat-card appearance="outlined" class="benefit-card">
            <mat-icon>pattern</mat-icon>
            <h4>11 Development Patterns</h4>
            <p>
              Backend, frontend, database, และ testing patterns
              พร้อม code examples
            </p>
          </mat-card>
          <mat-card appearance="outlined" class="benefit-card">
            <mat-icon>build</mat-icon>
            <h4>CRUD Generator</h4>
            <p>
              Generate backend และ frontend CRUD modules
              ด้วย command เดียว
            </p>
          </mat-card>
          <mat-card appearance="outlined" class="benefit-card">
            <mat-icon>search</mat-icon>
            <h4>Smart Search</h4>
            <p>
              ค้นหา components และ patterns ด้วย keywords
              หรือ functionality
            </p>
          </mat-card>
        </div>
      </section>

      <!-- Resources -->
      <section class="section">
        <h2>Resources</h2>
        <div class="quick-links">
          <a href="https://www.npmjs.com/package/@aegisx/mcp" target="_blank" rel="noopener" class="quick-link">
            <mat-icon>inventory_2</mat-icon>
            <span>NPM Package</span>
            <mat-icon class="arrow">open_in_new</mat-icon>
          </a>
          <a href="https://github.com/aegisx-platform/aegisx-mcp" target="_blank" rel="noopener" class="quick-link">
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

      .tab-content {
        padding: 1.5rem 0;
      }

      .config-desc {
        color: var(--ax-text-secondary);
        margin-bottom: 1rem;
        font-size: 0.875rem;

        code {
          background: var(--ax-background-subtle);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.8125rem;
          color: var(--ax-primary-default);
        }
      }

      .config-subtitle {
        font-size: 0.875rem;
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
          border-color: var(--ax-primary-default);
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

        .command-preview {
          padding: 0.5rem 0.75rem;
          background: var(--ax-background-subtle);
          border-radius: var(--ax-radius-md);
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.75rem;
          color: var(--ax-success-default);
          overflow-x: auto;
        }

        mat-card-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--ax-border-muted);
        }
      }

      .code-block {
        background: #1e1e2e;
        border-radius: 12px;
        overflow: hidden;

        .code-header {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #181825;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);

          .file-name {
            color: #6c7086;
            font-size: 0.8125rem;
            font-family: 'SF Mono', 'Fira Code', monospace;
          }
        }

        pre {
          margin: 0;
          padding: 1rem;
          overflow-x: auto;

          code {
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 0.8125rem;
            line-height: 1.6;
            color: #cdd6f4;
          }
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
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--ax-text-heading);
        }

        .command-block {
          padding: 0.5rem 0.75rem;
          background: #1e1e2e;
          border-radius: var(--ax-radius-md);
          margin-bottom: 0.75rem;

          code {
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 0.75rem;
            color: #a6e3a1;
          }
        }

        p {
          margin: 0;
          font-size: 0.8125rem;
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
          font-size: 1rem;
          font-weight: 600;
          color: var(--ax-text-heading);
        }

        p {
          margin: 0;
          font-size: 0.875rem;
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
    `,
  ],
})
export class McpOverviewComponent {
  // Real npm package configuration for @aegisx/mcp
  // From: https://github.com/aegisx-platform/aegisx-mcp

  claudeConfigCode = `{
  "mcpServers": {
    "aegisx": {
      "command": "npx",
      "args": ["-y", "@aegisx/mcp"]
    }
  }
}`;

  claudeGlobalCode = `{
  "mcpServers": {
    "aegisx": {
      "command": "aegisx-mcp"
    }
  }
}`;

  cursorConfigCode = `{
  "mcpServers": {
    "aegisx": {
      "command": "npx",
      "args": ["-y", "@aegisx/mcp"]
    }
  }
}`;

  vscodeConfigCode = `{
  "mcp.servers": {
    "aegisx": {
      "command": "npx",
      "args": ["-y", "@aegisx/mcp"]
    }
  }
}`;

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
