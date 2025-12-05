import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DocHeaderComponent,
  LivePreviewComponent,
} from '../../../../components/docs';

interface Pattern {
  name: string;
  category: 'backend' | 'frontend' | 'database' | 'testing';
  description: string;
  command: string;
}

interface PatternCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

@Component({
  selector: 'ax-mcp-patterns',
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
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    DocHeaderComponent,
    LivePreviewComponent,
  ],
  template: `
    <div class="mcp-patterns">
      <ax-doc-header
        title="MCP Pattern Tools"
        icon="pattern"
        description="ค้นหาและดู development patterns พร้อม code examples สำหรับ backend, frontend, database และ testing"
        [breadcrumbs]="[
          { label: 'MCP', link: '/docs/mcp' },
          { label: 'Patterns' },
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
            <h3>Pattern Discovery Tools</h3>
          </div>
          <p class="category-desc">
            ใช้ tools เหล่านี้เพื่อค้นหาและดู development patterns พร้อม code
            examples
          </p>

          <div class="integrations-grid">
            <mat-card appearance="outlined" class="integration-card">
              <div class="card-header-row">
                <div class="card-header-text">
                  <span class="card-title">aegisx_patterns_list</span>
                  <span class="card-subtitle">List all patterns</span>
                </div>
                <div class="card-icon card-icon--list">
                  <mat-icon>view_list</mat-icon>
                </div>
              </div>
              <mat-card-content>
                <p>แสดงรายการ patterns ทั้งหมดหรือ filter ตาม category</p>
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
              <div class="card-header-row">
                <div class="card-header-text">
                  <span class="card-title">aegisx_patterns_get</span>
                  <span class="card-subtitle">Get pattern with code</span>
                </div>
                <div class="card-icon card-icon--get">
                  <mat-icon>code</mat-icon>
                </div>
              </div>
              <mat-card-content>
                <p>ดู pattern พร้อม complete code example และ best practices</p>
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
              <div class="card-header-row">
                <div class="card-header-text">
                  <span class="card-title">aegisx_patterns_search</span>
                  <span class="card-subtitle">Search patterns</span>
                </div>
                <div class="card-icon card-icon--search">
                  <mat-icon>search</mat-icon>
                </div>
              </div>
              <mat-card-content>
                <p>ค้นหา patterns ด้วย keyword</p>
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

            <mat-card appearance="outlined" class="integration-card">
              <div class="card-header-row">
                <div class="card-header-text">
                  <span class="card-title">aegisx_patterns_suggest</span>
                  <span class="card-subtitle">Get suggestions</span>
                </div>
                <div class="card-icon card-icon--suggest">
                  <mat-icon>lightbulb</mat-icon>
                </div>
              </div>
              <mat-card-content>
                <p>รับ pattern suggestions ตาม task ที่ต้องการทำ</p>
                <div class="card-meta">
                  <mat-chip-set>
                    <mat-chip [highlighted]="true">task (required)</mat-chip>
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

      <!-- Pattern Categories -->
      <section class="section">
        <h2>Pattern Categories</h2>
        <p>AegisX มี 11 development patterns แบ่งออกเป็น 4 categories</p>

        <div class="integrations-grid">
          @for (category of categories; track category.id) {
            <mat-card
              appearance="outlined"
              class="integration-card"
              [class.selected]="selectedCategory() === category.id"
              (click)="selectCategory(category.id)"
            >
              <div class="card-header-row">
                <div class="card-header-text">
                  <span class="card-title">{{ category.name }}</span>
                  <span class="card-subtitle"
                    >{{ category.count }} patterns</span
                  >
                </div>
                <div class="card-icon" [class]="'card-icon--' + category.id">
                  <mat-icon>{{ category.icon }}</mat-icon>
                </div>
              </div>
              <mat-card-content>
                <p>Click to filter patterns by this category</p>
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

      <!-- All Patterns -->
      <section class="section">
        <h2>All 11 Development Patterns</h2>

        <mat-tab-group animationDuration="200ms">
          <!-- Backend Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>storage</mat-icon>
              <span>Backend (5)</span>
            </ng-template>
            <div class="tab-content">
              <div class="patterns-list">
                @for (
                  pattern of getPatternsByCategory('backend');
                  track pattern.name
                ) {
                  <mat-card appearance="outlined" class="integration-card">
                    <div class="card-header-row">
                      <div class="card-header-text">
                        <span class="card-title">{{ pattern.name }}</span>
                        <span class="card-subtitle">{{
                          pattern.category
                        }}</span>
                      </div>
                      <div class="card-icon card-icon--backend">
                        <mat-icon>code</mat-icon>
                      </div>
                    </div>
                    <mat-card-content>
                      <p>{{ pattern.description }}</p>
                      <div class="command-box">
                        <code>{{ pattern.command }}</code>
                      </div>
                    </mat-card-content>
                    <mat-card-actions>
                      <button mat-flat-button color="primary">
                        <mat-icon>play_arrow</mat-icon>
                        Get Pattern
                      </button>
                    </mat-card-actions>
                  </mat-card>
                }
              </div>
            </div>
          </mat-tab>

          <!-- Frontend Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>web</mat-icon>
              <span>Frontend (3)</span>
            </ng-template>
            <div class="tab-content">
              <div class="patterns-list">
                @for (
                  pattern of getPatternsByCategory('frontend');
                  track pattern.name
                ) {
                  <mat-card appearance="outlined" class="integration-card">
                    <div class="card-header-row">
                      <div class="card-header-text">
                        <span class="card-title">{{ pattern.name }}</span>
                        <span class="card-subtitle">{{
                          pattern.category
                        }}</span>
                      </div>
                      <div class="card-icon card-icon--frontend">
                        <mat-icon>code</mat-icon>
                      </div>
                    </div>
                    <mat-card-content>
                      <p>{{ pattern.description }}</p>
                      <div class="command-box">
                        <code>{{ pattern.command }}</code>
                      </div>
                    </mat-card-content>
                    <mat-card-actions>
                      <button mat-flat-button color="primary">
                        <mat-icon>play_arrow</mat-icon>
                        Get Pattern
                      </button>
                    </mat-card-actions>
                  </mat-card>
                }
              </div>
            </div>
          </mat-tab>

          <!-- Database Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>database</mat-icon>
              <span>Database (2)</span>
            </ng-template>
            <div class="tab-content">
              <div class="patterns-list">
                @for (
                  pattern of getPatternsByCategory('database');
                  track pattern.name
                ) {
                  <mat-card appearance="outlined" class="integration-card">
                    <div class="card-header-row">
                      <div class="card-header-text">
                        <span class="card-title">{{ pattern.name }}</span>
                        <span class="card-subtitle">{{
                          pattern.category
                        }}</span>
                      </div>
                      <div class="card-icon card-icon--database">
                        <mat-icon>code</mat-icon>
                      </div>
                    </div>
                    <mat-card-content>
                      <p>{{ pattern.description }}</p>
                      <div class="command-box">
                        <code>{{ pattern.command }}</code>
                      </div>
                    </mat-card-content>
                    <mat-card-actions>
                      <button mat-flat-button color="primary">
                        <mat-icon>play_arrow</mat-icon>
                        Get Pattern
                      </button>
                    </mat-card-actions>
                  </mat-card>
                }
              </div>
            </div>
          </mat-tab>

          <!-- Testing Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>science</mat-icon>
              <span>Testing (1)</span>
            </ng-template>
            <div class="tab-content">
              <div class="patterns-list">
                @for (
                  pattern of getPatternsByCategory('testing');
                  track pattern.name
                ) {
                  <mat-card appearance="outlined" class="integration-card">
                    <div class="card-header-row">
                      <div class="card-header-text">
                        <span class="card-title">{{ pattern.name }}</span>
                        <span class="card-subtitle">{{
                          pattern.category
                        }}</span>
                      </div>
                      <div class="card-icon card-icon--testing">
                        <mat-icon>code</mat-icon>
                      </div>
                    </div>
                    <mat-card-content>
                      <p>{{ pattern.description }}</p>
                      <div class="command-box">
                        <code>{{ pattern.command }}</code>
                      </div>
                    </mat-card-content>
                    <mat-card-actions>
                      <button mat-flat-button color="primary">
                        <mat-icon>play_arrow</mat-icon>
                        Get Pattern
                      </button>
                    </mat-card-actions>
                  </mat-card>
                }
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </section>

      <!-- Usage Examples -->
      <section class="section">
        <h2>Usage Examples</h2>

        <mat-expansion-panel class="example-panel" [expanded]="true">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>code</mat-icon>
              Get Pattern with Code Example
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="example-content">
            <ax-live-preview variant="bordered" direction="column">
              <div class="code-section">
                <div class="code-header">Command</div>
                <pre><code>{{ getPatternExample }}</code></pre>
              </div>
              <div class="result-section">
                <div class="result-header">Result (Abbreviated)</div>
                <pre
                  class="result-text"
                ><code>{{ getPatternResult }}</code></pre>
              </div>
            </ax-live-preview>
          </div>
        </mat-expansion-panel>

        <mat-expansion-panel class="example-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>lightbulb</mat-icon>
              Get Suggestions for Task
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="example-content">
            <ax-live-preview variant="bordered" direction="column">
              <div class="code-section">
                <div class="code-header">Command</div>
                <pre><code>{{ suggestExample }}</code></pre>
              </div>
              <div class="result-section">
                <div class="result-header">Result</div>
                <pre class="result-text"><code>{{ suggestResult }}</code></pre>
              </div>
            </ax-live-preview>
          </div>
        </mat-expansion-panel>

        <mat-expansion-panel class="example-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>search</mat-icon>
              Search Patterns
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

      <!-- Best Practices -->
      <section class="section">
        <h2>Why Use Patterns?</h2>
        <ax-live-preview variant="bordered" direction="column">
          <div class="benefits-grid">
            <div class="benefit-card">
              <mat-icon>lightbulb</mat-icon>
              <h4>ใช้ Suggest ก่อน</h4>
              <p>
                เมื่อไม่แน่ใจว่าจะใช้ pattern อะไร ให้ใช้
                <code>aegisx_patterns_suggest</code> พร้อมบอก task ที่ต้องการทำ
              </p>
            </div>
            <div class="benefit-card">
              <mat-icon>content_copy</mat-icon>
              <h4>Copy & Customize</h4>
              <p>
                Code examples พร้อมใช้งาน สามารถ copy ไปปรับแต่งตาม requirements
              </p>
            </div>
            <div class="benefit-card">
              <mat-icon>school</mat-icon>
              <h4>Learn Best Practices</h4>
              <p>
                Patterns มาพร้อม best practices และ anti-patterns
                ที่ควรหลีกเลี่ยง
              </p>
            </div>
            <div class="benefit-card">
              <mat-icon>link</mat-icon>
              <h4>ใช้ร่วมกับ Components</h4>
              <p>
                Combine patterns กับ <code>aegisx_components_get</code> เพื่อ
                implementation ที่สมบูรณ์
              </p>
            </div>
          </div>
        </ax-live-preview>
      </section>

      <!-- Common Use Cases -->
      <section class="section">
        <h2>Common Use Cases</h2>

        <div class="category">
          <div class="category-header">
            <mat-icon>build</mat-icon>
            <h3>Recommended Pattern Combinations</h3>
          </div>
          <p class="category-desc">
            Patterns ที่แนะนำสำหรับ use cases ที่พบบ่อย
          </p>

          <div class="integrations-grid">
            <mat-card appearance="outlined" class="integration-card">
              <div class="card-header-row">
                <div class="card-header-text">
                  <span class="card-title">REST API Endpoint</span>
                  <span class="card-subtitle">Backend patterns</span>
                </div>
                <div class="card-icon card-icon--backend">
                  <mat-icon>api</mat-icon>
                </div>
              </div>
              <mat-card-content>
                <p>Patterns ที่แนะนำ:</p>
                <ol>
                  <li><code>TypeBox Schema Definition</code></li>
                  <li><code>Fastify Route Definition</code></li>
                  <li><code>Service Layer Pattern</code></li>
                </ol>
              </mat-card-content>
              <mat-card-actions>
                <button mat-flat-button color="primary">
                  <mat-icon>play_arrow</mat-icon>
                  Get Patterns
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card appearance="outlined" class="integration-card">
              <div class="card-header-row">
                <div class="card-header-text">
                  <span class="card-title">Angular Component</span>
                  <span class="card-subtitle">Frontend patterns</span>
                </div>
                <div class="card-icon card-icon--frontend">
                  <mat-icon>web</mat-icon>
                </div>
              </div>
              <mat-card-content>
                <p>Patterns ที่แนะนำ:</p>
                <ol>
                  <li><code>Angular Signal-based Component</code></li>
                  <li><code>Angular HTTP Service</code></li>
                  <li><code>AegisX UI Integration</code></li>
                </ol>
              </mat-card-content>
              <mat-card-actions>
                <button mat-flat-button color="primary">
                  <mat-icon>play_arrow</mat-icon>
                  Get Patterns
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card appearance="outlined" class="integration-card">
              <div class="card-header-row">
                <div class="card-header-text">
                  <span class="card-title">Database Table</span>
                  <span class="card-subtitle">Database patterns</span>
                </div>
                <div class="card-icon card-icon--database">
                  <mat-icon>storage</mat-icon>
                </div>
              </div>
              <mat-card-content>
                <p>Patterns ที่แนะนำ:</p>
                <ol>
                  <li><code>Knex Migration</code></li>
                  <li><code>Repository with UUID Validation</code></li>
                  <li><code>Knex Query Optimization</code></li>
                </ol>
              </mat-card-content>
              <mat-card-actions>
                <button mat-flat-button color="primary">
                  <mat-icon>play_arrow</mat-icon>
                  Get Patterns
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card appearance="outlined" class="integration-card">
              <div class="card-header-row">
                <div class="card-header-text">
                  <span class="card-title">Auth Protection</span>
                  <span class="card-subtitle">Security patterns</span>
                </div>
                <div class="card-icon card-icon--backend">
                  <mat-icon>lock</mat-icon>
                </div>
              </div>
              <mat-card-content>
                <p>Patterns ที่แนะนำ:</p>
                <ol>
                  <li><code>Auth Middleware Pattern</code></li>
                  <li><code>Fastify Route Definition</code></li>
                </ol>
              </mat-card-content>
              <mat-card-actions>
                <button mat-flat-button color="primary">
                  <mat-icon>play_arrow</mat-icon>
                  Get Patterns
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>
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
          <a routerLink="/docs/mcp/components" class="quick-link">
            <mat-icon>widgets</mat-icon>
            <span>MCP Components</span>
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
      .mcp-patterns {
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

        &.selected {
          border-color: var(--ax-primary-default);
          box-shadow: var(--ax-shadow-md);
        }

        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          gap: 16px;
        }

        .card-header-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-title {
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--ax-text-heading);
        }

        .card-subtitle {
          font-size: 0.875rem;
          color: var(--ax-text-secondary);
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
          &--suggest {
            background: linear-gradient(
              135deg,
              rgba(236, 72, 153, 0.15),
              rgba(219, 39, 119, 0.15)
            );
            mat-icon {
              color: #ec4899;
            }
          }
          &--backend {
            background: linear-gradient(
              135deg,
              rgba(99, 102, 241, 0.15),
              rgba(139, 92, 246, 0.15)
            );
            mat-icon {
              color: #6366f1;
            }
          }
          &--frontend {
            background: linear-gradient(
              135deg,
              rgba(16, 185, 129, 0.15),
              rgba(5, 150, 105, 0.15)
            );
            mat-icon {
              color: #10b981;
            }
          }
          &--database {
            background: linear-gradient(
              135deg,
              rgba(245, 158, 11, 0.15),
              rgba(217, 119, 6, 0.15)
            );
            mat-icon {
              color: #f59e0b;
            }
          }
          &--testing {
            background: linear-gradient(
              135deg,
              rgba(236, 72, 153, 0.15),
              rgba(219, 39, 119, 0.15)
            );
            mat-icon {
              color: #ec4899;
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

          ol {
            margin: 0;
            padding-left: 1.25rem;

            li {
              margin-bottom: 0.5rem;
              font-size: 0.8125rem;
              color: var(--ax-text-secondary);

              code {
                font-family: 'SF Mono', 'Fira Code', monospace;
                font-size: 0.75rem;
                color: var(--ax-primary-default);
                background: var(--ax-primary-faint);
                padding: 0.125rem 0.375rem;
                border-radius: 4px;
              }
            }
          }

          .command-box {
            background: var(--ax-background-subtle);
            border: 1px solid var(--ax-border-muted);
            padding: 0.75rem 1rem;
            border-radius: var(--ax-radius-md);

            code {
              font-family: 'SF Mono', 'Fira Code', monospace;
              font-size: 0.8125rem;
              color: var(--ax-text-heading);
            }
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
        }
      }

      .tab-content {
        padding: 1.5rem 0;
      }

      .patterns-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 1rem;
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
          background: var(--ax-background-subtle);
          border: 1px solid var(--ax-border-muted);
          border-radius: var(--ax-radius-md);
          padding: 1rem;
          margin: 0;
          overflow-x: auto;

          code {
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 0.8125rem;
            color: var(--ax-text-heading);
            white-space: pre-wrap;
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
    `,
  ],
})
export class McpPatternsComponent {
  selectedCategory = signal<string>('');

