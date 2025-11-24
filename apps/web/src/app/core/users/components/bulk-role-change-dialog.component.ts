import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService, Role } from '../services/user.service';

interface BulkRoleChangeDialogData {
  selectedUserCount: number;
}

@Component({
  selector: 'ax-bulk-role-change-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title class="ax-header ax-header-info">
      <div class="ax-icon-info">
        <mat-icon>admin_panel_settings</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Change User Roles</div>
        <div class="ax-subtitle">Assign new roles to selected users</div>
      </div>
      <button
        type="button"
        mat-icon-button
        [mat-dialog-close]="false"
        [disabled]="isSubmitting()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <mat-dialog-content class="mat-dialog-content">
      <p class="dialog-description">
        You are about to change the roles of
        <strong>{{ data.selectedUserCount }} user(s)</strong>.
      </p>

      <form [formGroup]="roleForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Select Roles</mat-label>
          <mat-select formControlName="roleIds" multiple>
            @for (role of roles; track role.id) {
              <mat-option [value]="role.id">
                {{ role.name }}
              </mat-option>
            }
          </mat-select>
          <mat-error *ngIf="roleForm.get('roleIds')?.hasError('required')">
            At least one role is required
          </mat-error>
        </mat-form-field>
      </form>

      <div class="warning-box">
        <mat-icon class="warning-icon">warning</mat-icon>
        <span class="warning-text"
          ><strong>⚠️ CRITICAL:</strong> All existing roles will be
          <strong>PERMANENTLY REPLACED</strong> with the selected roles only.
          Users will lose all current permissions and must re-authenticate. This
          action cannot be undone.</span
        >
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button
        mat-button
        type="button"
        (click)="onCancel()"
        [disabled]="isSubmitting()"
      >
        Cancel
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="roleForm.invalid || isSubmitting()"
      >
        @if (isSubmitting()) {
          <mat-spinner diameter="20" class="spinner-inline"></mat-spinner>
        }
        Change Roles
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .mat-dialog-content {
        max-height: 80vh;
        overflow-y: auto;
        padding: var(--ax-spacing-xl);
        min-width: 400px;
      }

      .dialog-description {
        margin-bottom: var(--ax-spacing-lg);
        color: var(--ax-text-default);
      }

      .full-width {
        width: 100%;
        margin-bottom: var(--ax-spacing-sm);
      }

      .warning-box {
        margin-top: var(--ax-spacing-lg);
        padding: var(--ax-spacing-md);
        background-color: var(--ax-error-subtle);
        border: 1px solid var(--ax-error-muted);
        border-radius: var(--ax-radius-md);
        font-size: var(--ax-font-size-sm);
        display: flex;
        align-items: flex-start;
        gap: var(--ax-spacing-sm);
      }

      .warning-icon {
        color: var(--ax-error-emphasis);
        flex-shrink: 0;
      }

      .warning-text {
        flex: 1;
        color: var(--ax-text-default);
      }

      .spinner-inline {
        display: inline-block;
        margin-right: var(--ax-spacing-sm);
      }

      @media (max-width: 768px) {
        .mat-dialog-content {
          min-width: auto;
        }
      }
    `,
  ],
})
export class BulkRoleChangeDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<BulkRoleChangeDialogComponent>);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  data = inject<BulkRoleChangeDialogData>(MAT_DIALOG_DATA);

  roles: Role[] = [];
  isSubmitting = () => false;

  roleForm = this.fb.group({
    roleIds: [[], Validators.required],
  });

  ngOnInit(): void {
    this.loadRoles();
  }

  private async loadRoles(): Promise<void> {
    try {
      this.roles = await this.userService.getRoles();
    } catch (error) {
      this.snackBar.open('Failed to load roles', 'Close', { duration: 3000 });
    }
  }

  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const roleIds = (this.roleForm.value?.roleIds ?? []) as string[];
    if (!roleIds || roleIds.length === 0) return;

    this.dialogRef.close(roleIds);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
