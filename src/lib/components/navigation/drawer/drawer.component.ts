import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

@Component({
  selector: 'ax-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class AxDrawerComponent {
  @Input() open = false;
  @Input() position: DrawerPosition = 'right';
  @Input() size: DrawerSize = 'md';
  @Input() closeable = true;
  @Input() closeOnOverlayClick = true;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();

  get drawerClasses(): string {
    const classes = [
      'ax-drawer',
      `ax-drawer-${this.position}`,
      `ax-drawer-${this.size}`,
    ];
    return classes.join(' ');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open && this.closeable) {
      this.onClose();
    }
  }

  onOverlayClick(): void {
    if (this.closeOnOverlayClick && this.closeable) {
      this.onClose();
    }
  }

  onDrawerClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onClose(): void {
    this.open = false;
    this.openChange.emit(false);
    this.close.emit();
  }
}
