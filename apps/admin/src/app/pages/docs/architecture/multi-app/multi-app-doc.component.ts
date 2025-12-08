import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DocHeaderComponent } from '../../../../components/docs/doc-header/doc-header.component';
import { CodeTabsComponent } from '../../../../components/docs/code-tabs/code-tabs.component';
import { PropsTableComponent } from '../../../../components/props-table/props-table.component';
import { CodeTab } from '../../../../types/docs.types';

@Component({
  selector: 'ax-multi-app-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    DocHeaderComponent,
    CodeTabsComponent,
    PropsTableComponent,
  ],
  template: `
    <article class="docs-article">
      <!-- Header -->
      <ax-doc-header
        title="Multi-App Architecture"
        description="A flexible configuration-driven architecture for building enterprise applications with multiple sub-apps, dynamic navigation, and app-specific theming. Powered by MultiAppService for centralized state management."
        category="Architecture"
      />

      <!-- Overview -->
      <section class="doc-section">
        <h2 class="section-title">Overview</h2>
        <p class="prose">
          Multi-App Architecture เป็นรูปแบบการออกแบบที่ช่วยให้สามารถสร้าง
          enterprise applications ขนาดใหญ่ที่มีหลาย modules/sub-apps
          ในโปรเจกต์เดียว โดยแต่ละ sub-app มี navigation, theme และ
          configuration เป็นของตัวเอง โดยใช้
          <strong>MultiAppService</strong> เป็นศูนย์กลางในการจัดการ state
          ทั้งหมด
        </p>

        <div class="feature-grid">
          <div class="feature-item">
            <mat-icon class="feature-icon">hub</mat-icon>
            <h4>Centralized State</h4>
            <p>
              MultiAppService จัดการ app registry, active context, navigation
              ทั้งหมด
            </p>
          </div>
          <div class="feature-item">
            <mat-icon class="feature-icon">settings</mat-icon>
            <h4>Configuration-Driven</h4>
            <p>กำหนดโครงสร้าง app ผ่าน config file ง่ายต่อการจัดการ</p>
          </div>
          <div class="feature-item">
            <mat-icon class="feature-icon">palette</mat-icon>
            <h4>App-Specific Themes</h4>
            <p>แต่ละ app มี theme ของตัวเองจาก Enterprise Layout presets</p>
          </div>
          <div class="feature-item">
            <mat-icon class="feature-icon">menu</mat-icon>
            <h4>Dynamic Navigation</h4>
            <p>Navigation เปลี่ยนตาม route อัตโนมัติผ่าน computed signals</p>
          </div>
        </div>
      </section>

      <!-- MultiAppService Overview -->
      <section class="doc-section">
        <h2 class="section-title">MultiAppService</h2>
        <p class="prose">
          <code>MultiAppService</code> เป็น Angular service ที่ providedIn:
          'root' ทำหน้าที่เป็นศูนย์กลางในการจัดการ multi-app architecture
          โดยมีความสามารถหลักดังนี้:
        </p>

        <div class="principle-grid">
          <div class="principle-item">
            <div class="principle-number">1</div>
            <div class="principle-content">
              <h4>App Registration</h4>
              <p>
                Shell components register apps กับ service ตอน ngOnInit ทำให้
                service รู้จัก apps ทั้งหมดในระบบ
              </p>
            </div>
          </div>
          <div class="principle-item">
            <div class="principle-number">2</div>
            <div class="principle-content">
              <h4>Route-Based Context</h4>
              <p>
                Service subscribe กับ Router events และอัปเดต active app/sub-app
                โดยอัตโนมัติตาม URL ปัจจุบัน
              </p>
            </div>
          </div>
          <div class="principle-item">
            <div class="principle-number">3</div>
            <div class="principle-content">
              <h4>Computed Signals</h4>
              <p>
                ใช้ Angular Signals สำหรับ reactive state management เช่น
                currentNavigation(), activeApp(), activeContext()
              </p>
            </div>
          </div>
          <div class="principle-item">
            <div class="principle-number">4</div>
            <div class="principle-content">
              <h4>Launcher Integration</h4>
              <p>
                Convert AppConfig เป็น LauncherApp format สำหรับใช้กับ Portal
                และ ax-launcher component
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Architecture Diagram -->
      <section class="doc-section">
        <h2 class="section-title">Architecture Diagram</h2>
        <div class="architecture-diagram">
          <!-- Top Level -->
          <div class="diagram-row">
            <div class="diagram-box service">
              <span class="box-label">MultiAppService</span>
              <span class="box-detail">Central State Management</span>
            </div>
          </div>
          <div class="diagram-arrow-row">
            <div class="arrow-group">
              <mat-icon>south_west</mat-icon>
              <span>registerApp()</span>
            </div>
            <div class="arrow-group center">
              <mat-icon>arrow_downward</mat-icon>
              <span>currentNavigation()</span>
            </div>
            <div class="arrow-group">
              <mat-icon>south_east</mat-icon>
              <span>getAppsAsLauncherFormat()</span>
            </div>
          </div>
          <!-- Middle Level -->
          <div class="diagram-row multi">
            <div class="diagram-box shell">
              <span class="box-label">System Shell</span>
              <span class="box-detail">registerApp(config, 0)</span>
            </div>
            <div class="diagram-box shell">
              <span class="box-label">Inventory Shell</span>
              <span class="box-detail">registerApp(config, 1)</span>
            </div>
            <div class="diagram-box portal">
              <span class="box-label">Portal Page</span>
              <span class="box-detail">getAppsAsLauncherFormat()</span>
            </div>
          </div>
          <div class="diagram-arrow">
            <mat-icon>arrow_downward</mat-icon>
          </div>
          <!-- Bottom Level -->
          <div class="diagram-row multi">
            <div class="diagram-box layout">
              <span class="box-label">Enterprise Layout</span>
              <span class="box-detail">[navigation]="currentNavigation()"</span>
            </div>
            <div class="diagram-box launcher">
              <span class="box-label">ax-launcher</span>
              <span class="box-detail">[apps]="registeredApps()"</span>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="doc-section">
        <h2 class="section-title">How It Works</h2>

        <h3 class="subsection-title">1. App Registration Flow</h3>
        <p class="prose">
          เมื่อ user navigate ไปยัง route ของ app (เช่น /system หรือ /inventory)
          Angular Router จะ load Shell component ซึ่งจะ register app กับ
          MultiAppService
        </p>
        <ax-code-tabs [tabs]="registrationFlowCode" />

        <h3 class="subsection-title">2. Route-Based Context Update</h3>
        <p class="prose">
          MultiAppService subscribe กับ Router events และเมื่อ URL เปลี่ยน
          service จะ match URL กับ registered apps เพื่ออัปเดต active context
        </p>
        <ax-code-tabs [tabs]="contextUpdateCode" />

        <h3 class="subsection-title">3. Reactive Navigation Updates</h3>
        <p class="prose">
          Shell components ใช้ computed signals จาก MultiAppService เพื่อแสดง
          navigation ที่ถูกต้องตาม active sub-app
        </p>
        <ax-code-tabs [tabs]="reactiveNavigationCode" />
      </section>

      <!-- Core Concepts -->
      <section class="doc-section">
        <h2 class="section-title">Core Interfaces</h2>

        <h3 class="subsection-title">AppConfig Interface</h3>
        <p class="prose">
          กำหนดโครงสร้างหลักของแต่ละ Feature App รวมถึง sub-apps, theme, และ
          global settings
        </p>
        <ax-code-tabs [tabs]="appConfigCode" />

        <h3 class="subsection-title">SubAppConfig Interface</h3>
        <p class="prose">กำหนดโครงสร้างของแต่ละ sub-app ภายใน Feature App</p>
        <ax-code-tabs [tabs]="subAppConfigCode" />

        <h3 class="subsection-title">HeaderAction Interface</h3>
        <p class="prose">กำหนด action buttons ที่ header ของ app</p>
        <ax-code-tabs [tabs]="headerActionCode" />
      </section>

      <!-- MultiAppService API -->
      <section class="doc-section">
        <h2 class="section-title">MultiAppService API</h2>

        <h3 class="subsection-title">Signals (Reactive State)</h3>
        <ax-props-table [properties]="serviceSignalsProps" />

        <h3 class="subsection-title">Methods</h3>
        <ax-props-table [properties]="serviceMethodsProps" />
      </section>

      <!-- Implementation Guide -->
      <section class="doc-section">
        <h2 class="section-title">Implementation Guide</h2>

        <h3 class="subsection-title">Step 1: Create App Configuration</h3>
        <ax-code-tabs [tabs]="configImplementationCode" />

        <h3 class="subsection-title">Step 2: Create Shell Component</h3>
        <ax-code-tabs [tabs]="shellComponentCode" />

        <h3 class="subsection-title">
          Step 3: Integrate Portal with MultiAppService
        </h3>
        <ax-code-tabs [tabs]="portalIntegrationCode" />
      </section>

      <!-- Theme Integration -->
      <section class="doc-section">
        <h2 class="section-title">Theme Integration</h2>
        <p class="prose">
          แต่ละ app สามารถกำหนด theme ได้ใน AppConfig โดย Shell component จะใช้
          theme นี้กับ Enterprise Layout ทำให้แต่ละ app มี look & feel
          ที่แตกต่างกัน
        </p>
        <ax-code-tabs [tabs]="themeIntegrationCode" />

        <div class="theme-showcase">
          <div class="theme-item">
            <div class="theme-preview default"></div>
            <span>default</span>
          </div>
          <div class="theme-item">
            <div class="theme-preview inventory"></div>
            <span>inventory</span>
          </div>
          <div class="theme-item">
            <div class="theme-preview medical"></div>
            <span>medical</span>
          </div>
          <div class="theme-item">
            <div class="theme-preview finance"></div>
            <span>finance</span>
          </div>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="doc-section">
        <h2 class="section-title">Use Cases</h2>
        <div class="use-case-grid">
          <div class="use-case-item">
            <mat-icon class="use-case-icon">inventory_2</mat-icon>
            <h4>Inventory Management</h4>
            <p>Dashboard, Warehouse, Receiving, Shipping sub-apps</p>
            <span class="theme-badge inventory">inventory theme</span>
          </div>
          <div class="use-case-item">
            <mat-icon class="use-case-icon">admin_panel_settings</mat-icon>
            <h4>System Administration</h4>
            <p>Users, RBAC, Settings, Monitoring, Tools sub-apps</p>
            <span class="theme-badge default">default theme</span>
          </div>
          <div class="use-case-item">
            <mat-icon class="use-case-icon">local_hospital</mat-icon>
            <h4>Hospital Information System</h4>
            <p>Patients, Appointments, Pharmacy, Lab sub-apps</p>
            <span class="theme-badge medical">medical theme</span>
          </div>
          <div class="use-case-item">
            <mat-icon class="use-case-icon">account_balance</mat-icon>
            <h4>ERP / Finance</h4>
            <p>Accounting, Invoicing, Reports, Settings sub-apps</p>
            <span class="theme-badge finance">finance theme</span>
          </div>
        </div>
      </section>

      <!-- Best Practices -->
      <section class="doc-section">
        <h2 class="section-title">Best Practices</h2>
        <div class="usage-comparison">
          <div class="usage-column do">
            <h4><mat-icon>check_circle</mat-icon> Do:</h4>
            <ul>
              <li>Register app in Shell's ngOnInit()</li>
              <li>Use computed signals for navigation</li>
              <li>Use theme from AppConfig, not hardcoded</li>
              <li>Keep shell component simple - only layout logic</li>
              <li>Use MultiAppService's currentNavigation()</li>
              <li>Define permissions per sub-app for RBAC</li>
            </ul>
          </div>
          <div class="usage-column dont">
            <h4><mat-icon>cancel</mat-icon> Don't:</h4>
            <ul>
              <li>Don't duplicate route tracking logic in shells</li>
              <li>Don't hardcode navigation in shell templates</li>
              <li>Don't create separate Nx apps for each sub-app</li>
              <li>Don't mix business logic in shell component</li>
              <li>Don't hardcode theme - use config.theme</li>
              <li>Don't ignore Angular Signals for reactivity</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Related -->
      <section class="doc-section">
        <h2 class="section-title">Related Documentation</h2>
        <div class="related-links">
          <a
            mat-stroked-button
            routerLink="/docs/components/aegisx/layout/enterprise"
          >
            <mat-icon>web</mat-icon>
            Enterprise Layout
          </a>
          <a mat-stroked-button routerLink="/docs/architecture/shell-pattern">
            <mat-icon>layers</mat-icon>
            Shell Pattern & Routing
          </a>
          <a mat-stroked-button routerLink="/inventory-demo">
            <mat-icon>inventory_2</mat-icon>
            Inventory Demo
          </a>
        </div>
      </section>
    </article>
  `,
  styles: [
    `
      /* Article Layout - Prose Style */
      .docs-article {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem 1.5rem;
      }

      .doc-section {
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--ax-border-default);

        &:last-child {
          border-bottom: none;
        }
      }

      .section-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--ax-text-heading);
        margin: 0 0 1rem 0;
        line-height: 1.3;
      }

      .subsection-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 2rem 0 0.75rem 0;
        line-height: 1.4;
      }

      .prose {
        font-size: 1rem;
        line-height: 1.75;
        color: var(--ax-text-secondary);
        margin-bottom: 1.5rem;
      }

      /* Feature Grid */
      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
      }

      .feature-item {
        padding: 1.25rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg);
        border: 1px solid var(--ax-border-default);

        h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0.75rem 0 0.5rem 0;
        }

        p {
          font-size: 0.875rem;
          color: var(--ax-text-secondary);
          margin: 0;
          line-height: 1.5;
        }
      }

      .feature-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        color: var(--ax-brand-default);
      }

      /* Principle Grid */
      .principle-grid {
        display: grid;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .principle-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg);
        border: 1px solid var(--ax-border-default);
      }

      .principle-number {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--ax-brand-default);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        flex-shrink: 0;
      }

      .principle-content {
        h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 0.25rem 0;
        }

        p {
          font-size: 0.875rem;
          color: var(--ax-text-secondary);
          margin: 0;
          line-height: 1.5;
        }
      }

      /* Architecture Diagram */
      .architecture-diagram {
        padding: 2rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
      }

      .diagram-row {
        display: flex;
        gap: 1rem;
        justify-content: center;
        width: 100%;

        &.multi {
          flex-wrap: wrap;
        }
      }

      .diagram-arrow-row {
        display: flex;
        justify-content: space-around;
        width: 100%;
        padding: 0.5rem 0;
      }

      .arrow-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        color: var(--ax-text-subtle);

        span {
          font-size: 0.7rem;
          font-family: monospace;
        }

        &.center {
          color: var(--ax-brand-default);
        }
      }

      .diagram-box {
        padding: 1rem 1.5rem;
        border-radius: var(--ax-radius-md);
        text-align: center;
        min-width: 140px;

        .box-label {
          display: block;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .box-detail {
          display: block;
          font-size: 0.7rem;
          opacity: 0.8;
          margin-top: 0.25rem;
          font-family: monospace;
        }
      }

      .diagram-box.service {
        background: var(--ax-brand-default);
        color: white;
        min-width: 200px;
      }

      .diagram-box.shell {
        background: var(--ax-warning-default);
        color: var(--ax-text-heading);
      }

      .diagram-box.portal {
        background: var(--ax-info-default);
        color: white;
      }

      .diagram-box.layout {
        background: var(--ax-success-default);
        color: white;
      }

      .diagram-box.launcher {
        background: #8b5cf6;
        color: white;
      }

      .diagram-arrow {
        color: var(--ax-text-subtle);
      }

      /* Theme Showcase */
      .theme-showcase {
        display: flex;
        gap: 1.5rem;
        margin-top: 1rem;
        flex-wrap: wrap;
      }

      .theme-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;

        span {
          font-size: 0.875rem;
          color: var(--ax-text-secondary);
        }
      }

      .theme-preview {
        width: 80px;
        height: 48px;
        border-radius: var(--ax-radius-md);
        border: 1px solid var(--ax-border-default);

        &.default {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }
        &.inventory {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
        }
        &.medical {
          background: linear-gradient(135deg, #0891b2, #06b6d4);
        }
        &.finance {
          background: linear-gradient(135deg, #059669, #10b981);
        }
      }

      /* Use Case Grid */
      .use-case-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
      }

      .use-case-item {
        padding: 1.5rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-lg);
        border: 1px solid var(--ax-border-default);

        h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0.75rem 0 0.5rem 0;
        }

        p {
          font-size: 0.875rem;
          color: var(--ax-text-secondary);
          margin: 0 0 0.75rem 0;
        }
      }

      .use-case-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: var(--ax-brand-default);
      }

      .theme-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 500;

        &.inventory {
          background: #dbeafe;
          color: #1d4ed8;
        }

        &.default {
          background: #e0e7ff;
          color: #4338ca;
        }

        &.medical {
          background: #ecfeff;
          color: #0891b2;
        }

        &.finance {
          background: #d1fae5;
          color: #059669;
        }
      }

      /* Usage Comparison */
      .usage-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .usage-column {
        padding: 1.25rem;
        border-radius: var(--ax-radius-lg);

        h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            padding: 0.5rem 0;
            font-size: 0.9375rem;
            color: var(--ax-text-primary);
            border-bottom: 1px solid var(--ax-border-default);

            &:last-child {
              border-bottom: none;
            }
          }
        }

        &.do {
          background: var(--ax-success-faint);
          border: 1px solid var(--ax-success-200);

          h4 {
            color: var(--ax-success-700);

            mat-icon {
              color: var(--ax-success-default);
            }
          }
        }

        &.dont {
          background: var(--ax-error-faint);
          border: 1px solid var(--ax-error-200);

          h4 {
            color: var(--ax-error-700);

            mat-icon {
              color: var(--ax-error-default);
            }
          }
        }
      }

      /* Related Links */
      .related-links {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        a {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }

      code {
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-size: 0.875em;
        padding: 0.125rem 0.375rem;
        background-color: var(--ax-background-muted);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-sm);
        color: var(--ax-text-heading);
      }
    `,
  ],
})
export class MultiAppDocComponent {
  // Registration flow code
  registrationFlowCode: CodeTab[] = [
    {
      language: 'typescript' as const,
      label: 'Shell Registration',
      code: `// inventory-shell.component.ts
@Component({ ... })
export class InventoryShellComponent implements OnInit {
  private readonly multiAppService = inject(MultiAppService);
  readonly config = INVENTORY_APP_CONFIG;

  ngOnInit(): void {
    // Register this app with order=1 (second app)
    this.multiAppService.registerApp(this.config, 1, true);
  }
}

// system-shell.component.ts
@Component({ ... })
export class SystemShellComponent implements OnInit {
  private readonly multiAppService = inject(MultiAppService);
  readonly config = SYSTEM_APP_CONFIG;

  ngOnInit(): void {
    // Register this app with order=0 (first app)
    this.multiAppService.registerApp(this.config, 0, true);
  }
}`,
    },
  ];

