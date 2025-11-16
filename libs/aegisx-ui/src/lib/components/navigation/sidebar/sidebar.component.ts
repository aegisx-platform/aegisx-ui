import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SidebarItem {
  label: string;
  icon?: string;
  url?: string;
  active?: boolean;
  children?: SidebarItem[];
}

export type SidebarPosition = 'left' | 'right';

@Component({
  selector: 'ax-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class AxSidebarComponent {
  @Input() items: SidebarItem[] = [];
  @Input() collapsed = false;
  @Input() position: SidebarPosition = 'left';
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() itemClick = new EventEmitter<SidebarItem>();

  expandedItems: Set<number> = new Set();

  get sidebarClasses(): string {
    const classes = ['ax-sidebar', `ax-sidebar-${this.position}`];
    if (this.collapsed) classes.push('ax-sidebar-collapsed');
    return classes.join(' ');
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  toggleExpanded(index: number): void {
    if (this.expandedItems.has(index)) {
      this.expandedItems.delete(index);
    } else {
      this.expandedItems.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedItems.has(index);
  }

  onItemClick(item: SidebarItem): void {
    this.itemClick.emit(item);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
