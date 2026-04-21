import {
  Component,
  Input,
  forwardRef,
  inject,
  signal,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { firstValueFrom } from 'rxjs';
import { AxDialogService } from '../../../services/ax-dialog.service';
import type { AxProtectedFieldConfig } from './protected-field.types';

/**
 * Protected Field Component
 *
 * A text input that starts locked in edit mode. The user must explicitly
 * unlock it via a confirm dialog before editing. Auto-locks on blur.
 * Useful for critical fields like codes, IDs, or reference numbers.
 *
 * Uses Material form-field (fill appearance) as base.
 * Implements ControlValueAccessor for Reactive Forms compatibility.
 *
 * @example
 * // Basic usage with formControl
 * <ax-protected-field
 *   label="รหัสยา"
 *   [formControl]="form.controls.drug_code"
 *   [locked]="mode === 'edit'"
 *   lockMessage="รหัสยาเป็นข้อมูลสำคัญ"
 * ></ax-protected-field>
 *
 * @example
 * // With custom config
 * <ax-protected-field
 *   label="รหัสบัญชี"
 *   [formControl]="form.controls.account_code"
 *   [locked]="true"
 *   lockTitle="ปลดล็อครหัสบัญชี"
 *   lockMessage="การแก้ไขอาจส่งผลกระทบต่อรายงานทางการเงิน"
 *   [required]="true"
 *   maxlength="20"
 * ></ax-protected-field>
 */
@Component({
  selector: 'ax-protected-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AxProtectedFieldComponent),
      multi: true,
    },
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .unlock-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        margin-right: 4px;
        border-radius: 6px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--ax-text-tertiary);
        transition:
          background-color 0.15s ease,
          color 0.15s ease;
      }
      .unlock-btn:hover {
        background-color: color-mix(
          in srgb,
          var(--ax-border-default) 40%,
          transparent
        );
        color: var(--ax-text-default);
      }
      .unlock-btn mat-icon {
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
      }
    `,
  ],
  template: `
    <mat-form-field
      [appearance]="appearance"
      subscriptSizing="dynamic"
      class="w-full"
    >
      <mat-label>{{ label }}</mat-label>
      <input
        #inputEl
        matInput
        [formControl]="innerControl"
        [placeholder]="placeholder"
        [maxlength]="maxlength"
        [required]="required"
        (blur)="onBlur()"
      />
      @if (isLocked()) {
        <button
          matSuffix
          type="button"
          class="unlock-btn"
          (click)="onUnlock($event)"
          [matTooltip]="'คลิกเพื่อปลดล็อคแก้ไข'"
        >
          <mat-icon>lock</mat-icon>
        </button>
      }
      @if (innerControl.hasError('required') && innerControl.touched) {
        <mat-error>กรุณาระบุ{{ label }}</mat-error>
      }
      @if (innerControl.hasError('maxlength')) {
        <mat-error>ระบุได้ไม่เกิน {{ maxlength }} ตัวอักษร</mat-error>
      }
    </mat-form-field>
  `,
})
export class AxProtectedFieldComponent implements ControlValueAccessor, OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() maxlength: number | null = null;
  @Input() required = false;
  @Input() appearance: 'fill' | 'outline' = 'outline';

  /** Whether the field starts locked */
  @Input() locked = false;

  /** Dialog title */
  @Input() lockTitle = 'ปลดล็อคการแก้ไข';

  /** Dialog message */
  @Input() lockMessage =
    'ข้อมูลนี้เป็นข้อมูลสำคัญที่ใช้อ้างอิงในระบบ การแก้ไขอาจส่งผลกระทบ ต้องการแก้ไขหรือไม่?';

  /** Auto-lock when input loses focus */
  @Input() autoLockOnBlur = true;

  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  private axDialog = inject(AxDialogService);

  innerControl = new FormControl('');
  isLocked = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  // Guard flag — when parent writes value via CVA, skip propagating
  // through onChange (prevents infinite write ↔ valueChanges loop).
  // We intentionally DO emit valueChanges so mat-form-field/matInput
  // observe the value change and re-float the label correctly —
  // using `{ emitEvent: false }` here used to break label state on
  // async patchValue (e.g. loading drug data after init).
  private _writingValue = false;

  ngOnInit(): void {
    if (this.locked) {
      this.isLocked.set(true);
      this.innerControl.disable();
    }

    this.innerControl.valueChanges.subscribe((value) => {
      if (this._writingValue) return;
      this.onChange(value ?? '');
    });
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    this._writingValue = true;
    this.innerControl.setValue(value);
    this._writingValue = false;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // External disable (from parent formControl.disable()) takes priority
    if (isDisabled) {
      this.innerControl.disable({ emitEvent: false });
    } else if (!this.isLocked()) {
      this.innerControl.enable({ emitEvent: false });
    }
  }

  async onUnlock(event: Event): Promise<void> {
    event.stopPropagation();

    const confirmed = await firstValueFrom(
      this.axDialog.confirm({
        title: this.lockTitle,
        message: this.lockMessage,
        confirmText: 'ปลดล็อค',
        cancelText: 'ยกเลิก',
      }),
    );

    if (confirmed) {
      this.isLocked.set(false);
      this.innerControl.enable();
      // Focus the input after unlocking
      setTimeout(() => this.inputEl?.nativeElement?.focus(), 50);
    }
  }

  onBlur(): void {
    this.onTouched();
    if (this.locked && this.autoLockOnBlur) {
      this.isLocked.set(true);
      this.innerControl.disable();
    }
  }
}
