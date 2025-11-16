import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Forms
import { AxButtonComponent } from '@aegisx/ui';
import { AxCheckboxComponent } from '@aegisx/ui';
import { AxRadioGroupComponent } from '@aegisx/ui';
import { AxInputComponent } from '@aegisx/ui';
import { AxSelectComponent } from '@aegisx/ui';
import { AxToggleComponent } from '@aegisx/ui';
import { AxTextareaComponent } from '@aegisx/ui';
import { AxDatePickerComponent } from '@aegisx/ui';

// Data Display
import { AxCardComponent } from '@aegisx/ui';
import { AxBadgeComponent } from '@aegisx/ui';
import { AxAvatarComponent } from '@aegisx/ui';
import { AxChipComponent } from '@aegisx/ui';
import { AxListComponent, ListItem } from '@aegisx/ui';
import { AxStatsCardComponent } from '@aegisx/ui';
import { AxTimelineComponent, TimelineItem } from '@aegisx/ui';
import { AxTableComponent, TableColumn } from '@aegisx/ui';

// Feedback
import { AxAlertComponent } from '@aegisx/ui';
import { AxSnackbarContainerComponent } from '@aegisx/ui';
import { TooltipDirective } from '@aegisx/ui';
import { AxProgressComponent } from '@aegisx/ui';
import { AxSkeletonComponent } from '@aegisx/ui';
import { AxDialogComponent } from '@aegisx/ui';
import { AxLoadingBarComponent } from '@aegisx/ui';

// Navigation
import { AxBreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';
import { AxMenuComponent, MenuItem } from '@aegisx/ui';
import { AxTabsComponent, Tab } from '@aegisx/ui';
import { AxNavbarComponent, NavbarItem } from '@aegisx/ui';
import { AxSidebarComponent, SidebarItem } from '@aegisx/ui';
import { AxDrawerComponent } from '@aegisx/ui';
import { AxPaginationComponent } from '@aegisx/ui';
import { AxStepperComponent, Step } from '@aegisx/ui';

@Component({
  selector: 'app-aegisx-ui-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Forms
    AxButtonComponent,
    AxCheckboxComponent,
    AxRadioGroupComponent,
    AxInputComponent,
    AxSelectComponent,
    AxToggleComponent,
    AxTextareaComponent,
    AxDatePickerComponent,
    // Data Display
    AxCardComponent,
    AxBadgeComponent,
    AxAvatarComponent,
    AxChipComponent,
    AxListComponent,
    AxStatsCardComponent,
    AxTimelineComponent,
    AxTableComponent,
    // Feedback
    AxAlertComponent,
    AxSnackbarContainerComponent,
    TooltipDirective,
    AxProgressComponent,
    AxSkeletonComponent,
    AxDialogComponent,
    AxLoadingBarComponent,
    // Navigation
    AxBreadcrumbComponent,
    AxMenuComponent,
    AxTabsComponent,
    AxNavbarComponent,
    AxSidebarComponent,
    AxDrawerComponent,
    AxPaginationComponent,
    AxStepperComponent,
  ],
  templateUrl: './aegisx-ui-showcase.component.html',
  styleUrls: ['./aegisx-ui-showcase.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AegisxUiShowcaseComponent {
  // Form states
  checkboxValue = false;
  radioValue = 'option1';
  radioOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];
  inputValue = '';
  selectValue = '';
  selectOptions = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];
  toggleValue = false;
  textareaValue = '';
  dateValue = new Date();

  // Data Display
  listItems: ListItem[] = [
    { title: 'Item 1', description: 'Description 1', icon: '📄' },
    { title: 'Item 2', description: 'Description 2', icon: '📁' },
    { title: 'Item 3', description: 'Description 3', icon: '📊' },
  ];

  timelineItems: TimelineItem[] = [
    {
      title: 'Event 1',
      description: 'First event',
      timestamp: '2024-01-01',
      color: 'var(--ax-primary)',
    },
    {
      title: 'Event 2',
      description: 'Second event',
      timestamp: '2024-01-02',
      color: 'var(--ax-success)',
    },
    {
      title: 'Event 3',
      description: 'Third event',
      timestamp: '2024-01-03',
      color: 'var(--ax-info)',
    },
  ];

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  tableData = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  ];

  // Feedback
  showDialog = false;
  showDialogSmall = false;
  showDialogLarge = false;
  showDialogFull = false;
  showDrawer = false;
  showDrawerLeft = false;
  showDrawerTop = false;
  showDrawerBottom = false;
  progressValue = 45;

  // Navigation
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Components', url: '/components' },
    { label: 'Showcase' },
  ];

  menuItems: MenuItem[] = [
    { label: 'Profile', icon: '👤' },
    { label: 'Settings', icon: '⚙️' },
    { label: 'Logout', icon: '🚪' },
  ];

  tabs: Tab[] = [
    { label: 'Tab 1', icon: '📋' },
    { label: 'Tab 2', icon: '📊' },
    { label: 'Tab 3', icon: '⚙️' },
  ];
  activeTab = 0;

  navbarItems: NavbarItem[] = [
    { label: 'Home', url: '/', active: true },
    { label: 'About', url: '/about' },
    { label: 'Contact', url: '/contact' },
  ];

  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', icon: '📊', url: '/', active: true },
    { label: 'Users', icon: '👥', url: '/users' },
    { label: 'Settings', icon: '⚙️', url: '/settings' },
  ];

  steps: Step[] = [
    { label: 'Step 1', description: 'First step', completed: true },
    { label: 'Step 2', description: 'Second step', completed: false },
    { label: 'Step 3', description: 'Third step', completed: false },
  ];
  activeStep = 1;

  currentPage = 1;
  totalPages = 10;

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
