import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {
  AxSplashScreenComponent,
  SplashScreenService,
  SplashScreenStage,
} from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../../../components/docs';
import { ComponentToken, CodeTab } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-splash-screen-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    AxSplashScreenComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="splash-screen-doc">
      <ax-doc-header
        title="Splash Screen"
        icon="rocket_launch"
        description="Full-screen loading overlay for app initialization. Shows loading progress with stages, custom messages, and error handling."
        [breadcrumbs]="[
          { label: 'Feedback', link: '/docs/components/aegisx/feedback/alert' },
          { label: 'Splash Screen' },
        ]"
        status="stable"
        version="1.0.0"
        importStatement="import { AxSplashScreenComponent, SplashScreenService } from '&#64;aegisx/ui';"
      ></ax-doc-header>

      <mat-tab-group class="splash-screen-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="splash-screen-doc__tab-content">
            <section class="splash-screen-doc__section">
              <h2>Basic Usage</h2>
              <p>
                Splash Screen แสดง loading overlay เต็มหน้าจอเมื่อ app กำลัง
                initialize โดยสามารถแสดง progress และ stage ต่างๆ ได้
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button
                  mat-flat-button
                  color="primary"
                  (click)="showBasicDemo()"
                >
                  <mat-icon>play_arrow</mat-icon>
                  Show Basic Demo (3s)
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
            </section>

            <section class="splash-screen-doc__section">
              <h2>With Loading Stages</h2>
              <p>
                แสดง stage ของการโหลดแต่ละขั้นตอน เช่น Config, Auth, Data พร้อม
                progress bar แสดงความคืบหน้า
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button
                  mat-flat-button
                  color="primary"
                  (click)="showStagesDemo()"
                >
                  <mat-icon>layers</mat-icon>
                  Show Stages Demo
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="stagesCode"></ax-code-tabs>
            </section>

            <section class="splash-screen-doc__section">
              <h2>Custom Branding</h2>
              <p>
                ปรับแต่ง logo, ชื่อ app, tagline และ background ตาม brand ของคุณ
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <mat-form-field appearance="outline">
                  <mat-label>Animation Style</mat-label>
                  <mat-select [(ngModel)]="selectedAnimation">
                    <mat-option value="fade">Fade</mat-option>
                    <mat-option value="slide">Slide</mat-option>
                    <mat-option value="scale">Scale</mat-option>
                  </mat-select>
                </mat-form-field>
                <button
                  mat-flat-button
                  color="accent"
                  (click)="showBrandingDemo()"
                >
                  <mat-icon>palette</mat-icon>
                  Show Branded Demo
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="brandingCode"></ax-code-tabs>
            </section>

            <section class="splash-screen-doc__section">
              <h2>Error Handling</h2>
              <p>
                เมื่อเกิด error ระหว่างโหลด จะแสดง error message พร้อมปุ่ม Retry
              </p>

              <ax-live-preview
                variant="bordered"
                direction="row"
                gap="var(--ax-spacing-md)"
              >
                <button mat-flat-button color="warn" (click)="showErrorDemo()">
                  <mat-icon>error</mat-icon>
                  Show Error Demo
                </button>
              </ax-live-preview>

              <ax-code-tabs [tabs]="errorCode"></ax-code-tabs>
            </section>

            <section class="splash-screen-doc__section">
              <h2>APP_INITIALIZER Integration</h2>
              <p>
                ตัวอย่างการใช้งานจริงกับ Angular APP_INITIALIZER เพื่อแสดง
                splash screen ระหว่างโหลด app
              </p>

              <ax-code-tabs [tabs]="initializerCode"></ax-code-tabs>
            </section>

            <section class="splash-screen-doc__section">
              <h2>Standalone Mode</h2>
              <p>
                สามารถใช้แบบ standalone ได้โดยส่ง inputs โดยตรง แทนการใช้
                service
              </p>

              <ax-code-tabs [tabs]="standaloneCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="splash-screen-doc__tab-content">
            <section class="splash-screen-doc__section">
              <h2>Component Inputs</h2>
              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Input</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>visible</code></td>
                      <td>boolean</td>
                      <td>undefined</td>
                      <td>แสดง/ซ่อน splash screen (override service)</td>
                    </tr>
                    <tr>
                      <td><code>logo</code></td>
                      <td>string</td>
                      <td>undefined</td>
                      <td>URL ของ logo</td>
                    </tr>
                    <tr>
                      <td><code>appName</code></td>
                      <td>string</td>
                      <td>'Application'</td>
                      <td>ชื่อ application</td>
                    </tr>
                    <tr>
                      <td><code>version</code></td>
                      <td>string</td>
                      <td>undefined</td>
                      <td>เวอร์ชัน app</td>
                    </tr>
                    <tr>
                      <td><code>tagline</code></td>
                      <td>string</td>
                      <td>undefined</td>
                      <td>Tagline หรือ description</td>
                    </tr>
                    <tr>
                      <td><code>background</code></td>
                      <td>string</td>
                      <td>gradient</td>
                      <td>สี background หรือ gradient</td>
                    </tr>
                    <tr>
                      <td><code>stages</code></td>
                      <td>SplashScreenStage[]</td>
                      <td>[]</td>
                      <td>รายการ stages ที่จะแสดง</td>
                    </tr>
                    <tr>
                      <td><code>message</code></td>
                      <td>string</td>
                      <td>undefined</td>
                      <td>ข้อความที่กำลังแสดง</td>
                    </tr>
                    <tr>
                      <td><code>progress</code></td>
                      <td>number</td>
                      <td>undefined</td>
                      <td>ค่า progress (0-100)</td>
                    </tr>
                    <tr>
                      <td><code>error</code></td>
                      <td>string</td>
                      <td>undefined</td>
                      <td>ข้อความ error</td>
                    </tr>
                    <tr>
                      <td><code>showPercentage</code></td>
                      <td>boolean</td>
                      <td>true</td>
                      <td>แสดงเปอร์เซ็นต์</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="splash-screen-doc__section">
              <h2>Service Methods</h2>
              <div class="api-table">
                <table>
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Parameters</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>show(config?)</code></td>
                      <td>Partial&lt;SplashScreenConfig&gt;</td>
                      <td>แสดง splash screen พร้อม config</td>
                    </tr>
                    <tr>
                      <td><code>hide()</code></td>
                      <td>-</td>
                      <td>ซ่อน splash (รอ minDisplayTime)</td>
                    </tr>
                    <tr>
                      <td><code>forceHide()</code></td>
                      <td>-</td>
                      <td>ซ่อนทันที ไม่รอ minDisplayTime</td>
                    </tr>
                    <tr>
                      <td><code>setStages(stages)</code></td>
                      <td>SplashScreenStage[]</td>
                      <td>กำหนด stages ที่จะแสดง</td>
                    </tr>
                    <tr>
                      <td><code>startStage(id)</code></td>
                      <td>string</td>
                      <td>เริ่ม stage ที่ระบุ</td>
                    </tr>
                    <tr>
                      <td><code>completeStage(id)</code></td>
                      <td>string</td>
                      <td>Complete stage ที่ระบุ</td>
                    </tr>
                    <tr>
                      <td><code>errorStage(id, message?)</code></td>
                      <td>string, string</td>
                      <td>Mark stage เป็น error</td>
                    </tr>
                    <tr>
                      <td><code>runStages(handlers)</code></td>
                      <td>StageHandler[]</td>
                      <td>รัน stages ตามลำดับอัตโนมัติ</td>
                    </tr>
                    <tr>
                      <td><code>setMessage(msg)</code></td>
                      <td>string</td>
                      <td>กำหนดข้อความเอง</td>
                    </tr>
                    <tr>
                      <td><code>setError(error)</code></td>
                      <td>string</td>
                      <td>กำหนด error message</td>
                    </tr>
                    <tr>
                      <td><code>reset()</code></td>
                      <td>-</td>
                      <td>Reset state ทั้งหมด</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="splash-screen-doc__section">
              <h2>SplashScreenStage Interface</h2>
              <ax-code-tabs [tabs]="stageInterfaceCode"></ax-code-tabs>
            </section>

            <section class="splash-screen-doc__section">
              <h2>SplashScreenConfig Interface</h2>
              <ax-code-tabs [tabs]="configInterfaceCode"></ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Design Tokens Tab -->
        <mat-tab label="Design Tokens">
          <div class="splash-screen-doc__tab-content">
            <ax-component-tokens [tokens]="designTokens"></ax-component-tokens>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>

    <!-- Splash Screen for Demos -->
    <ax-splash-screen />
  `,
  styles: [
    `
      .splash-screen-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .splash-screen-doc__tabs {
        margin-top: 2rem;
      }

      .splash-screen-doc__tab-content {
        padding: 1.5rem 0;
      }

      .splash-screen-doc__section {
        margin-bottom: 3rem;

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin-bottom: 0.75rem;
        }

        p {
          color: var(--ax-text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.6;
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

          code {
            background: var(--ax-background-subtle);
            padding: 0.125rem 0.375rem;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
          }
        }
      }

      mat-form-field {
        width: 160px;
      }
    `,
  ],
})
export class SplashScreenDocComponent {
  private readonly splashService = inject(SplashScreenService);

  selectedAnimation: 'fade' | 'slide' | 'scale' = 'fade';

  // Demo methods
  showBasicDemo(): void {
    this.splashService.show({
      appName: 'AegisX Platform',
      tagline: 'Enterprise UI Framework',
      minDisplayTime: 1000,
    });

    // Auto hide after 3s
    setTimeout(() => {
      this.splashService.hide();
    }, 3000);
  }

  showStagesDemo(): void {
    const stages: SplashScreenStage[] = [
      {
        id: 'config',
        label: 'โหลดการตั้งค่า',
        icon: 'settings',
        status: 'pending',
      },
      { id: 'auth', label: 'ตรวจสอบสิทธิ์', icon: 'lock', status: 'pending' },
      {
        id: 'data',
        label: 'โหลดข้อมูล',
        icon: 'cloud_download',
        status: 'pending',
      },
      { id: 'ui', label: 'เตรียม UI', icon: 'dashboard', status: 'pending' },
    ];

    this.splashService.show({
      appName: 'AegisX Platform',
      version: '1.0.0',
    });
    this.splashService.setStages(stages);

    // Simulate loading stages
    this.splashService
      .runStages([
        { id: 'config', handler: () => this.delay(800) },
        { id: 'auth', handler: () => this.delay(600) },
        { id: 'data', handler: () => this.delay(1000) },
        { id: 'ui', handler: () => this.delay(500) },
      ])
      .then(() => {
        this.splashService.hide();
      });
  }

  showBrandingDemo(): void {
    this.splashService.show({
      appName: 'My Enterprise App',
      tagline: 'Building the future, today',
      version: '2.5.0',
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      animationStyle: this.selectedAnimation,
      minDisplayTime: 500,
    });

    setTimeout(() => {
      this.splashService.hide();
    }, 3000);
  }

  showErrorDemo(): void {
    const stages: SplashScreenStage[] = [
      {
        id: 'config',
        label: 'โหลดการตั้งค่า',
        icon: 'settings',
        status: 'pending',
      },
      { id: 'auth', label: 'ตรวจสอบสิทธิ์', icon: 'lock', status: 'pending' },
      {
        id: 'data',
        label: 'โหลดข้อมูล',
        icon: 'cloud_download',
        status: 'pending',
      },
    ];

    this.splashService.show({ appName: 'AegisX Platform' });
    this.splashService.setStages(stages);

    // Simulate error on auth stage
    this.splashService
      .runStages([
        { id: 'config', handler: () => this.delay(500) },
        {
          id: 'auth',
          handler: () =>
            Promise.reject(new Error('ไม่สามารถเชื่อมต่อ server ได้')),
        },
        { id: 'data', handler: () => this.delay(500) },
      ])
      .catch(() => {
        // Error handled by service, show for 5 seconds then hide
        setTimeout(() => {
          this.splashService.forceHide();
          this.splashService.reset();
        }, 5000);
      });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Code examples
  readonly basicUsageCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<!-- ใน app.component.html -->
<ax-splash-screen />
<router-outlet />`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { SplashScreenService } from '@aegisx/ui';