  // Context update code
  contextUpdateCode: CodeTab[] = [
    {
      language: 'typescript' as const,
      label: 'MultiAppService (internal)',
      code: `// multi-app.service.ts - Route Tracking
@Injectable({ providedIn: 'root' })
export class MultiAppService {
  private readonly router = inject(Router);

  constructor() {
    // Subscribe to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateActiveContext((event as NavigationEnd).url);
      });
  }

  private updateActiveContext(url: string): void {
    const registry = this._registry();

    // Find matching app by baseRoute
    for (const [appId, entry] of registry) {
      if (!entry.enabled) continue;

      const app = entry.config;
      if (url.startsWith(app.baseRoute)) {
        this._activeAppId.set(appId);

        // Find matching sub-app by route
        const matchedSubApp = app.subApps.find(
          (subApp) => url.startsWith(subApp.route)
        );
        this._activeSubAppId.set(matchedSubApp?.id || null);
        return;
      }
    }

    // No match found
    this._activeAppId.set(null);
    this._activeSubAppId.set(null);
  }
}`,
    },
  ];

  // Reactive navigation code
  reactiveNavigationCode: CodeTab[] = [
    {
      language: 'typescript' as const,
      label: 'Shell Using Signals',
      code: `// inventory-shell.component.ts
@Component({
  template: \`
    <ax-enterprise-layout
      [navigation]="currentNavigation()"
      [appTheme]="appTheme"
    >
      <router-outlet></router-outlet>
    </ax-enterprise-layout>
  \`,
})
export class InventoryShellComponent {
  private readonly multiAppService = inject(MultiAppService);

  // Get navigation from MultiAppService (centralized)
  readonly currentNavigation = computed<AxNavigationItem[]>(() => {
    return this.multiAppService.currentNavigation();
  });

  // Theme from config
  readonly appTheme = this.config.theme as EnterprisePresetTheme;
}`,
    },
  ];

