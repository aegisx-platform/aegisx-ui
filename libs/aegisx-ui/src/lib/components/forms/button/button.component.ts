/**
 * AegisX UI - Button Component
 *
 * A flexible button component with multiple variants, colors, and sizes.
 * Built on design tokens for consistent theming.
 *
 * @example
 * ```html
 * <ax-button variant="solid" color="primary" size="md">
 *   Click Me
 * </ax-button>
 * ```
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ButtonVariant, ButtonColor, ButtonSize } from './button.types';

@Component({
  selector: 'ax-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class AxButtonComponent {
  /**
   * Visual variant of the button
   * @default 'solid'
   */
  @Input() variant: ButtonVariant = 'solid';

  /**
   * Color scheme
   * @default 'primary'
   */
  @Input() color: ButtonColor = 'primary';

  /**
   * Button size
   * @default 'md'
   */
  @Input() size: ButtonSize = 'md';

  /**
   * Disabled state
   * @default false
   */
  @Input() disabled = false;

  /**
   * Loading state (shows spinner, disables interaction)
   * @default false
   */
  @Input() loading = false;

  /**
   * Full width button
   * @default false
   */
  @Input() fullWidth = false;

  /**
   * Icon only mode (circular button for icons)
   * @default false
   */
  @Input() iconOnly = false;

  /**
   * Button HTML type
   * @default 'button'
   */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Click event emitter
   */
  @Output() axClick = new EventEmitter<MouseEvent>();

  /**
   * Host binding for full width
   */
  @HostBinding('class.ax-button-full-width')
  get isFullWidth(): boolean {
    return this.fullWidth;
  }

  /**
   * Compute button CSS classes
   */
  get buttonClasses(): string {
    const classes = [
      'ax-btn',
      `ax-btn-${this.variant}`,
      `ax-btn-${this.color}`,
      `ax-btn-${this.size}`,
    ];

    if (this.iconOnly) {
      classes.push('ax-btn-icon-only');
    }

    if (this.loading) {
      classes.push('ax-btn-loading');
    }

    return classes.join(' ');
  }

  /**
   * Handle button click
   */
  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.axClick.emit(event);
    }
  }

  /**
   * Check if button should be disabled
   */
  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }
}