export class AppComponent {
  private splashService = inject(SplashScreenService);

  ngOnInit() {
    // แสดง splash screen
    this.splashService.show({
      appName: 'My App',
      tagline: 'Welcome to the future',
    });

    // ซ่อนหลังโหลดเสร็จ
    this.loadData().then(() => {
      this.splashService.hide();
    });
  }
}`,
    },
  ];

  readonly stagesCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `// กำหนด stages
const stages: SplashScreenStage[] = [
  { id: 'config', label: 'โหลดการตั้งค่า', icon: 'settings', status: 'pending' },
  { id: 'auth', label: 'ตรวจสอบสิทธิ์', icon: 'lock', status: 'pending' },
  { id: 'data', label: 'โหลดข้อมูล', icon: 'cloud_download', status: 'pending' },
  { id: 'ui', label: 'เตรียม UI', icon: 'dashboard', status: 'pending' },
];

// แสดง splash พร้อม stages
this.splashService.show({ appName: 'My App' });
this.splashService.setStages(stages);

// รัน stages อัตโนมัติ
const success = await this.splashService.runStages([
  { id: 'config', handler: () => this.loadConfig() },
  { id: 'auth', handler: () => this.checkAuth() },
  { id: 'data', handler: () => this.loadData() },
  { id: 'ui', handler: () => this.prepareUI() },
]);

