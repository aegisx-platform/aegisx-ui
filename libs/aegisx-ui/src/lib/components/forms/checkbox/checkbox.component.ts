/**
 * AegisX UI - Checkbox Component
 *
 * A checkbox input component with indeterminate state support,
 * validation states, and full Angular Forms integration.
 *
 * @example
 * ```html
 * <ax-checkbox
 *   [(ngModel)]="isChecked"
 *   label="Accept terms">
 * </ax-checkbox>
 * ```
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  HostBinding,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { CheckboxSize, CheckboxState } from './checkbox.types';

@Component({
  selector: 'ax-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AxCheckboxComponent),
      multi: true,
    },
  ],
})
export class AxCheckboxComponent
  implements ControlValueAccessor, AfterViewInit
{
  /**
   * Checkbox size
   * @default 'md'
   */
  @Input() size: CheckboxSize = 'md';

  /**
   * Validation state
   * @default 'default'
   */
  @Input() state: CheckboxState = 'default';

  /**
   * Label text
   */
  @Input() label = '';

  /**
   * Helper text (shown below checkbox)
   */
  @Input() helperText = '';

  /**
   * Error message (shown when state is 'error')
   */
  @Input() errorMessage = '';

  /**
   * Disabled state
   * @default false
   */
  @Input() disabled = false;

  /**
   * Required field
   * @default false
   */
  @Input() required = false;

  /**
   * Indeterminate state (for "select all" scenarios)
   * @default false
   */
  @Input()
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(value: boolean) {
    this._indeterminate = value;
    this.updateIndeterminateState();
  }
  private _indeterminate = false;

  /**
   * Value change event
   */
  @Output() valueChange = new EventEmitter<boolean>();

  /**
   * Indeterminate state change event
   */
  @Output() indeterminateChange = new EventEmitter<boolean>();

  /**
   * Checkbox input element
   */
  @ViewChild('checkboxInput') checkboxInput?: ElementRef<HTMLInputElement>;

  /**
   * Internal checked state
   */
  private _checked = false;

  /**
   * ControlValueAccessor callbacks
   */
  private onChange = (_value: unknown) => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  /**
   * Host binding for disabled state
   */
  @HostBinding('class.ax-checkbox-disabled')
  get isDisabled(): boolean {
    return this.disabled;
  }

  ngAfterViewInit(): void {
    this.updateIndeterminateState();
  }

  /**
   * Get current checked state
   */
  get checked(): boolean {
    return this._checked;
  }

  /**
   * Set checked state
   */
  set checked(value: boolean) {
    if (value !== this._checked) {
      this._checked = value;
      this.onChange(value);
      this.valueChange.emit(value);

      // Clear indeterminate state when explicitly checked/unchecked
      if (this._indeterminate) {
        this._indeterminate = false;
        this.indeterminateChange.emit(false);
        this.updateIndeterminateState();
      }
    }
  }

  /**
   * Get container CSS classes
   */
  get containerClasses(): string {
    const classes = [
      'ax-checkbox-container',
      `ax-checkbox-${this.size}`,
      `ax-checkbox-state-${this.state}`,
    ];

    if (this.disabled) {
      classes.push('ax-checkbox-disabled');
    }

    if (this._checked) {
      classes.push('ax-checkbox-checked');
    }

    if (this._indeterminate) {
      classes.push('ax-checkbox-indeterminate');
    }

    return classes.join(' ');
  }

  /**
   * Get message to display (error or helper text)
   */
  get displayMessage(): string {
    if (this.state === 'error' && this.errorMessage) {
      return this.errorMessage;
    }
    return this.helperText;
  }

  /**
   * Handle checkbox change
   */
  onCheckboxChange(event: Event): void {
    if (this.disabled) {
      return;
    }

    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.onTouched();
  }

  /**
   * Toggle checkbox state
   */
  toggle(): void {
    if (!this.disabled) {
      this.checked = !this._checked;
      this.onTouched();
    }
  }

  /**
   * Update indeterminate DOM property
   */
  private updateIndeterminateState(): void {
    if (this.checkboxInput) {
      this.checkboxInput.nativeElement.indeterminate = this._indeterminate;
    }
  }

  // ============================================
  // ControlValueAccessor Implementation
  // ============================================

  /**
   * Write value from form control
   */
  writeValue(value: boolean): void {
    this._checked = !!value;
  }

  /**
   * Register onChange callback
   */
  registerOnChange(fn: (_value: unknown) => void): void {
    this.onChange = fn;
  }

  /**
   * Register onTouched callback
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Set disabled state
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
