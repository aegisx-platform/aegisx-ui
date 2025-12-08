import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

// Types imported from the user service
interface UserRole {
  id: string;
  roleId: string;
  roleName: string;
  assignedAt: string;
  assignedBy?: string;
  expiresAt?: string;
  isActive: boolean;
}

interface RoleAssignmentInfoData {
  userName: string;
  userEmail: string;
  roles: UserRole[];
}

@Component({
  selector: 'ax-role-assignment-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  template: `
    <div class="modal-container">
      <!-- Header -->
      <h2 mat-dialog-title class="ax-header ax-header-info">
        <div class="ax-icon-info">
          <mat-icon>assignment</mat-icon>
        </div>
        <div class="header-text">
          <div class="ax-title">Role Assignment Details</div>
          <div class="ax-subtitle">View detailed role information</div>
        </div>
        <button type="button" mat-icon-button (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
      </h2>

      <!-- User Info -->
      <mat-dialog-content class="modal-content">
        <div class="user-section">
          <h3 class="section-title">User Information</h3>
          <div class="user-info-grid">
            <div class="info-item">
              <label>Name</label>
              <p class="info-value">{{ data.userName }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p class="info-value email-value">
                {{ data.userEmail }}
              </p>
            </div>
            <div class="info-item">
              <label>Total Roles</label>
              <p class="info-value total-roles">{{ data.roles.length }}</p>
            </div>
          </div>
        </div>

        <!-- Roles Assignment List -->
        <div class="roles-section">
          <h3 class="section-title">Assigned Roles</h3>

          @if (data.roles && data.roles.length > 0) {
            <div class="roles-list">
              @for (role of data.roles; track role.id) {
                <div
                  class="role-card"
                  [ngClass]="{ 'role-inactive': !role.isActive }"
                >
                  <!-- Role Name and Status -->
                  <div class="role-header">
                    <div class="role-name-status">
                      <h4 class="role-name">{{ role.roleName | titlecase }}</h4>
                      <span
                        *ngIf="!role.isActive"
                        class="status-badge status-inactive"
                      >
                        Inactive
                      </span>
                      <span
                        *ngIf="role.isActive"
                        class="status-badge status-active"
                      >
                        Active
                      </span>
                    </div>
                    <div class="role-id-copy">
                      <code class="role-id" [title]="role.roleId">
                        {{ role.roleId | slice: 0 : 8 }}...
                      </code>
                      <button
                        mat-icon-button
                        [matTooltip]="'Copy role ID'"
                        (click)="copyToClipboard(role.roleId)"
                        class="copy-btn"
                      >
                        <mat-icon>content_copy</mat-icon>
                      </button>
                    </div>
                  </div>

                  <!-- Assignment Details -->
                  <div class="role-details">
                    <!-- Assigned At -->
                    <div class="detail-row">
                      <div class="detail-label">
                        <mat-icon class="detail-icon">schedule</mat-icon>
                        Assigned At
                      </div>
                      <div class="detail-value">
                        {{ formatDate(role.assignedAt) }}
                      </div>
                    </div>

                    <!-- Assigned By -->
                    @if (role.assignedBy) {
                      <div class="detail-row">
                        <div class="detail-label">
                          <mat-icon class="detail-icon">person</mat-icon>
                          Assigned By
                        </div>
                        <div class="detail-value">
                          {{ role.assignedBy }}
                        </div>
                      </div>
                    }

                    <!-- Expires At -->
                    @if (role.expiresAt) {
                      <div class="detail-row">
                        <div class="detail-label">
                          <mat-icon class="detail-icon">access_time</mat-icon>
                          Expires At
                        </div>
                        <div class="detail-value">
                          {{ formatDate(role.expiresAt) }}
                          @if (isExpired(role.expiresAt)) {
                            <span class="expiry-warning">
                              <mat-icon>warning</mat-icon>
                              Expired
                            </span>
                          } @else if (isExpiringSoon(role.expiresAt)) {
                            <span class="expiry-notice">
                              <mat-icon>info</mat-icon>
                              Expiring Soon
                            </span>
                          }
                        </div>
                      </div>
                    } @else {
                      <div class="detail-row">
                        <div class="detail-label">
                          <mat-icon class="detail-icon">access_time</mat-icon>
                          Expires At
                        </div>
                        <div class="detail-value no-expiration">
                          No expiration
                        </div>
                      </div>
                    }

                    <!-- Assignment ID -->
                    <div class="detail-row">
                      <div class="detail-label">
                        <mat-icon class="detail-icon">fingerprint</mat-icon>
                        Assignment ID
                      </div>
                      <div class="detail-value">
                        <code class="assignment-id" [title]="role.id">
                          {{ role.id | slice: 0 : 8 }}...
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="empty-state">
              <mat-icon>person_off</mat-icon>
              <p>No roles assigned to this user</p>
            </div>
          }
        </div>
      </mat-dialog-content>

      <!-- Footer -->
      <mat-dialog-actions align="end">
        <button mat-button (click)="onClose()">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .modal-container {
        display: flex;
        flex-direction: column;
        min-width: 600px;
        max-width: 800px;
      }

      .modal-content {
        max-height: 70vh;
        overflow-y: auto;
        padding: var(--ax-spacing-xl);
      }

      /* User Section */
      .user-section {
        margin-bottom: var(--ax-spacing-2xl);
      }

      .section-title {
        font-size: var(--ax-font-size-sm);
        font-weight: var(--ax-font-weight-semibold);
        color: var(--ax-text-subtle);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 var(--ax-spacing-lg) 0;
      }

      .user-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: var(--ax-spacing-lg);
      }

      .info-item {
        padding: var(--ax-spacing-md);
        background-color: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
        border: 1px solid var(--ax-border-default);
      }

      .info-item label {
        display: block;
        font-size: var(--ax-font-size-xs);
        font-weight: var(--ax-font-weight-semibold);
        color: var(--ax-text-subtle);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: var(--ax-spacing-sm);
      }

      .info-value {
        margin: 0;
        font-size: var(--ax-font-size-sm);
        color: var(--ax-text-heading);
        word-break: break-word;
      }

      .email-value {
        color: var(--ax-brand-default);
      }

      .total-roles {
        font-weight: var(--ax-font-weight-semibold);
      }

      /* Roles Section */
      .roles-section {
        margin-bottom: var(--ax-spacing-lg);
      }

      .roles-list {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-lg);
      }

      .role-card {
        padding: var(--ax-spacing-lg);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        background-color: var(--ax-background-default);
        transition: all 0.2s ease;
      }

      .role-card:hover {
        border-color: var(--ax-brand-default);
        box-shadow: var(--ax-shadow-md);
      }

      .role-card.role-inactive {
        opacity: 0.7;
        background-color: var(--ax-background-muted);
      }

      .role-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--ax-spacing-lg);
        padding-bottom: var(--ax-spacing-lg);
        border-bottom: 1px solid var(--ax-border-default);
      }

      .role-name-status {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
      }

      .role-name {
        margin: 0;
        font-size: var(--ax-font-size-md);
        font-weight: var(--ax-font-weight-semibold);
        color: var(--ax-text-heading);
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: var(--ax-spacing-xs);
        padding: var(--ax-spacing-xs) var(--ax-spacing-md);
        border-radius: var(--ax-radius-full);
        font-size: var(--ax-font-size-xs);
        font-weight: var(--ax-font-weight-semibold);
      }

      .status-active {
        background-color: var(--ax-success-subtle);
        color: var(--ax-success-emphasis);
      }

      .status-inactive {
        background-color: var(--ax-error-subtle);
        color: var(--ax-error-emphasis);
      }

      .role-id-copy {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
      }

      .role-id,
      .assignment-id {
        padding: var(--ax-spacing-xs) var(--ax-spacing-sm);
        background-color: var(--ax-background-subtle);
        border-radius: var(--ax-radius-sm);
        font-size: var(--ax-font-size-xs);
        font-family: var(--ax-font-mono);
        color: var(--ax-text-subtle);
      }

      .copy-btn {
        width: 32px;
        height: 32px;
        color: var(--ax-text-subtle);
      }

      .copy-btn:hover {
        color: var(--ax-brand-default);
        background-color: var(--ax-brand-subtle);
      }

      /* Role Details */
      .role-details {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-md);
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--ax-spacing-lg);
      }

      .detail-label {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
        min-width: 140px;
        font-size: var(--ax-font-size-sm);
        font-weight: var(--ax-font-weight-medium);
        color: var(--ax-text-subtle);
      }

      .detail-icon {
        font-size: 1.125rem;
        width: 1.125rem;
        height: 1.125rem;
        color: var(--ax-text-disabled);
      }

      .detail-value {
        flex: 1;
        font-size: var(--ax-font-size-sm);
        color: var(--ax-text-heading);
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
      }

      .no-expiration {
        color: var(--ax-text-subtle);
      }

      .expiry-warning {
        display: inline-flex;
        align-items: center;
        gap: var(--ax-spacing-xs);
        padding: var(--ax-spacing-xs) var(--ax-spacing-sm);
        background-color: var(--ax-error-subtle);
        color: var(--ax-error-emphasis);
        border-radius: var(--ax-radius-sm);
        font-size: var(--ax-font-size-xs);
        font-weight: var(--ax-font-weight-semibold);
      }

      .expiry-warning mat-icon {
        width: 1rem;
        height: 1rem;
        font-size: 1rem;
      }

      .expiry-notice {
        display: inline-flex;
        align-items: center;
        gap: var(--ax-spacing-xs);
        padding: var(--ax-spacing-xs) var(--ax-spacing-sm);
        background-color: var(--ax-warning-subtle);
        color: var(--ax-warning-emphasis);
        border-radius: var(--ax-radius-sm);
        font-size: var(--ax-font-size-xs);
        font-weight: var(--ax-font-weight-semibold);
      }

      .expiry-notice mat-icon {
        width: 1rem;
        height: 1rem;
        font-size: 1rem;
      }

      /* Empty State */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--ax-spacing-2xl);
        color: var(--ax-text-disabled);
        text-align: center;
      }

      .empty-state mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: var(--ax-spacing-lg);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .modal-container {
          min-width: 90vw;
          max-width: 90vw;
        }

        .role-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .detail-row {
          flex-direction: column;
        }

        .user-info-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class RoleAssignmentInfoModalComponent {
  private dialogRef = inject(MatDialogRef<RoleAssignmentInfoModalComponent>);
  data = inject<RoleAssignmentInfoData>(MAT_DIALOG_DATA);

  /**
   * Formats date string to readable format
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Check if role assignment has expired
   */
  isExpired(expiresAt: string | undefined): boolean {
    if (!expiresAt) return false;
    try {
      return new Date(expiresAt) < new Date();
    } catch {
      return false;
    }
  }

  /**
   * Check if role assignment will expire within 7 days
   */
  isExpiringSoon(expiresAt: string | undefined): boolean {
    if (!expiresAt) return false;
    try {
      const expiryDate = new Date(expiresAt);
      const now = new Date();
      const daysUntilExpiry =
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
    } catch {
      return false;
    }
  }

  /**
   * Copy text to clipboard
   */
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // Could show a snackbar notification here
      console.log('Copied to clipboard:', text);
    });
  }

  /**
   * Close the modal
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