if (success) {
  await this.splashService.hide();
}`,
    },
  ];

  readonly brandingCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `this.splashService.show({
  // Branding
  appName: 'My Enterprise App',
  logo: '/assets/logo.svg',
  tagline: 'Building the future, today',
  version: '2.5.0',

  // Styling
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  animationStyle: 'scale', // 'fade' | 'slide' | 'scale'

  // Behavior
  minDisplayTime: 1500, // ป้องกัน flash ถ้าโหลดเร็วมาก
  showStageDetails: true,
  showTips: false,
});`,
    },
  ];

  readonly errorCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `// วิธีที่ 1: ใช้ runStages - จัดการ error อัตโนมัติ
const success = await this.splashService.runStages([
  { id: 'config', handler: () => this.loadConfig() },
  {
    id: 'auth',
    handler: () => {
      // ถ้า throw error จะ mark stage เป็น error อัตโนมัติ
      throw new Error('ไม่สามารถเชื่อมต่อ server ได้');
    }
  },
]);

if (!success) {
  // แสดง error อยู่แล้ว, อาจจะมีปุ่ม retry
}

// วิธีที่ 2: จัดการ error เอง
this.splashService.startStage('auth');
try {
  await this.checkAuth();
  this.splashService.completeStage('auth');
} catch (error) {
  this.splashService.errorStage('auth', error.message);
  this.splashService.setError('เกิดข้อผิดพลาดในการโหลด กรุณาลองใหม่');
}`,
    },
  ];

  readonly initializerCode: CodeTab[] = [
    {
      label: 'app.config.ts',
      language: 'typescript',
      code: `import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { SplashScreenService } from '@aegisx/ui';

