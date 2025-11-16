import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SnackbarVariant =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'default';
export type SnackbarPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface SnackbarConfig {
  message: string;
  variant?: SnackbarVariant;
  duration?: number;
  closeable?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface Snackbar extends SnackbarConfig {
  id: string;
  variant: SnackbarVariant;
  duration: number;
  closeable: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackbars$ = new BehaviorSubject<Snackbar[]>([]);
  private idCounter = 0;

  getSnackbars() {
    return this.snackbars$.asObservable();
  }

  show(config: SnackbarConfig): string {
    const id = `snackbar-${++this.idCounter}`;
    const snackbar: Snackbar = {
      id,
      message: config.message,
      variant: config.variant || 'default',
      duration: config.duration ?? 3000,
      closeable: config.closeable ?? true,
      action: config.action,
    };

    const current = this.snackbars$.value;
    this.snackbars$.next([...current, snackbar]);

    if (snackbar.duration > 0) {
      setTimeout(() => this.dismiss(id), snackbar.duration);
    }

    return id;
  }

  success(message: string, duration = 3000): string {
    return this.show({ message, variant: 'success', duration });
  }

  error(message: string, duration = 5000): string {
    return this.show({ message, variant: 'error', duration });
  }

  warning(message: string, duration = 4000): string {
    return this.show({ message, variant: 'warning', duration });
  }

  info(message: string, duration = 3000): string {
    return this.show({ message, variant: 'info', duration });
  }

  dismiss(id: string): void {
    const current = this.snackbars$.value;
    this.snackbars$.next(current.filter((s) => s.id !== id));
  }

  clear(): void {
    this.snackbars$.next([]);
  }
}
