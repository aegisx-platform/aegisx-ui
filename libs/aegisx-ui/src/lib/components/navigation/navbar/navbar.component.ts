import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavbarItem {
  label: string;
  url?: string;
  icon?: string;
  active?: boolean;
}

@Component({
  selector: 'ax-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() brand = '';
  @Input() items: NavbarItem[] = [];
  @Input() sticky = false;
  @Output() itemClick = new EventEmitter<NavbarItem>();

  mobileMenuOpen = false;

  get navbarClasses(): string {
    const classes = ['ax-navbar'];
    if (this.sticky) classes.push('ax-navbar-sticky');
    return classes.join(' ');
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  onItemClick(item: NavbarItem, event: MouseEvent): void {
    if (item.url) {
      event.preventDefault();
      this.itemClick.emit(item);
    }
    this.mobileMenuOpen = false;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
