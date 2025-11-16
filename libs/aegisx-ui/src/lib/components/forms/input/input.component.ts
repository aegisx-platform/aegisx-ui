/**
 * AegisX UI - Input Component
 *
 * A flexible text input component with validation states, prefix/suffix support.
 * Built on design tokens for consistent theming.
 *
 * @example
 * ```html
 * <ax-input
 *   type="email"
 *   placeholder="Enter email"
 *   [(ngModel)]="email">
 * </ax-input>
 * ```
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { InputType, InputSize, InputState } from './input.types';

@Component({
  selector: 'ax-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AxInputComponent),
      multi: true,
    },
  ],
})
export class AxInputComponent implements ControlValueAccessor {
  /**
   * Input type
   * @default 'text'
   */
  @Input() type: InputType = 'text';

  /**
   * Input size
   * @default 'md'
   */
  @Input() size: InputSize = 'md';

  /**
   * Validation state
   * @default 'default'
   */
  @Input() state: InputState = 'default';

  /**
   * Placeholder text
   */
  @Input() placeholder = '';

  /**
   * Label text (optional)
   */
  @Input() label = '';

  /**
   * Helper text (shown below input)
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
   * Readonly state
   * @default false
   */
  @Input() readonly = false;

  /**
   * Required field
   * @default false
   */
  @Input() required = false;

  /**
   * Full width input
   * @default false
   */
  @Input() fullWidth = false;

  /**
   * Show clear button when input has value
   * @default false
   */
  @Input() clearable = false;

  /**
   * Prefix icon or text
   */
  @Input() prefix = '';

  /**
   * Suffix icon or text
   */
  @Input() suffix = '';

  /**
   * Value change event
   */
  @Output() valueChange = new EventEmitter<string>();

  /**
   * Focus event
   */
  @Output() axFocus = new EventEmitter<FocusEvent>();

  /**
   * Blur event
   */
  @Output() axBlur = new EventEmitter<FocusEvent>();

  /**
   * Clear button clicked event
   */
  @Output() axClear = new EventEmitter<void>();

  /**
   * Internal value
   */
  private _value = '';

  /**
   * Focus state
   */
  isFocused = false;

  /**
   * ControlValueAccessor callbacks
   */
  private onChange = (_value: unknown) => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  /**
   * Host binding for full width
   */
  @HostBinding('class.ax-input-full-width')
  get isFullWidth(): boolean {
    return this.fullWidth;
  }

  /**
   * Get current value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Set value
   */
  set value(val: string) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
      this.valueChange.emit(val);
    }
  }

  /**
   * Get wrapper CSS classes
   */
  get wrapperClasses(): string {
    const classes = [
      'ax-input-wrapper',
      `ax-input-${this.size}`,
      `ax-input-state-${this.state}`,
    ];

    if (this.isFocused) {
      classes.push('ax-input-focused');
    }

    if (this.disabled) {
      classes.push('ax-input-disabled');
    }

    if (this.readonly) {
      classes.push('ax-input-readonly');
    }

    return classes.join(' ');
  }

  /**
   * Show clear button condition
   */
  get showClearButton(): boolean {
    return (
      this.clearable &&
      this._value.length > 0 &&
      !this.disabled &&
      !this.readonly
    );
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
   * Handle input change
   */
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
  }

  /**
   * Handle input focus
   */
  onFocus(event: FocusEvent): void {
    this.isFocused = true;
    this.axFocus.emit(event);
  }

  /**
   * Handle input blur
   */
  onBlur(event: FocusEvent): void {
    this.isFocused = false;
    this.onTouched();
    this.axBlur.emit(event);
  }

  /**
   * Clear input value
   */
  clearValue(): void {
    this.value = '';
    this.axClear.emit();
  }

  // ============================================
  // ControlValueAccessor Implementation
  // ============================================

  /**
   * Write value from form control
   */
  writeValue(value: string): void {
    this._value = value || '';
  }

  /**
   * Register onChange callback
   */
  registerOnChange(fn: (value: string) => void): void {
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