  categories: PatternCategory[] = [
    {
      id: 'backend',
      name: 'Backend',
      icon: 'storage',
      color: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      count: 5,
    },
    {
      id: 'frontend',
      name: 'Frontend',
      icon: 'web',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      count: 3,
    },
    {
      id: 'database',
      name: 'Database',
      icon: 'database',
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      count: 2,
    },
    {
      id: 'testing',
      name: 'Testing',
      icon: 'science',
      color: 'linear-gradient(135deg, #ec4899, #db2777)',
      count: 1,
    },
  ];

  patterns: Pattern[] = [
    // Backend
    {
      name: 'TypeBox Schema Definition',
      category: 'backend',
      description: 'Define TypeBox schemas for request/response validation',
      command: 'aegisx_patterns_get "TypeBox Schema Definition"',
    },
    {
      name: 'Fastify Route Definition',
      category: 'backend',
      description: 'Define type-safe Fastify routes with schemas',
      command: 'aegisx_patterns_get "Fastify Route Definition"',
    },
    {
      name: 'Auth Middleware Pattern',
      category: 'backend',
      description: 'Correct auth middleware using reply (not throw)',
      command: 'aegisx_patterns_get "Auth Middleware Pattern"',
    },
    {
      name: 'Repository with UUID Validation',
      category: 'backend',
      description: 'BaseRepository pattern with automatic UUID validation',
      command: 'aegisx_patterns_get "Repository with UUID Validation"',
    },
    {
      name: 'Service Layer Pattern',
      category: 'backend',
      description: 'Service layer with repository integration',
      command: 'aegisx_patterns_get "Service Layer Pattern"',
    },
    // Frontend
    {
      name: 'Angular Signal-based Component',
      category: 'frontend',
      description: 'Modern Angular component using Signals',
      command: 'aegisx_patterns_get "Angular Signal-based Component"',
    },
    {
      name: 'Angular HTTP Service',
      category: 'frontend',
      description: 'HTTP service with proper typing and error handling',
      command: 'aegisx_patterns_get "Angular HTTP Service"',
    },
    {
      name: 'AegisX UI Integration',
      category: 'frontend',
      description: 'Integrating AegisX UI components in Angular',
      command: 'aegisx_patterns_get "AegisX UI Integration"',
    },
    // Database
    {
      name: 'Knex Migration',
      category: 'database',
      description: 'Database migration with proper types and constraints',
      command: 'aegisx_patterns_get "Knex Migration"',
    },
    {
      name: 'Knex Query Optimization',
      category: 'database',
      description: 'Optimized Knex queries with pagination and filtering',
      command: 'aegisx_patterns_get "Knex Query Optimization"',
    },
    // Testing
    {
      name: 'API Integration Test',
      category: 'testing',
      description: 'Integration test for Fastify routes',
      command: 'aegisx_patterns_get "API Integration Test"',
    },
  ];

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }

  getPatternsByCategory(category: string): Pattern[] {
    return this.patterns.filter((p) => p.category === category);
  }

  // Example code blocks
  getPatternExample = `aegisx_patterns_get "Angular Signal-based Component"`;

  getPatternResult = `# Angular Signal-based Component

**Category:** frontend

## Description
Modern Angular component using Signals for reactive state management.

## Code Example
\`\`\`typescript
import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="counter">
      <h2>Count: {{ count() }}</h2>
      <p>Double: {{ double() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  \`
})
export class CounterComponent {
  // Writable signal for state
  count = signal(0);

  // Computed signal for derived state
  double = computed(() => this.count() * 2);

  constructor() {
    // Effect for side effects
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }

  increment(): void {
    this.count.update(c => c + 1);
  }
}
\`\`\`

## Best Practices
- Use \`signal()\` for mutable state
- Use \`computed()\` for derived values
- Use \`effect()\` for side effects
...`;

  suggestExample = `aegisx_patterns_suggest "create API endpoint"`;

  suggestResult = `# Pattern Suggestions for: "create API endpoint"

## Recommended Patterns (in order):

### 1. TypeBox Schema Definition
Define request/response schemas first for type safety and validation.
Command: \`aegisx_patterns_get "TypeBox Schema Definition"\`

### 2. Fastify Route Definition
Create the route with proper typing and schema validation.
Command: \`aegisx_patterns_get "Fastify Route Definition"\`

### 3. Service Layer Pattern
Implement business logic in a service layer.
Command: \`aegisx_patterns_get "Service Layer Pattern"\`

### 4. Repository with UUID Validation
For database operations with UUID handling.
Command: \`aegisx_patterns_get "Repository with UUID Validation"\`

## Workflow:
1. Define TypeBox schemas
2. Create route with schemas
3. Implement service layer
4. Add repository if needed
5. Write integration tests`;

  searchExample = `aegisx_patterns_search "auth"`;

  searchResult = `# Search Results for "auth" (1 match)

## Auth Middleware Pattern
**Category:** backend

Correct auth middleware implementation using reply instead of throw.

**Command:**
\`\`\`
aegisx_patterns_get "Auth Middleware Pattern"
\`\`\`

**Key Points:**
- NEVER throw errors in preValidation hooks
- ALWAYS return reply.unauthorized() or reply.forbidden()
- Prevents request timeouts in Fastify`;
}