  // AppConfig interface code
  appConfigCode: CodeTab[] = [
    {
      language: 'typescript' as const,
      label: 'AppConfig Interface',
      code: `export interface AppConfig {
  id: string;                    // Unique identifier: 'system', 'inventory'
  name: string;                  // Display name: 'System Administration'
  description?: string;          // App description
  theme: string;                 // Theme preset: 'default', 'inventory'
  baseRoute: string;             // Base route: '/system', '/inventory'
  defaultRoute: string;          // Default redirect: '/system/dashboard'
  subApps: SubAppConfig[];       // List of sub-apps
  headerActions?: HeaderAction[]; // Global header actions
  showFooter?: boolean;          // Show footer
  footerContent?: string;        // Footer text
  roles?: string[];              // Required roles for access
  permissions?: string[];        // Required permissions
}`,
    },
  ];

  // SubAppConfig interface code
  subAppConfigCode: CodeTab[] = [
    {
      language: 'typescript' as const,
      label: 'SubAppConfig Interface',
      code: `export interface SubAppConfig {
  id: string;                        // Unique ID: 'dashboard', 'warehouse'
  name: string;                      // Display name (tab label)
  icon: string;                      // Material icon name
  route: string;                     // Route path: '/inventory/warehouse'
  navigation: AxNavigationItem[];    // Sidebar navigation items
  subNavigation?: AxNavigationItem[]; // Secondary navigation
  headerActions?: HeaderAction[];    // Sub-app specific actions
  roles?: string[];                  // Required roles
  permissions?: string[];            // Required permissions
  isDefault?: boolean;               // Is default sub-app
  description?: string;              // Sub-app description
}`,
    },
  ];

