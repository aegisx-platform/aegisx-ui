import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import {
  GridsterComponent,
  GridsterItemComponent,
  GridsterConfig,
  GridType,
  DisplayGrid,
} from 'angular-gridster2';
import {
  AxEnterpriseLayoutComponent,
  AxNavigationItem,
  AxBreadcrumbComponent,
  BreadcrumbItem,
  AxLauncherCardComponent,
  AxDrawerComponent,
  LauncherApp,
  LauncherColor,
} from '@aegisx/ui';

// สร้าง type ที่รวม LauncherApp กับ GridsterItem properties
type GridsterLauncherApp = LauncherApp & {
  x: number;
  y: number;
  cols: number;
  rows: number;
};

@Component({
  selector: 'app-gridster-poc',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    GridsterComponent,
    GridsterItemComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatDividerModule,
    AxEnterpriseLayoutComponent,
    AxBreadcrumbComponent,
    AxLauncherCardComponent,
    AxDrawerComponent,
  ],
  template: `
    <ax-enterprise-layout
      [appName]="'Dashboard Builder'"
      [navigation]="navigation"
      [showFooter]="true"
      [headerTheme]="'dark'"
      [contentBackground]="'gray'"
      (logoutClicked)="onLogout()"
    >
      <!-- Header Actions -->
      <ng-template #headerActions>
        <button
          mat-flat-button
          [color]="editMode() ? 'accent' : 'primary'"
          (click)="toggleEditMode()"
        >
          <mat-icon>{{ editMode() ? 'lock_open' : 'lock' }}</mat-icon>
          {{ editMode() ? 'Edit Mode: ON' : 'Edit Mode: OFF' }}
        </button>
        <button
          mat-icon-button
          matTooltip="Grid Options"
          (click)="openOptionsDrawer()"
        >
          <mat-icon>settings</mat-icon>
        </button>
      </ng-template>

      <!-- Main Content -->
      <div class="poc-content">
        <!-- Breadcrumb -->
        <ax-breadcrumb
          [items]="breadcrumbItems"
          separatorIcon="chevron_right"
          size="sm"
        ></ax-breadcrumb>

        <!-- Instructions -->
        @if (editMode()) {
          <div class="poc-instructions">
            <mat-icon>info</mat-icon>
            <span>Edit mode enabled - You can now drag and resize cards!</span>
          </div>
        }

        <!-- Gridster Content -->
        <div class="gridster-wrapper">
          <gridster [options]="options">
            @for (item of dashboard; track item.id) {
              <gridster-item [item]="item">
                <ax-launcher-card
                  [app]="item"
                  [isEditMode]="editMode()"
                  (cardClick)="onCardClick($event)"
                />
              </gridster-item>
            }
          </gridster>
        </div>

        <!-- Info Box -->
        <div class="info-card">
          <mat-icon class="info-icon">info</mat-icon>
          <div class="info-text">
            <strong>Dashboard Builder Features</strong>
            <ul>
              <li>
                <strong>Edit Mode:</strong> Click the button in header to enable
                drag & resize
              </li>
              <li>
                <strong>Drag:</strong> When edit mode is ON, drag cards to
                reposition them
              </li>
              <li>
                <strong>Resize:</strong> Drag the corners/edges of cards to
                resize them
              </li>
              <li>
                <strong>Push Items:</strong> Cards will automatically push
                others out of the way
              </li>
              <li><strong>Grid:</strong> 12-column responsive grid system</li>
              <li>
                <strong>Options:</strong> Click settings icon to customize grid
                options
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Content -->
      <ng-template #footerContent>
        <span>Dashboard Builder - AegisX Design System</span>
        <a mat-button routerLink="/gridster-demo"> Back to Gridster Demo </a>
      </ng-template>
    </ax-enterprise-layout>

    <!-- Options Drawer -->
    <ax-drawer
      [(open)]="optionsDrawerOpen"
      position="right"
      size="sm"
      title="Grid Options"
      subtitle="Customize the grid layout"
      icon="tune"
    >
      <div class="options-panel">
        <!-- Grid Type -->
        <div class="option-section">
          <h4>Grid Type</h4>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Grid Type</mat-label>
            <mat-select
              [(ngModel)]="gridSettings.gridType"
              (ngModelChange)="applyOptions()"
            >
              <mat-option value="fit">Fit (fill container)</mat-option>
              <mat-option value="scrollVertical">Scroll Vertical</mat-option>
              <mat-option value="scrollHorizontal"
                >Scroll Horizontal</mat-option
              >
              <mat-option value="fixed">Fixed Size</mat-option>
              <mat-option value="verticalFixed">Vertical Fixed</mat-option>
              <mat-option value="horizontalFixed">Horizontal Fixed</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-divider></mat-divider>

        <!-- Grid Size -->
        <div class="option-section">
          <h4>Grid Size</h4>

          <label class="slider-label">
            Columns: {{ gridSettings.minCols }}
          </label>
          <mat-slider min="4" max="24" step="1" class="full-width">
            <input
              matSliderThumb
              [(ngModel)]="gridSettings.minCols"
              (ngModelChange)="onColsChange($event)"
            />
          </mat-slider>

          <label class="slider-label">
            Margin: {{ gridSettings.margin }}px
          </label>
          <mat-slider min="0" max="32" step="2" class="full-width">
            <input
              matSliderThumb
              [(ngModel)]="gridSettings.margin"
              (ngModelChange)="applyOptions()"
            />
          </mat-slider>

          <label class="slider-label">
            Min Rows: {{ gridSettings.minRows }}
          </label>
          <mat-slider min="1" max="20" step="1" class="full-width">
            <input
              matSliderThumb
              [(ngModel)]="gridSettings.minRows"
              (ngModelChange)="applyOptions()"
            />
          </mat-slider>
        </div>

        <mat-divider></mat-divider>

        <!-- Display Options -->
        <div class="option-section">
          <h4>Display Options</h4>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Show Grid Lines</mat-label>
            <mat-select
              [(ngModel)]="gridSettings.displayGrid"
              (ngModelChange)="applyOptions()"
            >
              <mat-option value="always">Always</mat-option>
              <mat-option value="onDrag&Resize">On Drag & Resize</mat-option>
              <mat-option value="none">Never</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-slide-toggle
            [(ngModel)]="gridSettings.pushItems"
            (ngModelChange)="applyOptions()"
          >
            Push Items on Move
          </mat-slide-toggle>

          <mat-slide-toggle
            [(ngModel)]="gridSettings.swap"
            (ngModelChange)="applyOptions()"
          >
            Swap Items on Overlap
          </mat-slide-toggle>

          <mat-slide-toggle
            [(ngModel)]="gridSettings.compactType"
            (ngModelChange)="applyOptions()"
          >
            Compact Items
          </mat-slide-toggle>
        </div>

        <mat-divider></mat-divider>

        <!-- Fixed Size Options -->
        @if (
          gridSettings.gridType === 'fixed' ||
          gridSettings.gridType === 'verticalFixed' ||
          gridSettings.gridType === 'horizontalFixed'
        ) {
          <div class="option-section">
            <h4>Fixed Size</h4>

            <label class="slider-label">
              Row Height: {{ gridSettings.fixedRowHeight }}px
            </label>
            <mat-slider min="50" max="300" step="10" class="full-width">
              <input
                matSliderThumb
                [(ngModel)]="gridSettings.fixedRowHeight"
                (ngModelChange)="applyOptions()"
              />
            </mat-slider>

            <label class="slider-label">
              Column Width: {{ gridSettings.fixedColWidth }}px
            </label>
            <mat-slider min="50" max="300" step="10" class="full-width">
              <input
                matSliderThumb
                [(ngModel)]="gridSettings.fixedColWidth"
                (ngModelChange)="applyOptions()"
              />
            </mat-slider>
          </div>

          <mat-divider></mat-divider>
        }

        <!-- Actions -->
        <div class="option-section">
          <button
            mat-stroked-button
            color="primary"
            class="full-width"
            (click)="resetOptions()"
          >
            <mat-icon>refresh</mat-icon>
            Reset to Defaults
          </button>
        </div>
      </div>

      <!-- Footer -->
      <ng-template #footer>
        <button mat-button (click)="optionsDrawerOpen = false">Close</button>
        <button mat-flat-button color="primary" (click)="applyOptions()">
          Apply
        </button>
      </ng-template>
    </ax-drawer>
  `,
  styles: `
    :host {
      display: block;
      height: 100vh;
    }

    .poc-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
    }

    .poc-instructions {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      background: #fff3e0;
      border-radius: 8px;
      border-left: 4px solid #ff9800;
      flex-shrink: 0;
      color: #e65100;
      font-weight: 500;

      mat-icon {
        color: #ff9800;
      }
    }

    /* CRITICAL: Parent wrapper MUST have explicit size for gridster to work */
    .gridster-wrapper {
      flex: 1;
      min-height: 500px;
      position: relative;
    }

    gridster {
      background: var(--ax-background-subtle, #e5e7eb);
      border-radius: 12px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    /* CRITICAL: Make ax-launcher-card fill the gridster-item completely */
    ::ng-deep gridster-item {
      /* Remove white background from gridster-item */
      background: transparent !important;
      /* Allow shadow to overflow outside the item bounds */
      overflow: visible !important;

      ax-launcher-card {
        display: block;
        height: 100%;
        width: 100%;
      }

      .launcher-card {
        min-height: unset !important;
        height: 100% !important;
        box-sizing: border-box;
      }
    }

    /* Info Card */
    .info-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.25rem;
      background: var(--ax-info-faint);
      border: 1px solid var(--ax-info-200);
      border-radius: var(--ax-radius-lg);
      flex-shrink: 0;
    }

    .info-icon {
      color: var(--ax-info-default);
      font-size: 24px;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .info-text {
      strong {
        color: var(--ax-info-700);
        font-size: 1rem;
      }

      ul {
        margin: 0.75rem 0 0;
        padding-left: 1.25rem;

        li {
          font-size: 0.9375rem;
          color: var(--ax-info-700);
          line-height: 1.6;
          margin-bottom: 0.25rem;

          strong {
            font-size: 0.9375rem;
          }
        }
      }
    }

    button mat-icon {
      margin-right: 8px;
    }

    /* Options Panel Styles */
    .options-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .option-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      h4 {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-heading, #111827);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .slider-label {
      font-size: 0.875rem;
      color: var(--ax-text-secondary, #6b7280);
      margin-top: 0.5rem;
    }

    .full-width {
      width: 100%;
    }

    mat-slide-toggle {
      margin: 0.25rem 0;
    }

    mat-divider {
      margin: 0.5rem 0;
    }
  `,
})
export class GridsterPocComponent {
  editMode = signal(false);
  optionsDrawerOpen = false;

