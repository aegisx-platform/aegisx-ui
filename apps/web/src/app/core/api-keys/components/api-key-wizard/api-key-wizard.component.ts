import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  CreateApiKeyData,
  EXPIRATION_OPTIONS,
  AVAILABLE_PERMISSION_GROUPS,
  ApiKeyPermission,
  PermissionGroup,
} from './api-key-wizard.types';
import { ApiKeysService } from '../../services/api-keys.service';
import {
  GenerateApiKeyRequest,
  GeneratedApiKey,
} from '../../models/api-keys.types';

@Component({
  selector: 'app-api-key-wizard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './api-key-wizard.component.html',
  styleUrl: './api-key-wizard.component.scss',
})
export class ApiKeyWizardComponent {
  private fb = inject(FormBuilder);
  private apiKeysService = inject(ApiKeysService);
  private snackBar = inject(MatSnackBar);
  private clipboard = inject(Clipboard);
  private dialogRef = inject(MatDialogRef<ApiKeyWizardComponent>);

  // State signals
  currentStep = signal(0);
  wizardData = signal<CreateApiKeyData>({});
  creating = signal(false);
  keyCopied = signal(false);

  // Forms for each step
  detailsForm: FormGroup;
  permissionsForm: FormGroup;

  // UI data
  expirationOptions = EXPIRATION_OPTIONS;
  permissionGroups = AVAILABLE_PERMISSION_GROUPS;
  selectedPermissions = signal<ApiKeyPermission[]>([]);

  constructor() {
    this.detailsForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      expiryOption: ['90', Validators.required],
      customExpireDays: [
        { value: null, disabled: true },
        [Validators.min(1), Validators.max(3650)],
      ],
    });

    this.permissionsForm = this.fb.group({
      permissions: [[]],
    });

    // Watch expiry option to enable/disable custom field
    this.detailsForm.get('expiryOption')?.valueChanges.subscribe((value) => {
      const customField = this.detailsForm.get('customExpireDays');
      if (value === 'custom') {
        customField?.enable();
        customField?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(3650),
        ]);
      } else {
        customField?.disable();
        customField?.clearValidators();
      }
      customField?.updateValueAndValidity();
    });
  }

  /**
   * Get all permissions as a flat list
   */
  getAllPermissions(): ApiKeyPermission[] {
    return this.permissionGroups.flatMap((g) => g.permissions);
  }

  /**
   * Check if a permission is selected
   */
  isPermissionSelected(permission: ApiKeyPermission): boolean {
    return this.selectedPermissions().some((p) => p.id === permission.id);
  }

  /**
   * Toggle permission selection
   */
  togglePermission(permission: ApiKeyPermission): void {
    const current = this.selectedPermissions();
    if (this.isPermissionSelected(permission)) {
      this.selectedPermissions.set(
        current.filter((p) => p.id !== permission.id),
      );
    } else {
      this.selectedPermissions.set([...current, permission]);
    }
  }

  /**
   * Check if all permissions in a group are selected
   */
  areAllGroupPermissionsSelected(group: PermissionGroup): boolean {
    return group.permissions.every((p) => this.isPermissionSelected(p));
  }

  /**
   * Toggle all permissions in a group
   */
  toggleGroupPermissions(group: PermissionGroup): void {
    const allSelected = this.areAllGroupPermissionsSelected(group);
    if (allSelected) {
      this.selectedPermissions.set(
        this.selectedPermissions().filter(
          (p) => !group.permissions.some((gp) => gp.id === p.id),
        ),
      );
    } else {
      const missing = group.permissions.filter(
        (p) => !this.isPermissionSelected(p),
      );
      this.selectedPermissions.set([...this.selectedPermissions(), ...missing]);
    }
  }

  /**
   * Move to next step
   */
  nextStep(): void {
    if (this.currentStep() === 0 && !this.detailsForm.valid) {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        panelClass: ['bg-orange-500'],
      });
      return;
    }

    if (this.currentStep() < 2) {
      this.currentStep.update((step) => step + 1);
    }
  }

  /**
   * Move to previous step
   */
  previousStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update((step) => step - 1);
    }
  }

  /**
   * Create the API key
   */
  createKey(): void {
    if (!this.detailsForm.valid) {
      this.snackBar.open('Please complete all required fields', 'Close', {
        duration: 3000,
        panelClass: ['bg-orange-500'],
      });
      return;
    }

    this.creating.set(true);

    const formValue = this.detailsForm.value;
    const expiryDays = this.getExpiryDays(
      formValue.expiryOption,
      formValue.customExpireDays,
    );

    const request: GenerateApiKeyRequest = {
      name: formValue.name,
      description: formValue.description || undefined,
      expiryDays: expiryDays || undefined,
      scopes:
        this.selectedPermissions().length > 0
          ? this.selectedPermissions().map((p) => ({
              resource: p.resource,
              actions: p.actions,
            }))
          : undefined,
    };

    this.apiKeysService.generateKey(request).subscribe({
      next: (result: GeneratedApiKey) => {
        this.creating.set(false);
        this.wizardData.set({
          ...this.wizardData(),
          generatedKey: {
            id: result.apiKey.id,
            fullKey: result.fullKey,
            preview: result.preview,
            name: result.apiKey.name,
            expires_at: result.apiKey.expires_at,
            scopes: result.apiKey.scopes,
          },
        });
        this.currentStep.set(3); // Move to success step
        this.snackBar.open('API Key created successfully!', 'Close', {
          duration: 3000,
          panelClass: ['bg-green-500'],
        });
      },
      error: (error) => {
        this.creating.set(false);
        this.snackBar.open(
          error.message || 'Failed to create API key',
          'Close',
          {
            duration: 5000,
            panelClass: ['bg-red-500'],
          },
        );
      },
    });
  }

  /**
   * Copy generated key to clipboard
   */
  copyToClipboard(text: string): void {
    const success = this.clipboard.copy(text);
    if (success) {
      this.keyCopied.set(true);
      this.snackBar.open('API Key copied to clipboard!', 'Close', {
        duration: 2000,
      });
      setTimeout(() => this.keyCopied.set(false), 2000);
    } else {
      this.snackBar.open('Failed to copy to clipboard', 'Close', {
        duration: 3000,
        panelClass: ['bg-red-500'],
      });
    }
  }

  /**
   * Close the dialog
   */
  close(): void {
    this.dialogRef.close(this.wizardData());
  }

  /**
   * Cancel the wizard
   */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /**
   * Calculate expiry days from option
   */
  private getExpiryDays(
    option: string,
    customDays?: number,
  ): number | undefined {
    if (option === 'custom') {
      return customDays;
    }
    if (option === 'never') {
      return undefined;
    }
    return parseInt(option, 10);
  }

  /**
   * Format date for display
   */
  formatDate(date: string | null | undefined): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Get expiry label
   */
  getExpiryLabel(option: string): string {
    const opt = this.expirationOptions.find((o) => o.value === option);
    return opt ? opt.label : 'Custom';
  }
}