  // HeaderAction interface code
  headerActionCode: CodeTab[] = [
    {
      language: 'typescript' as const,
      label: 'HeaderAction Interface',
      code: `export interface HeaderAction {
  id: string;           // Unique identifier
  icon: string;         // Material icon name
  tooltip: string;      // Tooltip text
  action: string;       // Method name: 'onNotifications', 'onSettings'
  badge?: number;       // Badge count (optional)
  badgeColor?: string;  // Badge color (optional)
}`,
    },
  ];

  // Config implementation code
  configImplementationCode: CodeTab[] = [
    {
      language: 'typescript' as const,
      label: 'system.config.ts',
      code: `import { AxNavigationItem } from '@aegisx/ui';
import { AppConfig } from '../../shared/multi-app';

const systemNavigation: AxNavigationItem[] = [
  { id: 'dashboard', title: 'Dashboard', icon: 'dashboard', link: '/system' },
  {
    id: 'user-management',
    title: 'User Management',
    icon: 'people',
    type: 'collapsible',
    children: [
      { id: 'users', title: 'Users', icon: 'manage_accounts', link: '/system/users' },
      { id: 'profile', title: 'My Profile', icon: 'person', link: '/system/profile' },
    ],
  },
  // ... more navigation items
];

export const SYSTEM_APP_CONFIG: AppConfig = {
  id: 'system',
  name: 'System Administration',
  description: 'System administration and management',
  theme: 'default',  // Uses 'default' theme preset
  baseRoute: '/system',
  defaultRoute: '/system',
  showFooter: true,
  footerContent: 'AegisX Platform',

  headerActions: [
    { id: 'notifications', icon: 'notifications', tooltip: 'Notifications', badge: 3, action: 'onNotifications' },
    { id: 'settings', icon: 'settings', tooltip: 'Settings', action: 'onSettings' },
  ],

  // Single sub-app for flat navigation structure
  subApps: [
    {
      id: 'main',
      name: 'Administration',
      icon: 'admin_panel_settings',
      route: '/system',
      navigation: systemNavigation,
      isDefault: true,
      roles: ['admin'],
    },
  ],
};`,
    },
  ];

