/**
 * AegisX UI - Radio Group Component
 *
 * A radio button group component for single selection from multiple options.
 * Built on design tokens with full Angular Forms integration.
 *
 * @example
 * ```html
 * <ax-radio-group
 *   [options]="genderOptions"
 *   [(ngModel)]="selectedGender">
 * </ax-radio-group>
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
import type { RadioSize, RadioState, RadioOption } from './radio.types';

@Component({
  selector: 'ax-radio-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AxRadioGroupComponent),
      multi: true,
    },
  ],
})
export class AxRadioGroupComponent<T = any> implements ControlValueAccessor {
  /**
   * Radio size
   * @default 'md'
   */
  @Input() size: RadioSize = 'md';

  /**
   * Validation state
   * @default 'default'
   */
  @Input() state: RadioState = 'default';

  /**
   * Group label
   */
  @Input() label = '';

  /**
   * Helper text (shown below radio group)
   */
  @Input() helperText = '';

  /**
   * Error message (shown when state is 'error')
   */
  @Input() errorMessage = '';

  /**
   * Disabled state for entire group
   * @default false
   */
  @Input() disabled = false;

  /**
   * Required field
   * @default false
   */
  @Input() required = false;

  /**
   * Radio options
   */
  @Input() options: RadioOption<T>[] = [];

  /**
   * Layout direction
   * @default 'vertical'
   */
  @Input() direction: 'vertical' | 'horizontal' = 'vertical';

  /**
   * Unique name for the radio group (auto-generated if not provided)
   */
  @Input() name = `ax-radio-group-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Value change event
   */
  @Output() valueChange = new EventEmitter<T>();

  /**
   * Internal selected value
   */
  private _value: T | null = null;

  /**
   * ControlValueAccessor callbacks
   */
  private onChange = (_value: unknown) => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  /**
   * Host binding for disabled state
   */
  @HostBinding('class.ax-radio-group-disabled')
  get isDisabled(): boolean {
    return this.disabled;
  }

  /**
   * Get current value
   */
  get value(): T | null {
    return this._value;
  }

  /**
   * Set value
   */
  set value(val: T | null) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
      this.valueChange.emit(val as T);
    }
  }

  /**
   * Get container CSS classes
   */
  get containerClasses(): string {
    const classes = [
      'ax-radio-group-container',
      `ax-radio-group-${this.size}`,
      `ax-radio-group-state-${this.state}`,
      `ax-radio-group-${this.direction}`,
    ];

    if (this.disabled) {
      classes.push('ax-radio-group-disabled');
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
   * Check if option is selected
   */
  isSelected(option: RadioOption<T>): boolean {
    return this._value === option.value;
  }

  /**
   * Check if option is disabled
   */
  isOptionDisabled(option: RadioOption<T>): boolean {
    return this.disabled || !!option.disabled;
  }

  /**
   * Handle radio selection
   */
  selectOption(option: RadioOption<T>): void {
    if (this.isOptionDisabled(option)) {
      return;
    }

    this.value = option.value;
    this.onTouched();
  }

  /**
   * Get radio item CSS classes
   */
  getRadioItemClasses(option: RadioOption<T>): string {
    const classes = ['ax-radio-item'];

    if (this.isSelected(option)) {
      classes.push('ax-radio-item-selected');
    }

    if (this.isOptionDisabled(option)) {
      classes.push('ax-radio-item-disabled');
    }

    return classes.join(' ');
  }

  /**
   * TrackBy function for ngFor
   */
  trackByValue(_index: number, option: RadioOption<T>): T {
    return option.value;
  }

  // ============================================
  // ControlValueAccessor Implementation
  // ============================================

  /**
   * Write value from form control
   */
  writeValue(value: T | null): void {
    this._value = value;
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
