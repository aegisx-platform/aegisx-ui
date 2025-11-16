import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Forms
import { AxButtonComponent } from '@aegisx/ui';
import { AxCheckboxComponent } from '@aegisx/ui';
import { AxRadioGroupComponent } from '@aegisx/ui';
import { AxInputComponent } from '@aegisx/ui';
import { AxSelectComponent } from '@aegisx/ui';
import { ToggleComponent } from '@aegisx/ui';
import { TextareaComponent } from '@aegisx/ui';
import { DatePickerComponent } from '@aegisx/ui';

// Data Display
import { CardComponent } from '@aegisx/ui';
import { BadgeComponent } from '@aegisx/ui';
import { AvatarComponent } from '@aegisx/ui';
import { ChipComponent } from '@aegisx/ui';
import { ListComponent, ListItem } from '@aegisx/ui';
import { StatsCardComponent } from '@aegisx/ui';
import { TimelineComponent, TimelineItem } from '@aegisx/ui';
import { TableComponent, TableColumn } from '@aegisx/ui';

// Feedback
import { AlertComponent } from '@aegisx/ui';
import { SnackbarContainerComponent } from '@aegisx/ui';
import { TooltipDirective } from '@aegisx/ui';
import { ProgressComponent } from '@aegisx/ui';
import { SkeletonComponent } from '@aegisx/ui';
import { DialogComponent } from '@aegisx/ui';
import { LoadingBarComponent } from '@aegisx/ui';

// Navigation
import { BreadcrumbComponent, BreadcrumbItem } from '@aegisx/ui';
import { MenuComponent, MenuItem } from '@aegisx/ui';
import { TabsComponent, Tab } from '@aegisx/ui';
import { NavbarComponent, NavbarItem } from '@aegisx/ui';
import { SidebarComponent, SidebarItem } from '@aegisx/ui';
import { DrawerComponent } from '@aegisx/ui';
import { PaginationComponent } from '@aegisx/ui';
import { StepperComponent, Step } from '@aegisx/ui';

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
    ToggleComponent,
    TextareaComponent,
    DatePickerComponent,
    // Data Display
    CardComponent,
    BadgeComponent,
    AvatarComponent,
    ChipComponent,
    ListComponent,
    StatsCardComponent,
    TimelineComponent,
    TableComponent,
    // Feedback
    AlertComponent,
    SnackbarContainerComponent,
    TooltipDirective,
    ProgressComponent,
    SkeletonComponent,
    DialogComponent,
    LoadingBarComponent,
    // Navigation
    BreadcrumbComponent,
    MenuComponent,
    TabsComponent,
    NavbarComponent,
    SidebarComponent,
    DrawerComponent,
    PaginationComponent,
    StepperComponent,
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
  showDrawer = false;
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