  // Shell component code
  shellComponentCode: CodeTab[] = [
    {
      language: 'typescript' as const,
      label: 'system-shell.component.ts',
      code: `import { Component, OnInit, inject, computed } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  AxEnterpriseLayoutComponent,
  AxNavigationItem,
  EnterprisePresetTheme,
} from '@aegisx/ui';
import { SYSTEM_APP_CONFIG } from './system.config';
import { MultiAppService, HeaderAction } from '../../shared/multi-app';

@Component({
  selector: 'app-system-shell',
  standalone: true,
  imports: [RouterOutlet, AxEnterpriseLayoutComponent, /* ... */],
  template: \`
    <ax-enterprise-layout
      [appName]="appName"
      [appTheme]="appTheme"
      [navigation]="currentNavigation()"
      [showFooter]="config.showFooter ?? true"
      (logoutClicked)="onLogout()"
    >
      <ng-template #headerActions>
        @for (action of appHeaderActions(); track action.id) {
          <button mat-icon-button [matTooltip]="action.tooltip" (click)="handleAction(action)">
            <mat-icon>{{ action.icon }}</mat-icon>
          </button>
        }
      </ng-template>

      <router-outlet></router-outlet>
    </ax-enterprise-layout>
  \`,
})
export class SystemShellComponent implements OnInit {
  private readonly multiAppService = inject(MultiAppService);

  readonly config = SYSTEM_APP_CONFIG;
  readonly appName = this.config.name;
  readonly appTheme = this.config.theme as EnterprisePresetTheme;

  // Get navigation from MultiAppService (centralized)
  readonly currentNavigation = computed<AxNavigationItem[]>(() => {
    return this.multiAppService.currentNavigation();
  });

  // Header actions from MultiAppService
  readonly appHeaderActions = computed<HeaderAction[]>(() => {
    return this.multiAppService.currentHeaderActions();
  });

  ngOnInit(): void {
    // Register this app with MultiAppService
    this.multiAppService.registerApp(this.config, 0, true);
  }

  handleAction(action: HeaderAction): void {
    // Handle action...
  }
}`,
    },
  ];