function initializeApp(splashService: SplashScreenService) {
  return async () => {
    // แสดง splash screen
    splashService.show({
      appName: 'My Enterprise App',
      logo: '/assets/logo.svg',
      version: '1.0.0',
    });

    // กำหนด stages
    splashService.setStages([
      { id: 'config', label: 'โหลดการตั้งค่า', icon: 'settings', status: 'pending' },
      { id: 'auth', label: 'ตรวจสอบสิทธิ์', icon: 'lock', status: 'pending' },
      { id: 'data', label: 'โหลดข้อมูล', icon: 'cloud', status: 'pending' },
    ]);

    // รัน stages
    const success = await splashService.runStages([
      { id: 'config', handler: () => loadAppConfig() },
      { id: 'auth', handler: () => initializeAuth() },
      { id: 'data', handler: () => loadInitialData() },
    ]);

    if (success) {
      await splashService.hide();
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [SplashScreenService],
      multi: true,
    },
  ],
};`,
    },
    {
      label: 'app.component.html',
      language: 'html',
      code: `<!-- Splash screen จะแสดงอัตโนมัติจาก APP_INITIALIZER -->
<ax-splash-screen />

<!-- App content -->
<router-outlet />`,
    },
  ];

  readonly standaloneCode: CodeTab[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<!-- ใช้งานแบบ standalone ด้วย inputs -->
<ax-splash-screen
  [visible]="isLoading"
  [logo]="'/assets/logo.svg'"
  [appName]="'My App'"
  [version]="'1.0.0'"
  [stages]="loadingStages"
  [message]="currentMessage"
  [progress]="loadingProgress"
  [error]="errorMessage"
  [showPercentage]="true"
/>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `export class AppComponent {
  isLoading = signal(true);
  loadingProgress = signal(0);
  currentMessage = signal('กำลังเริ่มต้นระบบ...');
  errorMessage = signal<string | null>(null);

  loadingStages = signal<SplashScreenStage[]>([
    { id: 'init', label: 'เริ่มต้น', status: 'loading' },
    { id: 'data', label: 'โหลดข้อมูล', status: 'pending' },
  ]);

  async startLoading() {
    // Update progress manually
    this.loadingProgress.set(25);
    this.currentMessage.set('โหลดการตั้งค่า...');

    // ... do work ...

    this.loadingProgress.set(100);
    this.isLoading.set(false);
  }
}`,
    },
  ];

  readonly stageInterfaceCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `interface SplashScreenStage {
  /** Unique identifier for the stage */
  id: string;

  /** Display label */
  label: string;

  /** Material icon name (optional) */
  icon?: string;

  /** Current status */
  status: 'pending' | 'loading' | 'completed' | 'error';

  /** Error message if status is 'error' */
  errorMessage?: string;
}`,
    },
  ];

  readonly configInterfaceCode: CodeTab[] = [
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `interface SplashScreenConfig {
  /** Application logo URL */
  logo?: string;

  /** Application name */
  appName?: string;

  /** Application version */
  version?: string;

  /** Tagline or description */
  tagline?: string;

  /** Background color or gradient */
  background?: string;

  /** Primary color for progress indicators */
  primaryColor?: string;

  /** Minimum display time in ms (prevents flash) */
  minDisplayTime?: number;

  /** Show loading tips */
  showTips?: boolean;

  /** Custom tips array */
  tips?: string[];

  /** Show stage details */
  showStageDetails?: boolean;

  /** Animation style */
  animationStyle?: 'fade' | 'slide' | 'scale';
}`,
    },
  ];

  readonly designTokens: ComponentToken[] = [
    {
      category: 'Colors',
      cssVar: '--ax-primary-default',
      usage: 'Progress bar color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-success-default',
      usage: 'Completed stage icon color',
    },
    {
      category: 'Colors',
      cssVar: '--ax-error-default',
      usage: 'Error stage icon color',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-md',
      usage: 'Content padding',
    },
    {
      category: 'Spacing',
      cssVar: '--ax-spacing-lg',
      usage: 'Section spacing',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-md',
      usage: 'Progress bar border radius',
    },
    {
      category: 'Borders',
      cssVar: '--ax-radius-lg',
      usage: 'Stage item border radius',
    },
    {
      category: 'Typography',
      cssVar: '--ax-text-heading',
      usage: 'App name color',
    },
    {
      category: 'Shadows',
      cssVar: '--ax-shadow-md',
      usage: 'Logo shadow',
    },
  ];
}
