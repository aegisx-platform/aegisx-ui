# Data Table Component

A reusable, generic table component built with Angular Material that provides a flexible foundation for displaying tabular data across the application.

## Features

- **Generic Type Support**: Works with any data type `<T>`
- **Dynamic Column Configuration**: Define columns with custom rendering and formatting
- **Pagination**: Built-in pagination with customizable page sizes
- **Sorting**: Server-side or client-side sorting support
- **Multiple Column Types**: Text, Date, Badge, Actions, and Custom rendering
- **Loading States**: Loading overlay with spinner
- **Event Emissions**: Page change, sort change, row click, and action click events
- **Responsive Design**: Mobile-friendly layout with TailwindCSS
- **Accessibility**: WCAG 2.1 compliant with proper ARIA attributes
- **Customization**: Custom cell formatting, CSS classes, and badge styling

## Usage

### Basic Setup

```typescript
import { DataTableComponent, TableColumn } from '@shared/components/data-table';

@Component({
  selector: 'app-users-list',
  template: ` <app-data-table [data]="users$ | async" [columns]="columns" [totalItems]="totalUsers$ | async" [loading]="loading$ | async" (pageChange)="onPageChange($event)" (sortChange)="onSortChange($event)" (rowClick)="onRowClick($event)"></app-data-table> `,
  imports: [DataTableComponent],
})
export class UsersListComponent {
  columns: TableColumn[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
  ];
}
```

## Inputs

| Input             | Type               | Default                | Description                    |
| ----------------- | ------------------ | ---------------------- | ------------------------------ |
| `data`            | `T[]`              | `[]`                   | Data array to display in table |
| `columns`         | `TableColumn<T>[]` | `[]`                   | Column configuration array     |
| `totalItems`      | `number`           | `0`                    | Total items for pagination     |
| `pageSize`        | `number`           | `10`                   | Items per page                 |
| `pageSizeOptions` | `number[]`         | `[5, 10, 25, 50, 100]` | Available page size options    |
| `loading`         | `boolean`          | `false`                | Loading state flag             |
| `badgeStyles`     | `BadgeStyleMap`    | `{}`                   | Custom badge style mappings    |
| `striped`         | `boolean`          | `true`                 | Enable striped rows            |
| `hoverEffect`     | `boolean`          | `true`                 | Enable hover effect on rows    |
| `clickableRows`   | `boolean`          | `true`                 | Make rows clickable            |

## Outputs

| Output        | Type                                     | Description                              |
| ------------- | ---------------------------------------- | ---------------------------------------- |
| `pageChange`  | `EventEmitter<PageEvent>`                | Fired when page changes                  |
| `sortChange`  | `EventEmitter<Sort>`                     | Fired when sort column/direction changes |
| `rowClick`    | `EventEmitter<T>`                        | Fired when row is clicked                |
| `actionClick` | `EventEmitter<{action: string, row: T}>` | Fired when action button is clicked      |

## Column Configuration

### TableColumn Interface

```typescript
interface TableColumn<T = any> {
  // Property name to bind to data object
  key: keyof T | string;

  // Display header text
  header: string;

  // Column type: 'text' (default), 'date', 'badge', 'actions'
  type?: 'text' | 'date' | 'badge' | 'actions' | 'custom';

  // Enable sorting for this column
  sortable?: boolean;

  // Custom formatter function
  format?: (value: any) => string;

  // Custom CSS classes
  cssClass?: string;

  // Actions for action columns
  actions?: TableAction[];

  // Column width (CSS value)
  width?: string;
}
```

### TableAction Interface

```typescript
interface TableAction {
  // Button label (tooltip)
  label: string;

  // Material icon name
  icon?: string;

  // Action identifier
  action: string;

  // Button color: 'primary', 'accent', 'warn'
  color?: 'primary' | 'accent' | 'warn';

  // Disable based on condition
  disabled?: (row: any) => boolean;

  // Show/hide based on condition
  visible?: (row: any) => boolean;
}
```

## Examples

### With Formatting and Custom Styling

```typescript
columns: TableColumn[] = [
  {
    key: 'id',
    header: 'ID',
    sortable: true,
    width: '80px',
    cssClass: 'text-center'
  },
  {
    key: 'createdAt',
    header: 'Created',
    type: 'date',
    sortable: true,
    format: (value) => new Date(value).toLocaleDateString()
  },
  {
    key: 'status',
    header: 'Status',
    type: 'badge',
    sortable: true
  },
  {
    key: 'actions',
    header: 'Actions',
    type: 'actions',
    width: '120px',
    actions: [
      {
        label: 'Edit',
        icon: 'edit',
        action: 'edit',
        color: 'primary'
      },
      {
        label: 'Delete',
        icon: 'delete',
        action: 'delete',
        color: 'warn',
        disabled: (row) => row.status === 'archived'
      }
    ]
  }
];
```

### With Badge Styling

```typescript
export class MyComponent implements OnInit {
  badgeStyles: BadgeStyleMap = {
    active: { class: 'badge-success', label: 'Active' },
    inactive: { class: 'badge-warning', label: 'Inactive' },
    error: { class: 'badge-danger', label: 'Error' },
  };

  onInit() {
    // Use in template
    // <app-data-table [badgeStyles]="badgeStyles"></app-data-table>
  }
}
```

### With Event Handling

```typescript
export class DataListComponent {
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSortChange(event: Sort): void {
    this.sortBy = event.active;
    this.sortOrder = event.direction;
    this.loadData();
  }

  onRowClick(row: User): void {
    this.router.navigate(['/users', row.id]);
  }

  onActionClick(event: { action: string; row: User }): void {
    switch (event.action) {
      case 'edit':
        this.openEditDialog(event.row);
        break;
      case 'delete':
        this.deleteUser(event.row);
        break;
    }
  }
}
```

## Styling

The component uses SCSS for styling with responsive design. Key CSS classes:

- `.data-table-container` - Main container
- `.loading-overlay` - Loading indicator overlay
- `.data-table` - Table element
- `.header-row` - Header row styling
- `.data-row` - Data row styling
- `.cell-badge` - Badge cell styling
- `.action-button` - Action button styling

### Badge Style Classes

- `.badge-success` - Green badge (active, success, enabled)
- `.badge-warning` - Yellow badge (inactive, pending, disabled)
- `.badge-danger` - Red badge (error, failed, revoked)
- `.badge-info` - Blue badge (info, archived)
- `.badge-default` - Gray badge (default)

## Responsive Behavior

The table is fully responsive:

- **Desktop**: Full table with all features
- **Tablet**: Reduced padding, smaller icons
- **Mobile**: Adjusted font sizes, compact actions

## Accessibility

- Proper ARIA attributes on interactive elements
- Keyboard navigation support
- Focus indicators on interactive elements
- Screen reader friendly
- Semantic HTML structure

## Performance Considerations

- Uses `ChangeDetectionStrategy.OnPush` for performance
- Works with both server-side and client-side data
- Efficient pagination and sorting
- Proper unsubscription handling

## Related Components

- See `ErrorLogsListPage` for a complete example
- See `ActivityLogsListPage` for timeline variant

## Browser Support

- Chrome/Edge latest
- Firefox latest
- Safari latest
- Mobile browsers (iOS Safari, Chrome Mobile)