  // Portal integration code
  portalIntegrationCode: CodeTab[] = [
    {
      language: 'typescript' as const,
      label: 'portal.page.ts',
      code: `import { Component, inject, computed } from '@angular/core';
import { AxLauncherComponent, LauncherApp } from '@aegisx/ui';
import { MultiAppService } from '../../shared/multi-app';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [AxLauncherComponent],
  template: \`
    <ax-launcher
      [apps]="registeredApps()"
      [title]="'Applications'"
      [subtitle]="'Access your enterprise applications'"
      (appClick)="onAppClick($event)"
    />
  \`,
})
export class PortalPage {
  private readonly multiAppService = inject(MultiAppService);

  // Get registered apps in LauncherApp format
  readonly registeredApps = computed<LauncherApp[]>(() => {
    return this.multiAppService.getAppsAsLauncherFormat();
  });

  // Or with RBAC filtering:
  readonly filteredApps = computed<LauncherApp[]>(() => {
    const userRoles = ['admin'];
    const userPermissions = ['system.read'];
    return this.multiAppService.getAppsAsLauncherFormatFiltered(
      userRoles,
      userPermissions
    );
  });
}`,
    },
  ];

  // Theme integration code
  themeIntegrationCode: CodeTab[] = [
    {
      language: 'typescript' as const,
      label: 'Theme from Config',
      code: `// inventory.config.ts
export const INVENTORY_APP_CONFIG: AppConfig = {
  id: 'inventory',
  theme: 'inventory',  // Use 'inventory' preset
  // ...
};

// inventory-shell.component.ts
@Component({
  template: \`
    <ax-enterprise-layout
      [appTheme]="appTheme"  <!-- Uses theme from config -->
    >
  \`,
})
export class InventoryShellComponent {
  readonly config = INVENTORY_APP_CONFIG;

  // Theme is taken from config, not hardcoded!
  readonly appTheme = this.config.theme as EnterprisePresetTheme;
}`,
    },
  ];

