import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import {
  Snackbar,
  SnackbarPosition,
  SnackbarService,
} from './snackbar.service';
import { SnackbarComponent } from './snackbar.component';

@Component({
  selector: 'ax-snackbar-container',
  standalone: true,
  imports: [CommonModule, SnackbarComponent],
  templateUrl: './snackbar-container.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarContainerComponent implements OnInit {
  @Input() position: SnackbarPosition = 'top-right';
  snackbars$!: Observable<Snackbar[]>;

  constructor(private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.snackbars$ = this.snackbarService.getSnackbars();
  }

  get containerClasses(): string {
    const classes = [
      'ax-snackbar-container',
      `ax-snackbar-container-${this.position}`,
    ];
    return classes.join(' ');
  }

  onDismiss(id: string): void {
    this.snackbarService.dismiss(id);
  }

  trackBySnackbar(_index: number, snackbar: Snackbar): string {
    return snackbar.id;
  }
}
