import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

/**
 * Form Dialog Example
 *
 * Demonstrates:
 * - Form handling within dialogs
 * - Using .form-compact for proper field sizing
 * - Form validation and error display
 * - Returning form data via afterClosed()
 */
@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-3 text-xl font-semibold">
      <mat-icon class="text-brand">edit_note</mat-icon>
      Edit User Profile
    </h2>

    <mat-dialog-content>
      <div class="form-compact">
        <form [formGroup]="form" class="flex flex-col gap-4">
          <!-- Full Name -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Full Name <span class="text-error">*</span></mat-label>
            <mat-icon matPrefix>person</mat-icon>
            <input matInput formControlName="fullName" placeholder="John Doe" />
            @if (
              form.get('fullName')?.hasError('required') &&
              form.get('fullName')?.touched
            ) {
              <mat-error>Full name is required</mat-error>
            }
          </mat-form-field>

          <!-- Email -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Email <span class="text-error">*</span></mat-label>
            <mat-icon matPrefix>email</mat-icon>
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="john@example.com"
            />
            @if (
              form.get('email')?.hasError('required') &&
              form.get('email')?.touched
            ) {
              <mat-error>Email is required</mat-error>
            }
            @if (
              form.get('email')?.hasError('email') && form.get('email')?.touched
            ) {
              <mat-error>Please enter a valid email</mat-error>
            }
          </mat-form-field>

          <!-- Role -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Role</mat-label>
            <mat-icon matPrefix>badge</mat-icon>
            <mat-select formControlName="role">
              <mat-option value="admin">Administrator</mat-option>
              <mat-option value="user">User</mat-option>
              <mat-option value="viewer">Viewer</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Bio -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Bio</mat-label>
            <textarea
              matInput
              formControlName="bio"
              rows="3"
              placeholder="Tell us about yourself..."
            ></textarea>
            <mat-hint>Optional description (max 200 characters)</mat-hint>
          </mat-form-field>
        </form>
      </div>
    </mat-dialog-content>

    <div mat-dialog-actions align="end" class="flex gap-2">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-flat-button
        color="primary"
        [disabled]="!form.valid"
        (click)="onSave()"
      >
        <mat-icon>save</mat-icon>
        Save Changes
      </button>
    </div>
  `,
  styles: [], // No styles needed! Global styles + .form-compact handle everything
})
export class FormDialogComponent {
  private dialogRef = inject(MatDialogRef<FormDialogComponent>);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user'],
    bio: [''],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