  // Grid settings state for drawer controls
  gridSettings = {
    gridType: 'fit' as GridType,
    minCols: 12,
    maxCols: 12,
    minRows: 6,
    maxRows: 100,
    margin: 16,
    displayGrid: 'onDrag&Resize' as DisplayGrid,
    pushItems: true,
    swap: false,
    compactType: false,
    fixedRowHeight: 100,
    fixedColWidth: 100,
  };

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: 'home' },
    { label: 'Demos', url: '/enterprise-demo' },
    { label: 'Dashboard Builder' },
  ];

  navigation: AxNavigationItem[] = [
    {
      id: 'launcher',
      title: 'App Launcher Demo',
      link: '/app-launcher-demo',
      icon: 'apps',
    },
    {
      id: 'gridster-demo',
      title: 'Gridster Demo',
      link: '/gridster-demo',
      icon: 'grid_view',
    },
    {
      id: 'dashboard-builder',
      title: 'Dashboard Builder',
      link: '/gridster-poc',
      icon: 'dashboard_customize',
    },
    {
      id: 'enterprise',
      title: 'Enterprise Demo',
      link: '/enterprise-demo',
      icon: 'business',
    },
  ];

  // Gridster options - ใช้ object ธรรมดา และต้อง mutate object เดิม
  options: GridsterConfig = {
    draggable: {
      enabled: false,
    },
    resizable: {
      enabled: false,
    },
    pushItems: true,
    displayGrid: 'onDrag&Resize',
    gridType: 'fit',
    minCols: 12,
    maxCols: 12,
    minRows: 6,
    maxRows: 100,
    margin: 16,
  };

  // Dashboard data ใช้ LauncherApp format + GridsterItem properties
  dashboard: GridsterLauncherApp[] = [
    {
      id: 'revenue',
      name: 'Revenue',
      description: 'Track revenue metrics',
      icon: 'attach_money',
      color: 'pink' as LauncherColor,
      status: 'active',
      enabled: true,
      route: '/revenue',
      x: 0,
      y: 0,
      rows: 2,
      cols: 3,
    },
    {
      id: 'users',
      name: 'Users',
      description: 'User management',
      icon: 'people',
      color: 'mint' as LauncherColor,
      status: 'active',
      enabled: true,
      route: '/users',
      x: 3,
      y: 0,
      rows: 2,
      cols: 3,
    },
    {
      id: 'orders',
      name: 'Orders',
      description: 'Order tracking',
      icon: 'shopping_cart',
      color: 'peach' as LauncherColor,
      status: 'active',
      enabled: true,
      route: '/orders',
      x: 6,
      y: 0,
      rows: 2,
      cols: 3,
    },
    {
      id: 'traffic',
      name: 'Traffic',
      description: 'Site traffic analytics',
      icon: 'trending_up',
      color: 'lavender' as LauncherColor,
      status: 'active',
      enabled: true,
      route: '/traffic',
      x: 9,
      y: 0,
      rows: 2,
      cols: 3,
    },
    {
      id: 'sales-chart',
      name: 'Sales Chart',
      description: 'Visual sales data',
      icon: 'bar_chart',
      color: 'blue' as LauncherColor,
      status: 'active',
      enabled: true,
      route: '/sales',
      x: 0,
      y: 2,
      rows: 3,
      cols: 6,
    },
    {
      id: 'analytics',
      name: 'User Analytics',
      description: 'Deep user insights',
      icon: 'analytics',
      color: 'cyan' as LauncherColor,
      status: 'active',
      enabled: true,
      route: '/analytics',
      x: 6,
      y: 2,
      rows: 3,
      cols: 6,
    },
    {
      id: 'notifications',
      name: 'Notifications',
      description: 'Alert management',
      icon: 'notifications',
      color: 'rose' as LauncherColor,
      status: 'new',
      enabled: true,
      route: '/notifications',
      notificationCount: 5,
      x: 0,
      y: 5,
      rows: 2,
      cols: 4,
    },
    {
      id: 'tasks',
      name: 'Tasks',
      description: 'Task management',
      icon: 'task_alt',
      color: 'yellow' as LauncherColor,
      status: 'active',
      enabled: true,
      route: '/tasks',
      x: 4,
      y: 5,
      rows: 2,
      cols: 4,
    },
    {
      id: 'calendar',
      name: 'Calendar',
      description: 'Schedule & events',
      icon: 'calendar_today',
      color: 'neutral' as LauncherColor,
      status: 'beta',
      enabled: true,
      route: '/calendar',
      x: 8,
      y: 5,
      rows: 2,
      cols: 4,
    },
  ];

  openOptionsDrawer(): void {
    this.optionsDrawerOpen = true;
  }

  toggleEditMode(): void {
    const newEditMode = !this.editMode();
    this.editMode.set(newEditMode);

    // IMPORTANT: ต้อง mutate options object เดิม แล้วเรียก api.optionsChanged()
    this.options.draggable!.enabled = newEditMode;
    this.options.resizable!.enabled = newEditMode;
    this.options.displayGrid = newEditMode
      ? 'always'
      : this.gridSettings.displayGrid;

    // เรียก optionsChanged เพื่อ notify gridster
    this.notifyGridster();
  }

  onColsChange(value: number): void {
    this.gridSettings.minCols = value;
    this.gridSettings.maxCols = value;
    this.applyOptions();
  }

  applyOptions(): void {
    // Apply all settings to gridster options
    this.options.gridType = this.gridSettings.gridType;
    this.options.minCols = this.gridSettings.minCols;
    this.options.maxCols = this.gridSettings.maxCols;
    this.options.minRows = this.gridSettings.minRows;
    this.options.maxRows = this.gridSettings.maxRows;
    this.options.margin = this.gridSettings.margin;
    this.options.pushItems = this.gridSettings.pushItems;
    this.options.swap = this.gridSettings.swap;

    // Display grid based on edit mode
    if (this.editMode()) {
      this.options.displayGrid = 'always';
    } else {
      this.options.displayGrid = this.gridSettings.displayGrid;
    }

    // Compact type
    if (this.gridSettings.compactType) {
      this.options.compactType = 'compactUp&Left';
    } else {
      this.options.compactType = 'none';
    }

    // Fixed size options
    if (
      this.gridSettings.gridType === 'fixed' ||
      this.gridSettings.gridType === 'verticalFixed' ||
      this.gridSettings.gridType === 'horizontalFixed'
    ) {
      this.options.fixedRowHeight = this.gridSettings.fixedRowHeight;
      this.options.fixedColWidth = this.gridSettings.fixedColWidth;
    }

    this.notifyGridster();
  }

  resetOptions(): void {
    this.gridSettings = {
      gridType: 'fit' as GridType,
      minCols: 12,
      maxCols: 12,
      minRows: 6,
      maxRows: 100,
      margin: 16,
      displayGrid: 'onDrag&Resize' as DisplayGrid,
      pushItems: true,
      swap: false,
      compactType: false,
      fixedRowHeight: 100,
      fixedColWidth: 100,
    };
    this.applyOptions();
  }

  private notifyGridster(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  onCardClick(event: { app: LauncherApp }): void {
    console.log('Card clicked:', event.app.name);
    alert(`Clicked: ${event.app.name}`);
  }

  onLogout(): void {
    console.log('Logout clicked');
  }
}
