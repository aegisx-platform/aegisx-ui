import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'ax-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class AxDialogComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() size: DialogSize = 'md';
  @Input() closeable = true;
  @Input() closeOnOverlayClick = true;
  @Output() close = new EventEmitter<void>();
  @Output() openChange = new EventEmitter<boolean>();

  get dialogClasses(): string {
    const classes = ['ax-dialog', `ax-dialog-${this.size}`];
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

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onClose(): void {
    this.open = false;
    this.openChange.emit(false);
    this.close.emit();
  }
}
