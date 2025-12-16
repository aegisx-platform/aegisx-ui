import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService, UserPreferences } from '../../services/user.service';
import {
  THEME_OPTIONS,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  UserPreferencesForm,
} from './profile-preferences.types';

@Component({
  selector: 'ax-profile-preferences',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile-preferences.component.html',
  styleUrls: ['./profile-preferences.component.scss'],
})
export class ProfilePreferencesComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  // Signals
  preferences = signal<UserPreferences | null>(null);
  loading = signal(false);
  saving = signal(false);
  hasChanges = signal(false);

  // Computed values
  isLoading = computed(() => this.loading() || this.saving());

  // Constants
  themeOptions = THEME_OPTIONS;
  languageOptions = LANGUAGE_OPTIONS;
  timezoneOptions = TIMEZONE_OPTIONS;

  // Form group
  preferencesForm: FormGroup = this.formBuilder.group({
    theme: ['light', Validators.required],
    language: ['en', Validators.required],
    notifications: this.formBuilder.group({
      email: [false],
      push: [false],
    }),
    timezone: ['UTC', Validators.required],
  });

  constructor() {
    // Listen to form changes to track if there are unsaved changes
    this.preferencesForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.hasChanges.set(this.preferencesForm.dirty);
      });
  }

  ngOnInit(): void {
    this.loadPreferences();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPreferences(): void {
    this.loading.set(true);

    this.userService
      .getPreferences()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prefs) => {
          this.preferences.set(prefs);
          this.populateForm(prefs);
          this.preferencesForm.markAsPristine();
          this.hasChanges.set(false);
        },
        error: (error) => {
          console.error('Failed to load preferences:', error);
          this.snackBar.open('Failed to load preferences', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  private populateForm(prefs: UserPreferences): void {
    this.preferencesForm.patchValue(
      {
        theme: prefs.theme || 'light',
        language: prefs.language || 'en',
        notifications: {
          email: prefs.notifications?.email || false,
          push: prefs.notifications?.push || false,
        },
        timezone: prefs.timezone || 'UTC',
      },
      { emitEvent: false },
    );
  }

  savePreferences(): void {
    if (this.preferencesForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.saving.set(true);

    const formValue = this.preferencesForm.value as UserPreferencesForm;

    const updateData: Partial<UserPreferences> = {
      theme: formValue.theme as 'default' | 'dark' | 'light' | 'auto',
      language: formValue.language,
      notifications: {
        email: formValue.notifications.email,
        push: formValue.notifications.push,
        desktop: false,
        sound: false,
      },
      timezone: formValue.timezone,
    };

    this.userService
      .updatePreferences(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedPrefs) => {
          this.preferences.set(updatedPrefs);
          this.preferencesForm.markAsPristine();
          this.hasChanges.set(false);

          this.snackBar.open('Preferences updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        },
        error: (error) => {
          console.error('Failed to save preferences:', error);
          this.snackBar.open('Failed to save preferences', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
        complete: () => {
          this.saving.set(false);
        },
      });
  }

  resetDefaults(): void {
    this.preferencesForm.reset(
      {
        theme: 'light',
        language: 'en',
        notifications: {
          email: false,
          push: false,
        },
        timezone: 'UTC',
      },
      { emitEvent: false },
    );

    this.preferencesForm.markAsPristine();
    this.hasChanges.set(false);

    this.snackBar.open('Preferences reset to defaults', 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar'],
    });
  }

  resetToSaved(): void {
    if (this.preferences()) {
      this.populateForm(this.preferences()!);
      this.preferencesForm.markAsPristine();
      this.hasChanges.set(false);

      this.snackBar.open('Changes discarded', 'Close', {
        duration: 3000,
        panelClass: ['info-snackbar'],
      });
    }
  }

  canSave(): boolean {
    return this.preferencesForm.valid && this.hasChanges();
  }
}
