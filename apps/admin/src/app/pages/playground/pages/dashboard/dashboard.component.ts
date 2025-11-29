import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  AxEnterpriseLayoutComponent,
  AxNavigationItem,
  AxBreadcrumbComponent,
  BreadcrumbItem,
} from '@aegisx/ui';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: string;
  iconColor: string;
}

interface Activity {
  user: string;
  action: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
}

interface SystemMetric {
  label: string;
  value: number;
  status: 'healthy' | 'warning';
  statusColor: string;
}

interface MiniStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface Product {
  name: string;
  category: string;
  sales: string;
}

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  performance: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    NgxChartsModule,
    AxEnterpriseLayoutComponent,
    AxBreadcrumbComponent,
  ],
  template: `
    <ax-enterprise-layout
      [appName]="'Dashboard'"
      [navigation]="navigation"
      [showFooter]="true"
      [headerTheme]="'dark'"
      [contentBackground]="'gray'"
      (logoutClicked)="onLogout()"
    >
      <!-- Header Actions -->
      <ng-template #headerActions>
        <button mat-icon-button matTooltip="Notifications">
          <mat-icon>notifications</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Settings">
          <mat-icon>settings</mat-icon>
        </button>
      </ng-template>

      <!-- Main Content -->
      <div class="dashboard-content">
        <!-- Breadcrumb -->
        <ax-breadcrumb
          [items]="breadcrumbItems"
          separatorIcon="chevron_right"
          size="sm"
        ></ax-breadcrumb>

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Dashboard</h1>
            <p class="page-subtitle">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <button mat-flat-button color="primary">
            <mat-icon>refresh</mat-icon>
            Refresh Data
          </button>
        </div>

        <!-- Stats Cards Grid -->
        <div class="stats-grid">
          @for (stat of stats; track stat.title) {
            <mat-card appearance="outlined" class="stat-card">
              <mat-card-content>
                <div
                  class="stat-icon"
                  [style.background]="stat.iconColor + '20'"
                  [style.color]="stat.iconColor"
                >
                  <mat-icon>{{ stat.icon }}</mat-icon>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ stat.value }}</span>
                  <span class="stat-label">{{ stat.title }}</span>
                  <span
                    class="stat-change"
                    [class.positive]="stat.changeType === 'increase'"
                    [class.negative]="stat.changeType === 'decrease'"
                  >
                    {{ stat.changeType === 'increase' ? '↑' : '↓' }}
                    {{ stat.change }}
                  </span>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>

        <!-- Charts Section -->
        <div class="charts-grid">
          <!-- Line Chart -->
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title>User Growth Trend</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ngx-charts-line-chart
                [view]="view"
                [results]="lineChartData"
                [xAxis]="showXAxis"
                [yAxis]="showYAxis"
                [legend]="showLegend"
                [showXAxisLabel]="showXAxisLabel"
                [showYAxisLabel]="showYAxisLabel"
                [scheme]="colorScheme"
                [gradient]="gradient"
                [curve]="'monotoneX'"
              >
              </ngx-charts-line-chart>
            </mat-card-content>
          </mat-card>

          <!-- Bar Chart -->
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title>Users by Department</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ngx-charts-bar-vertical
                [view]="view"
                [results]="barChartData"
                [xAxis]="showXAxis"
                [yAxis]="showYAxis"
                [legend]="showLegend"
                [showXAxisLabel]="showXAxisLabel"
                [showYAxisLabel]="showYAxisLabel"
                [scheme]="colorScheme"
                [gradient]="gradient"
              >
              </ngx-charts-bar-vertical>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Main Content Grid -->
        <div class="main-grid">
          <!-- Recent Activities -->
          <mat-card appearance="outlined" class="activities-card">
            <mat-card-header>
              <div class="card-header-flex">
                <mat-card-title>Recent Activities</mat-card-title>
                <button mat-button color="primary">
                  View All
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div class="activity-list">
                @for (
                  activity of recentActivities;
                  track activity.timestamp;
                  let last = $last
                ) {
                  <div class="activity-item" [class.last]="last">
                    <div class="activity-header">
                      <span class="activity-user">{{ activity.user }}</span>
                      <span class="activity-time">{{
                        getRelativeTime(activity.timestamp)
                      }}</span>
                    </div>
                    <p class="activity-action">{{ activity.action }}</p>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Quick Actions & System Status -->
          <div class="side-cards">
            <!-- Quick Actions -->
            <mat-card appearance="outlined">
              <mat-card-header>
                <mat-card-title>Quick Actions</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="quick-actions">
                  @for (action of quickActions; track action.label) {
                    <button mat-stroked-button>{{ action.label }}</button>
                  }
                </div>
              </mat-card-content>
            </mat-card>

            <!-- System Status -->
            <mat-card appearance="outlined">
              <mat-card-header>
                <mat-card-title>System Status</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="metrics-list">
                  @for (metric of systemMetrics; track metric.label) {
                    <div class="metric-item">
                      <div class="metric-header">
                        <span class="metric-label">{{ metric.label }}</span>
                        <span class="metric-value">{{ metric.value }}%</span>
                      </div>
                      <mat-progress-bar
                        mode="determinate"
                        [value]="metric.value"
                        [color]="
                          metric.status === 'warning' ? 'warn' : 'primary'
                        "
                      ></mat-progress-bar>
                    </div>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <!-- Bottom Grid -->
        <div class="bottom-grid">
          <!-- Top Products -->
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title>Top Products</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="products-list">
                @for (
                  product of topProducts;
                  track product.name;
                  let i = $index
                ) {
                  <div class="product-item">
                    <div class="rank">{{ i + 1 }}</div>
                    <div class="product-info">
                      <span class="product-name">{{ product.name }}</span>
                      <span class="product-category">{{
                        product.category
                      }}</span>
                    </div>
                    <div class="product-sales">
                      <span class="sales-value">{{ product.sales }}</span>
                      <span class="sales-label">sales</span>
                    </div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Team Performance -->
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title>Team Performance</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="team-list">
                @for (member of teamMembers; track member.name) {
                  <div class="team-member">
                    <div class="member-info">
                      <div
                        class="avatar"
                        [style.background]="member.avatarColor"
                      >
                        {{ member.initials }}
                      </div>
                      <div class="member-details">
                        <span class="member-name">{{ member.name }}</span>
                        <span class="member-role">{{ member.role }}</span>
                      </div>
                    </div>
                    <div class="performance">
                      <span class="performance-value"
                        >{{ member.performance }}%</span
                      >
                      <mat-progress-bar
                        mode="determinate"
                        [value]="member.performance"
                      ></mat-progress-bar>
                    </div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Footer Content -->
      <ng-template #footerContent>
        <span>Dashboard Demo - AegisX Design System</span>
        <a mat-button routerLink="/docs/components/aegisx/layout/enterprise">
          View Enterprise Layout Docs
        </a>
      </ng-template>
    </ax-enterprise-layout>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }

      .dashboard-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .page-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--ax-text-heading);
        margin: 0 0 0.25rem 0;
      }

      .page-subtitle {
        font-size: 0.9375rem;
        color: var(--ax-text-secondary);
        margin: 0;
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }

      .stat-card mat-card-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.25rem !important;
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-lg);
      }

      .stat-icon mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .stat-info {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--ax-text-heading);
      }

      .stat-label {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
      }

      .stat-change {
        font-size: 0.75rem;
        font-weight: 600;
      }

      .stat-change.positive {
        color: var(--ax-success-default);
      }

      .stat-change.negative {
        color: var(--ax-error-default);
      }

      /* Charts Grid */
      .charts-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        @media (min-width: 1024px) {
          grid-template-columns: 1fr 1fr;
        }
      }

      /* Main Grid */
      .main-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        @media (min-width: 1024px) {
          grid-template-columns: 2fr 1fr;
        }
      }

      .card-header-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      /* Activity List */
      .activity-list {
        display: flex;
        flex-direction: column;
      }

      .activity-item {
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--ax-border-default);
      }

      .activity-item.last {
        border-bottom: none;
      }

      .activity-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;
      }

      .activity-user {
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .activity-time {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      .activity-action {
        font-size: 0.875rem;
        color: var(--ax-text-body);
        margin: 0;
      }

      /* Side Cards */
      .side-cards {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      /* Quick Actions */
      .quick-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }

      /* Metrics */
      .metrics-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .metric-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .metric-header {
        display: flex;
        justify-content: space-between;
      }

      .metric-label {
        font-size: 0.875rem;
        color: var(--ax-text-body);
      }

      .metric-value {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      /* Bottom Grid */
      .bottom-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        @media (min-width: 1024px) {
          grid-template-columns: 1fr 1fr;
        }
      }

      /* Products List */
      .products-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .product-item {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .rank {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-full);
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--ax-text-body);
      }

      .product-info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .product-name {
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .product-category {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      .product-sales {
        text-align: right;
      }

      .sales-value {
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .sales-label {
        display: block;
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      /* Team List */
      .team-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .team-member {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .member-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .avatar {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ax-radius-full);
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .member-details {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .member-name {
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .member-role {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      .performance {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .performance-value {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--ax-text-body);
        text-align: right;
      }
    `,
  ],
})
export class DashboardComponent {
  // Breadcrumb
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: 'home' },
    { label: 'Playground', url: '/playground' },
    { label: 'Dashboard' },
  ];

  // Navigation
  navigation: AxNavigationItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      link: '/playground/pages/dashboard',
      icon: 'dashboard',
    },
    {
      id: 'users',
      title: 'User Management',
      link: '/playground/pages/user-management',
      icon: 'people',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      link: '/playground/pages/dashboard',
      icon: 'analytics',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      children: [
        {
          id: 'profile',
          title: 'Profile',
          link: '/playground/pages/dashboard',
        },
        {
          id: 'account',
          title: 'Account',
          link: '/playground/pages/dashboard',
        },
      ],
    },
  ];

  // Stats Cards Data
  stats: StatCard[] = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      changeType: 'increase',
      icon: 'people',
      iconColor: 'var(--ax-brand-default)',
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: '+8.2%',
      changeType: 'increase',
      icon: 'trending_up',
      iconColor: '#10b981',
    },
    {
      title: 'Total Revenue',
      value: '$48,234',
      change: '+23.1%',
      changeType: 'increase',
      icon: 'payments',
      iconColor: '#f59e0b',
    },
    {
      title: 'Bounce Rate',
      value: '32.8%',
      change: '-5.4%',
      changeType: 'decrease',
      icon: 'error_outline',
      iconColor: '#ef4444',
    },
  ];

  // Chart Data for ngx-charts
  lineChartData = [
    {
      name: 'Users',
      series: [
        { name: 'Jan', value: 2100 },
        { name: 'Feb', value: 2200 },
        { name: 'Mar', value: 2350 },
        { name: 'Apr', value: 2400 },
        { name: 'May', value: 2450 },
        { name: 'Jun', value: 2543 },
      ],
    },
  ];

  barChartData = [
    { name: 'Engineering', value: 45 },
    { name: 'Sales', value: 32 },
    { name: 'Marketing', value: 28 },
    { name: 'HR', value: 18 },
    { name: 'Operations', value: 15 },
    { name: 'Finance', value: 12 },
  ];

  // Chart Options
  view: [number, number] = [700, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  showYAxisLabel = false;
  colorScheme = 'cool';

  // Recent Activities
  recentActivities: Activity[] = [
    {
      user: 'John Doe',
      action: 'Created new project "AegisX Dashboard"',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'success',
    },
    {
      user: 'Jane Smith',
      action: 'Updated user profile settings',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'success',
    },
    {
      user: 'Bob Johnson',
      action: 'Deleted 3 files from storage',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'warning',
    },
    {
      user: 'Alice Williams',
      action: 'Failed login attempt detected',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'error',
    },
    {
      user: 'Charlie Brown',
      action: 'Exported monthly analytics report',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'success',
    },
  ];

  // Quick Actions
  quickActions = [
    { icon: 'person_add', label: 'Add User', color: 'primary' },
    { icon: 'upload_file', label: 'Upload', color: 'accent' },
    { icon: 'assessment', label: 'Reports', color: 'primary' },
    { icon: 'settings', label: 'Settings', color: 'accent' },
  ];

  // System Metrics
  systemMetrics: SystemMetric[] = [
    {
      label: 'CPU Usage',
      value: 45,
      status: 'healthy',
      statusColor: 'var(--ax-brand-default)',
    },
    {
      label: 'Memory',
      value: 68,
      status: 'healthy',
      statusColor: 'var(--ax-brand-default)',
    },
    {
      label: 'Storage',
      value: 82,
      status: 'warning',
      statusColor: '#f59e0b',
    },
    {
      label: 'Network',
      value: 34,
      status: 'healthy',
      statusColor: 'var(--ax-brand-default)',
    },
  ];

  // Top Products
  topProducts: Product[] = [
    {
      name: 'Premium Subscription',
      category: 'Digital Product',
      sales: '1,234',
    },
    {
      name: 'Enterprise License',
      category: 'Software',
      sales: '892',
    },
    {
      name: 'Consulting Package',
      category: 'Service',
      sales: '645',
    },
    {
      name: 'API Access',
      category: 'Digital Product',
      sales: '534',
    },
    {
      name: 'Training Course',
      category: 'Education',
      sales: '423',
    },
  ];

  // Team Members Performance
  teamMembers: TeamMember[] = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      initials: 'SJ',
      avatarColor: 'var(--ax-brand-default)',
      performance: 92,
    },
    {
      name: 'Mike Chen',
      role: 'Backend Developer',
      initials: 'MC',
      avatarColor: '#10b981',
      performance: 88,
    },
    {
      name: 'Emily Davis',
      role: 'UI/UX Designer',
      initials: 'ED',
      avatarColor: '#f59e0b',
      performance: 95,
    },
    {
      name: 'David Kim',
      role: 'DevOps Engineer',
      initials: 'DK',
      avatarColor: '#8b5cf6',
      performance: 78,
    },
  ];

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  onLogout(): void {
    console.log('Logout clicked');
  }
}
