import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MenuItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuItem[];
  action?: () => void;
}

@Component({
  selector: 'ax-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input() items: MenuItem[] = [];
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() itemClick = new EventEmitter<MenuItem>();

  activeSubmenu: number | null = null;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  toggle(): void {
    this.open = !this.open;
    this.openChange.emit(this.open);
  }

  close(): void {
    this.open = false;
    this.activeSubmenu = null;
    this.openChange.emit(false);
  }

  onItemClick(item: MenuItem, event: MouseEvent): void {
    if (item.disabled || item.divider) return;

    if (item.children && item.children.length > 0) {
      event.stopPropagation();
      return;
    }

    if (item.action) {
      item.action();
    }

    this.itemClick.emit(item);
    this.close();
  }

  toggleSubmenu(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.activeSubmenu = this.activeSubmenu === index ? null : index;
  }

  isSubmenuActive(index: number): boolean {
    return this.activeSubmenu === index;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
