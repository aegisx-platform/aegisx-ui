import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleVariant = 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'ax-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AxToggleComponent),
      multi: true,
    },
  ],
})
export class AxToggleComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() description = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() size: ToggleSize = 'md';
  @Input() variant: ToggleVariant = 'primary';
  @Input() helperText = '';
  @Input() errorMessage = '';

  checked = false;
  focused = false;

  private onChange = (_value: unknown) => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  get containerClasses(): string {
    const classes = ['ax-toggle-container'];
    if (this.disabled) classes.push('ax-toggle-container-disabled');
    if (this.errorMessage) classes.push('ax-toggle-container-error');
    return classes.join(' ');
  }

  get switchClasses(): string {
    const classes = ['ax-toggle-switch'];
    classes.push(`ax-toggle-switch-${this.size}`);
    classes.push(`ax-toggle-switch-${this.variant}`);
    if (this.checked) classes.push('ax-toggle-switch-checked');
    if (this.disabled) classes.push('ax-toggle-switch-disabled');
    if (this.focused) classes.push('ax-toggle-switch-focused');
    return classes.join(' ');
  }

  get displayMessage(): string {
    return this.errorMessage || this.helperText;
  }

  toggle(): void {
    if (this.disabled) return;

    this.checked = !this.checked;
    this.onChange(this.checked);
    this.onTouched();
  }

  onFocus(): void {
    this.focused = true;
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  registerOnChange(fn: (_value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
