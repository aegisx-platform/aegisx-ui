import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NotificationService } from '../services/notifications.service';
import { CreateNotificationRequest } from '../types/notification.types';

@Component({
  selector: 'app-notifications-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatOptionModule,
  ],
  template: `
    <div class="create-dialog">
      <h2 mat-dialog-title>Create Notifications</h2>
      
      <mat-dialog-content>
        <form [formGroup]="createForm" class="create-form">

          <!-- user_id Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>User</mat-label>
            <mat-select formControlName="user_id">
              <mat-option *ngFor="let user of userOptions" [value]="user.value">
                {{ user.label }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="createForm.get('user_id')?.hasError('required')">
              User is required
            </mat-error>
          </mat-form-field>

          <!-- type Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="info">Info</mat-option>
              <mat-option value="warning">Warning</mat-option>
              <mat-option value="error">Error</mat-option>
            </mat-select>
            <mat-error *ngIf="createForm.get('type')?.hasError('required')">
              Type is required
            </mat-error>
          </mat-form-field>
          <!-- title Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input 
              matInput 
              type="text"
              formControlName="title"
              placeholder="Enter title"
            >
            <mat-error *ngIf="createForm.get('title')?.hasError('required')">
              Title is required
            </mat-error>
            <mat-error *ngIf="createForm.get('title')?.hasError('maxlength')">
              Title must be less than 255 characters
            </mat-error>
          </mat-form-field>




          <!-- message Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Message</mat-label>
            <textarea 
              matInput 
              formControlName="message"
              placeholder="Enter message"
              rows="3"
            ></textarea>
            <mat-error *ngIf="createForm.get('message')?.hasError('required')">
              Message is required
            </mat-error>
            <mat-error *ngIf="createForm.get('message')?.hasError('maxlength')">
              Message must be less than 1000 characters
            </mat-error>
          </mat-form-field>




          <!-- data Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Data (JSON)</mat-label>
            <textarea 
              matInput 
              formControlName="data"
              placeholder='Enter JSON data (e.g., {"key": "value"})'
              rows="3"
            ></textarea>
            <mat-hint>Enter valid JSON object (optional)</mat-hint>
            <mat-error *ngIf="createForm.get('data')?.hasError('invalidJson')">
              Invalid JSON format
            </mat-error>
          </mat-form-field>




          <!-- action_url Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Action Url</mat-label>
            <input 
              matInput 
              type="url"
              formControlName="action_url"
              placeholder="Enter action url"
            >
          </mat-form-field>






          <!-- read Field -->
          <div class="checkbox-field">
            <mat-checkbox formControlName="read">
              Read
            </mat-checkbox>
          </div>





          <!-- read_at Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Read At</mat-label>
            <input 
              matInput 
              [matDatepicker]="read_atPicker"
              formControlName="read_at"
              placeholder="Enter read at"
            >
            <mat-datepicker-toggle matSuffix [for]="read_atPicker"></mat-datepicker-toggle>
            <mat-datepicker #read_atPicker></mat-datepicker>
          </mat-form-field>



          <!-- archived Field -->
          <div class="checkbox-field">
            <mat-checkbox formControlName="archived">
              Archived
            </mat-checkbox>
          </div>





          <!-- archived_at Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Archived At</mat-label>
            <input 
              matInput 
              [matDatepicker]="archived_atPicker"
              formControlName="archived_at"
              placeholder="Enter archived at"
            >
            <mat-datepicker-toggle matSuffix [for]="archived_atPicker"></mat-datepicker-toggle>
            <mat-datepicker #archived_atPicker></mat-datepicker>
          </mat-form-field>





          <!-- priority Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="low">Low</mat-option>
              <mat-option value="normal">Normal</mat-option>
              <mat-option value="high">High</mat-option>
              <mat-option value="urgent">Urgent</mat-option>
            </mat-select>
          </mat-form-field>



          <!-- expires_at Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Expires At</mat-label>
            <input 
              matInput 
              [matDatepicker]="expires_atPicker"
              formControlName="expires_at"
              placeholder="Enter expires at"
            >
            <mat-datepicker-toggle matSuffix [for]="expires_atPicker"></mat-datepicker-toggle>
            <mat-datepicker #expires_atPicker></mat-datepicker>
          </mat-form-field>

        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button 
          mat-button 
          type="button"
          (click)="onCancel()"
          [disabled]="loading()"
        >
          Cancel
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          type="button"
          (click)="onCreate()"
          [disabled]="createForm.invalid || loading()"
        >
          Create Notifications
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .create-dialog {
      min-width: 500px;
      max-width: 800px;
    }

    .create-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .full-width {
      width: 100%;
    }

    .checkbox-field {
      margin: 8px 0;
    }

    .inline-spinner {
      margin-right: 8px;
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .create-dialog {
        min-width: 90vw;
      }
    }
  `]
})
export class NotificationCreateDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private notificationsService = inject(NotificationService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<NotificationCreateDialogComponent>);

  loading = signal<boolean>(false);
  userOptions: Array<{value: string, label: string}> = [];

  // Custom JSON validator
  private jsonValidator(control: AbstractControl) {
    if (!control.value) {
      return null; // Empty is valid (optional field)
    }
    
    try {
      JSON.parse(control.value);
      return null; // Valid JSON
    } catch (error) {
      return { invalidJson: true }; // Invalid JSON
    }
  }

  createForm: FormGroup = this.fb.group({
    user_id: [
      '',
      [
        Validators.required
      ]
    ],
    type: [
      '',
      [
        Validators.required, Validators.maxLength(50)
      ]
    ],
    title: [
      '',
      [
        Validators.required, Validators.maxLength(255)
      ]
    ],
    message: [
      '',
      [
        Validators.required, Validators.maxLength(1000)
      ]
    ],
    data: [
      '',
      [
        this.jsonValidator.bind(this)
      ]
    ],
    action_url: [
      '',
      [
        
      ]
    ],
    read: [
      false,
      [
        
      ]
    ],
    read_at: [
      '',
      [
        
      ]
    ],
    archived: [
      false,
      [
        
      ]
    ],
    archived_at: [
      '',
      [
        
      ]
    ],
    priority: [
      '',
      [
        Validators.maxLength(20)
      ]
    ],
    expires_at: [
      '',
      [
        
      ]
    ]
  });

  ngOnInit() {
    this.loadUserOptions();
  }

  async loadUserOptions() {
    try {
      this.userOptions = await this.notificationsService.getUsersDropdown();
    } catch (error) {
      console.error('Failed to load user options:', error);
    }
  }

  async onCreate() {
    if (this.createForm.valid) {
      this.loading.set(true);
      
      try {
        const formData = { ...this.createForm.value } as CreateNotificationRequest;
        
        // Parse JSON data field if it contains a string
        if (formData.data && typeof formData.data === 'string') {
          try {
            formData.data = JSON.parse(formData.data);
          } catch (error) {
            // This shouldn't happen due to validation, but just in case
            formData.data = {};
          }
        } else if (!formData.data) {
          // If empty, set to empty object
          formData.data = {};
        }
        
        const result = await this.notificationsService.createNotification(formData);
        
        if (result) {
          this.snackBar.open('Notifications created successfully', 'Close', {
            duration: 3000,
          });
          this.dialogRef.close(result);
        } else {
          this.snackBar.open('Failed to create Notifications', 'Close', {
            duration: 5000,
          });
        }
      } catch (error: any) {
        this.snackBar.open(
          error.message || 'Failed to create Notifications', 
          'Close', 
          { duration: 5000 }
        );
      } finally {
        this.loading.set(false);
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}