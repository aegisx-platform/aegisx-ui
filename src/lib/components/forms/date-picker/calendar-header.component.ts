import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Internal calendar header component for navigation.
 * NOT exported from the library - used only by AxDatePickerComponent.
 */
@Component({
  selector: 'ax-calendar-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ax-date-picker-header"
      role="toolbar"
      aria-label="Calendar navigation"
    >
      @if (viewMode === 'year') {
        <button
          type="button"
          class="ax-date-picker-nav-btn"
          (click)="onPrevClick($event)"
          aria-label="Previous 12 years"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      } @else {
        <button
          type="button"
          class="ax-date-picker-nav-btn"
          (click)="onPrevClick($event)"
          aria-label="Previous month"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      }

      <button
        type="button"
        class="ax-date-picker-month-year"
        (click)="onViewModeToggle($event)"
        [attr.aria-label]="
          viewMode === 'year' ? 'Switch to month view' : 'Switch to year view'
        "
      >
        @if (viewMode === 'year') {
          <span>{{ yearRangeStart }} - {{ yearRangeEnd }}</span>
        } @else {
          <span>{{ currentMonthYear }}</span>
        }
      </button>

      @if (viewMode === 'year') {
        <button
          type="button"
          class="ax-date-picker-nav-btn"
          (click)="onNextClick($event)"
          aria-label="Next 12 years"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      } @else {
        <button
          type="button"
          class="ax-date-picker-nav-btn"
          (click)="onNextClick($event)"
          aria-label="Next month"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      }
    </div>
  `,
})
export class CalendarHeaderComponent {
  @Input() viewMode: 'day' | 'month' | 'year' = 'day';
  @Input() currentMonthYear = '';
  @Input() yearRangeStart = 0;
  @Input() yearRangeEnd = 0;

  @Output() prevClick = new EventEmitter<void>();
  @Output() nextClick = new EventEmitter<void>();
  @Output() viewModeToggle = new EventEmitter<void>();

  onPrevClick(event: Event): void {
    event.stopPropagation();
    this.prevClick.emit();
  }

  onNextClick(event: Event): void {
    event.stopPropagation();
    this.nextClick.emit();
  }

  onViewModeToggle(event: Event): void {
    event.stopPropagation();
    this.viewModeToggle.emit();
  }
}
