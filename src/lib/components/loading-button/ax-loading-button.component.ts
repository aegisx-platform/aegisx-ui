import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type ButtonVariant = 'raised' | 'stroked' | 'flat' | 'basic';
export type ButtonColor = 'primary' | 'accent' | 'warn' | '';

/**
 * AegisX Loading Button
 *
 * Wraps Angular Material's button directives (mat-raised-button /
 * mat-flat-button / mat-stroked-button / mat-button) and adds a
 * loading-state swap (icon ↔ spinner + contextual text) on top. The
 * visual output is **identical** to writing the equivalent plain
 * Material button by hand — same size, radius, color, typography,
 * ripple. This is the whole point of this component: you get a
 * consistent loading-state pattern without drifting from the rest
 * of the app's button standard.
 *
 * Prior versions of this component rendered a plain `<button>` with
 * custom `.ax-raised` / `.ax-stroked` classes + gradient/shimmer
 * animations. That diverged visually from mat-button everywhere
 * else, so it has been rebuilt on top of Material directives.
 *
 * @example
 * <ax-loading-button
 *   variant="flat"
 *   color="primary"
 *   icon="save"
 *   iconPosition="start"
 *   [loading]="saving()"
 *   loadingText="กำลังบันทึก..."
 *   (buttonClick)="onSubmit()"
 * >
 *   บันทึก
 * </ax-loading-button>
 */
@Component({
  selector: 'ax-loading-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Branch per variant because Angular templates can't
         conditionally switch a structural directive. Material's
         button directives (mat-raised-button et al.) are selectors,
         so we render one of four branches. The inner content is
         shared via ng-template so the icon/spinner swap logic only
         lives in one place. -->
    @switch (variant) {
      @case ('raised') {
        <button
          mat-raised-button
          [color]="color || null"
          [class.full-width]="fullWidth"
          [disabled]="disabled || (disableWhenLoading && loading)"
          [type]="type"
          (click)="onClick($event)"
        >
          <ng-container *ngTemplateOutlet="content" />
        </button>
      }
      @case ('flat') {
        <button
          mat-flat-button
          [color]="color || null"
          [class.full-width]="fullWidth"
          [disabled]="disabled || (disableWhenLoading && loading)"
          [type]="type"
          (click)="onClick($event)"
        >
          <ng-container *ngTemplateOutlet="content" />
        </button>
      }
      @case ('stroked') {
        <button
          mat-stroked-button
          [color]="color || null"
          [class.full-width]="fullWidth"
          [disabled]="disabled || (disableWhenLoading && loading)"
          [type]="type"
          (click)="onClick($event)"
        >
          <ng-container *ngTemplateOutlet="content" />
        </button>
      }
      @default {
        <button
          mat-button
          [color]="color || null"
          [class.full-width]="fullWidth"
          [disabled]="disabled || (disableWhenLoading && loading)"
          [type]="type"
          (click)="onClick($event)"
        >
          <ng-container *ngTemplateOutlet="content" />
        </button>
      }
    }

    <!-- Shared inner content. Wrapped in an inline-flex span so
         Material's icon auto-spacing selector
         (.mdc-button > .mat-icon) keeps working across the @if
         branches inside this template. -->
    <ng-template #content>
      <span class="ax-loading-button__inner">
        @if (loading) {
          <mat-spinner
            [diameter]="18"
            [color]="color || 'primary'"
          ></mat-spinner>
          <span>{{ loadingText }}</span>
        } @else {
          @if (icon && iconPosition === 'start') {
            <mat-icon>{{ icon }}</mat-icon>
          }
          <span><ng-content></ng-content></span>
          @if (icon && iconPosition === 'end') {
            <mat-icon>{{ icon }}</mat-icon>
          }
        }
      </span>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      /* Full-width passthrough — Material buttons don't stretch by
       * default; applying width:100% on the button element keeps the
       * parent contract honored. */
      .full-width {
        width: 100%;
      }

      /* Only wrapper styling — no color/radius/typography overrides.
       * All visual properties come from the Material theme so this
       * component matches plain mat-button exactly. */
      .ax-loading-button__inner {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }
    `,
  ],
})
export class AxLoadingButtonComponent {
  /** Button variant — maps 1:1 to Material button directives:
   *  raised → mat-raised-button, flat → mat-flat-button,
   *  stroked → mat-stroked-button, basic → mat-button. */
  @Input() variant: ButtonVariant = 'flat';

  /** Material color theme. Pass '' (empty) to render neutral/default
   *  (same as plain mat-button with no color= attribute). */
  @Input() color: ButtonColor = '';

  /** Loading state — swaps the icon+label for a spinner+loadingText. */
  @Input() loading: boolean = false;

  /** Text shown while loading. Should be contextual (e.g. "Saving...")
   *  rather than a generic "Loading..." so the user knows what the
   *  button is doing. */
  @Input() loadingText: string = 'Loading...';

  /** Disabled state. */
  @Input() disabled: boolean = false;

  /** Auto-disable during loading to block duplicate clicks. */
  @Input() disableWhenLoading: boolean = true;

  /** HTML button type. */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /** Material icon name (e.g. 'save', 'download'). Empty string = no
   *  icon, just text. */
  @Input() icon: string = '';

  /** Where the icon sits relative to the label. */
  @Input() iconPosition: 'start' | 'end' = 'start';

  /** Stretch the button to 100% of its container width. */
  @Input() fullWidth: boolean = false;

  /** Emitted on click — only while not loading or disabled. */
  @Output() buttonClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.loading && !this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
