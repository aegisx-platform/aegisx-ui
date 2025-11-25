import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Simple Dialog Example
 *
 * Demonstrates:
 * - Basic dialog structure using mat-dialog directives
 * - Global AegisX dialog styles (no component styles needed)
 * - Tailwind classes working with Material directives
 */
@Component({
  selector: 'app-simple-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-3 text-xl font-semibold">
      <mat-icon class="text-info">info</mat-icon>
      Information Dialog
    </h2>

    <mat-dialog-content>
      <p class="text-md text-secondary mb-4">
        This is a simple information dialog using Material Dialog with global
        AegisX styles.
      </p>
      <p class="text-md text-secondary">
        Notice how we use Tailwind classes directly without any
        component-specific styles. The global styles from
        <code>_dialog-shared.scss</code> provide consistent spacing and
        appearance.
      </p>
    </mat-dialog-content>

    <div mat-dialog-actions align="end" class="flex gap-2">
      <button mat-button mat-dialog-close>Close</button>
      <button mat-flat-button color="primary" mat-dialog-close>Got it</button>
    </div>
  `,
  styles: [], // No styles needed! Global styles handle everything
})
export class SimpleDialogComponent {}
