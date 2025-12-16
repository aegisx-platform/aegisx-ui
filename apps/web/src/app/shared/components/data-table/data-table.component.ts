import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatTableModule,
  MatTableDataSource,
  MatTable,
} from '@angular/material/table';
import {
  MatPaginatorModule,
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { TableColumn, TableAction, BadgeStyleMap } from './data-table.types';

/**
 * Generic Data Table Component
 *
 * A reusable table component built with Angular Material that supports:
 * - Generic data type <T>
 * - Dynamic column configuration
 * - Pagination with customizable page sizes
 * - Sorting with server-side support
 * - Row click events
 * - Action columns with custom buttons
 * - Loading states with spinner overlay
 * - Multiple cell types (text, date, badge, actions)
 * - Custom cell formatting
 * - Responsive design with TailwindCSS
 *
 * @example
 * ```typescript
 * // Define columns
 * columns: TableColumn[] = [
 *   { key: 'id', header: 'ID', sortable: true },
 *   { key: 'name', header: 'Name', sortable: true },
 *   { key: 'email', header: 'Email' },
 *   { key: 'status', header: 'Status', type: 'badge' },
 *   {
 *     key: 'createdAt',
 *     header: 'Created',
 *     type: 'date',
 *     format: (value) => new Date(value).toLocaleDateString()
 *   },
 *   {
 *     key: 'actions',
 *     header: 'Actions',
 *     type: 'actions',
 *     actions: [
 *       { label: 'Edit', icon: 'edit', action: 'edit' },
 *       { label: 'Delete', icon: 'delete', action: 'delete', color: 'warn' }
 *     ]
 *   }
 * ];
 *
 * // In template
 * <app-data-table
 *   [data]="items$ | async"
 *   [columns]="columns"
 *   [totalItems]="totalItems$ | async"
 *   [loading]="loading$ | async"
 *   [pageSize]="10"
 *   (pageChange)="onPageChange($event)"
 *   (sortChange)="onSortChange($event)"
 *   (rowClick)="onRowClick($event)"
 *   (actionClick)="onActionClick($event)"
 * ></app-data-table>
 * ```
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T> implements OnInit, OnChanges {
  /**
   * Data array to display in the table
   */
  @Input() data: T[] = [];

  /**
   * Column configuration array
   */
  @Input() columns: TableColumn<T>[] = [];

  /**
   * Total number of items (for server-side pagination)
   */
  @Input() totalItems: number = 0;

  /**
   * Items per page
   */
  @Input() pageSize: number = 10;

  /**
   * Page size options for paginator
   */
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  /**
   * Loading state flag
   */
  @Input() loading: boolean = false;

  /**
   * Custom badge style mappings
   */
  @Input() badgeStyles: BadgeStyleMap = {};

  /**
   * Enable striped rows
   */
  @Input() striped: boolean = true;

  /**
   * Enable hover effect on rows
   */
  @Input() hoverEffect: boolean = true;

  /**
   * Make rows clickable
   */
  @Input() clickableRows: boolean = true;

  /**
   * Page change event
   */
  @Output() pageChange = new EventEmitter<PageEvent>();

  /**
   * Sort change event
   */
  @Output() sortChange = new EventEmitter<Sort>();

  /**
   * Row click event
   */
  @Output() rowClick = new EventEmitter<T>();

  /**
   * Action button click event
   */
  @Output() actionClick = new EventEmitter<{ action: string; row: T }>();

  /**
   * MatTable data source
   */
  dataSource = new MatTableDataSource<T>([]);

  /**
   * Displayed column keys
   */
  displayedColumns: string[] = [];

  /**
   * Reference to MatPaginator
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Reference to MatSort
   */
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Reference to MatTable
   */
  @ViewChild(MatTable) table!: MatTable<T>;

  /**
   * Component initialization
   */
  ngOnInit(): void {
    this.setupTable();
  }

  /**
   * Handle input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
    if (changes['columns']) {
      this.displayedColumns = this.columns.map((col) => String(col.key));
    }
  }

  /**
   * Setup table configuration
   */
  private setupTable(): void {
    // Update displayed columns
    this.displayedColumns = this.columns.map((col) => String(col.key));
    // Data will be set in ngOnChanges
    this.dataSource.data = this.data;
  }

  /**
   * Handle page change event
   */
  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  /**
   * Handle sort change event
   */
  onSortChange(event: Sort): void {
    this.sortChange.emit(event);
  }

  /**
   * Handle row click event
   */
  onRowClick(row: T, event?: Event): void {
    if (!this.clickableRows) return;
    // Prevent event if click is on action buttons
    if (event?.target instanceof HTMLElement) {
      if (
        event.target.closest('button') ||
        event.target.closest('[mat-icon-button]') ||
        event.target.closest('mat-icon')
      ) {
        return;
      }
    }
    this.rowClick.emit(row);
  }

  /**
   * Handle action button click
   */
  onActionClick(action: string, row: T, event: Event): void {
    event.stopPropagation();
    this.actionClick.emit({ action, row });
  }

  /**
   * Get badge CSS class for a badge value
   */
  getBadgeClass(value: string | number | boolean): string {
    const styleConfig = this.badgeStyles[String(value)];
    if (styleConfig) {
      return styleConfig.class;
    }
    // Default badge classes
    return this.getDefaultBadgeClass(value);
  }

  /**
   * Get default badge styling based on value
   */
  private getDefaultBadgeClass(value: string | number | boolean): string {
    const valueStr = String(value).toLowerCase();

    // Status badges
    if (
      valueStr === 'active' ||
      valueStr === 'success' ||
      valueStr === 'enabled'
    ) {
      return 'badge-success';
    }
    if (
      valueStr === 'inactive' ||
      valueStr === 'disabled' ||
      valueStr === 'pending'
    ) {
      return 'badge-warning';
    }
    if (
      valueStr === 'error' ||
      valueStr === 'failed' ||
      valueStr === 'revoked' ||
      valueStr === 'rejected'
    ) {
      return 'badge-danger';
    }
    if (valueStr === 'info' || valueStr === 'archived') {
      return 'badge-info';
    }

    return 'badge-default';
  }

  /**
   * Get formatted cell value
   */
  getCellValue(row: T, column: TableColumn<T>): any {
    const value = (row as any)[String(column.key)];
    if (column.format) {
      return column.format(value);
    }
    return value;
  }

  /**
   * Check if column is sortable
   */
  isSortable(column: TableColumn<T>): boolean {
    return column.sortable === true;
  }

  /**
   * Get column by key
   */
  getColumn(key: string): TableColumn<T> | undefined {
    return this.columns.find((col) => String(col.key) === key);
  }

  /**
   * Check if action should be visible for row
   */
  isActionVisible(action: TableAction, row: T): boolean {
    if (!action.visible) return true;
    return action.visible(row);
  }

  /**
   * Check if action should be disabled for row
   */
  isActionDisabled(action: TableAction, row: T): boolean {
    if (!action.disabled) return false;
    return action.disabled(row);
  }

  /**
   * Get row CSS classes
   */
  getRowClasses(): Record<string, boolean> {
    return {
      'hover-highlight': this.hoverEffect && this.clickableRows,
      striped: this.striped,
      clickable: this.clickableRows,
    };
  }

  /**
   * Convert value to string (for template usage)
   */
  toString(value: any): string {
    return String(value);
  }
}