  // API Reference Tables
  serviceSignalsProps = [
    {
      name: 'apps',
      type: 'Signal<AppConfig[]>',
      default: '[]',
      description: 'All enabled registered apps sorted by order',
    },
    {
      name: 'activeApp',
      type: 'Signal<AppConfig | null>',
      default: 'null',
      description: 'Currently active app based on URL',
    },
    {
      name: 'activeSubApp',
      type: 'Signal<SubAppConfig | null>',
      default: 'null',
      description: 'Currently active sub-app based on URL',
    },
    {
      name: 'currentNavigation',
      type: 'Signal<AxNavigationItem[]>',
      default: '[]',
      description: 'Navigation items for active sub-app',
    },
    {
      name: 'currentSubNavigation',
      type: 'Signal<AxNavigationItem[]>',
      default: '[]',
      description: 'Secondary navigation for active sub-app',
    },
    {
      name: 'currentHeaderActions',
      type: 'Signal<HeaderAction[]>',
      default: '[]',
      description: 'Combined header actions (global + sub-app)',
    },
    {
      name: 'activeContext',
      type: 'Signal<ActiveAppContext | null>',
      default: 'null',
      description: 'Full context including app, navigation, theme',
    },
  ];

  serviceMethodsProps = [
    {
      name: 'registerApp(config, order, enabled)',
      type: 'void',
      default: '-',
      description: 'Register an app configuration with service',
    },
    {
      name: 'unregisterApp(appId)',
      type: 'void',
      default: '-',
      description: 'Unregister an app by ID',
    },
    {
      name: 'setAppEnabled(appId, enabled)',
      type: 'void',
      default: '-',
      description: 'Enable or disable an app',
    },
    {
      name: 'getApp(appId)',
      type: 'AppConfig | null',
      default: '-',
      description: 'Get app config by ID',
    },
    {
      name: 'getSubApp(appId, subAppId)',
      type: 'SubAppConfig | null',
      default: '-',
      description: 'Get sub-app config',
    },
    {
      name: 'navigateToApp(appId)',
      type: 'void',
      default: '-',
      description: 'Navigate to app default route',
    },
    {
      name: 'getAppsForLauncher(roles, permissions)',
      type: 'AppConfig[]',
      default: '-',
      description: 'Get apps filtered by RBAC',
    },
    {
      name: 'getAppsAsLauncherFormat()',
      type: 'LauncherApp[]',
      default: '-',
      description: 'Get all apps in LauncherApp format',
    },
    {
      name: 'getAppsAsLauncherFormatFiltered(roles, perms)',
      type: 'LauncherApp[]',
      default: '-',
      description: 'Get filtered apps in LauncherApp format',
    },
    {
      name: 'convertToLauncherApp(app, order)',
      type: 'LauncherApp',
      default: '-',
      description: 'Convert AppConfig to LauncherApp format',
    },
  ];
}
