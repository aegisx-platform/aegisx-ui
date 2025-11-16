import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Snackbar } from './snackbar.service';

@Component({
  selector: 'ax-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class AxSnackbarComponent {
  @Input() snackbar!: Snackbar;
  @Output() dismiss = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<void>();

  get snackbarClasses(): string {
    const classes = ['ax-snackbar', `ax-snackbar-${this.snackbar.variant}`];
    return classes.join(' ');
  }

  onDismiss(): void {
    this.dismiss.emit();
  }

  onActionClick(): void {
    this.actionClick.emit();
    if (this.snackbar.action?.callback) {
      this.snackbar.action.callback();
    }
  }
}
