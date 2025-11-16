import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaResize =
  | 'none'
  | 'vertical'
  | 'horizontal'
  | 'both'
  | 'auto';

@Component({
  selector: 'ax-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  @ViewChild('textarea', { static: false })
  textareaRef?: ElementRef<HTMLTextAreaElement>;

  @Input() label = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() size: TextareaSize = 'md';
  @Input() resize: TextareaResize = 'vertical';
  @Input() rows = 3;
  @Input() minRows = 2;
  @Input() maxRows = 10;
  @Input() maxLength?: number;
  @Input() helperText = '';
  @Input() errorMessage = '';

  value = '';
  focused = false;

  private onChange = (_value: unknown) => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  get containerClasses(): string {
    return 'ax-textarea-container';
  }

  get wrapperClasses(): string {
    const classes = ['ax-textarea-wrapper'];
    classes.push(`ax-textarea-wrapper-${this.size}`);
    if (this.focused) classes.push('ax-textarea-wrapper-focused');
    if (this.disabled) classes.push('ax-textarea-wrapper-disabled');
    if (this.errorMessage) classes.push('ax-textarea-wrapper-error');
    if (this.readonly) classes.push('ax-textarea-wrapper-readonly');
    return classes.join(' ');
  }

  get displayMessage(): string {
    return this.errorMessage || this.helperText;
  }

  get characterCount(): string {
    if (!this.maxLength) return '';
    return `${this.value.length}/${this.maxLength}`;
  }

  get showCharacterCount(): boolean {
    return !!this.maxLength;
  }

  onInput(_event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);

    if (this.resize === 'auto') {
      this.autoResize();
    }
  }

  onFocus(event: FocusEvent): void {
    this.focused = true;
  }

  onBlur(_event: FocusEvent): void {
    this.focused = false;
    this.onTouched();
  }

  private autoResize(): void {
    if (!this.textareaRef) return;

    const textarea = this.textareaRef.nativeElement;
    textarea.style.height = 'auto';

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const minHeight = lineHeight * this.minRows;
    const maxHeight = lineHeight * this.maxRows;

    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight,
    );
    textarea.style.height = `${newHeight}px`;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
    if (this.resize === 'auto') {
      setTimeout(() => this.autoResize(), 0);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
