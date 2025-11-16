import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'ax-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() striped = false;
  @Input() bordered = false;
  @Input() hoverable = true;

  get tableClasses(): string {
    const classes = ['ax-table'];
    if (this.striped) classes.push('ax-table-striped');
    if (this.bordered) classes.push('ax-table-bordered');
    if (this.hoverable) classes.push('ax-table-hoverable');
    return classes.join(' ');
  }

  trackByIndex(index: number): number {
    return index;
  }
}
