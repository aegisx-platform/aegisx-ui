import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import type {
  DatePickerCalendar,
  DatePickerLocale,
} from './date-picker.types';

/**
 * Calendar day data used by the grid for rendering.
 */
export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isFocused: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
}

/**
 * Internal calendar grid component for rendering day/month/year views.
 * NOT exported from the library - used only by AxDatePickerComponent.
 */
@Component({
  selector: 'ax-calendar-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Day View -->
    @if (viewMode === 'day') {
      <!-- Week Days -->
      <div class="ax-date-picker-weekdays">
        @for (day of weekDays; track day) {
          <div class="ax-date-picker-weekday">{{ day }}</div>
        }
      </div>

      <!-- Calendar Grid -->
      <div
        class="ax-date-picker-days"
        role="grid"
        aria-label="Calendar dates"
        (mouseleave)="calendarMouseLeave.emit()"
      >
        @for (day of calendarDays; track day.date.getTime()) {
          <button
            type="button"
            class="ax-date-picker-day"
            role="gridcell"
            [class.ax-date-picker-day-other-month]="!day.isCurrentMonth"
            [class.ax-date-picker-day-today]="day.isToday"
            [class.ax-date-picker-day-selected]="day.isSelected"
            [class.ax-date-picker-day-focused]="day.isFocused"
            [class.ax-date-picker-day-disabled]="day.isDisabled"
            [class.ax-date-picker-day-range-start]="day.isRangeStart"
            [class.ax-date-picker-day-range-end]="day.isRangeEnd"
            [class.ax-date-picker-day-in-range]="day.isInRange"
            [disabled]="day.isDisabled"
            [attr.aria-label]="getDateAriaLabel(day.date)"
            [attr.aria-selected]="day.isSelected"
            [attr.aria-disabled]="day.isDisabled"
            [attr.aria-current]="day.isToday ? 'date' : null"
            (click)="onDateSelect(day, $event)"
            (mouseenter)="dateHover.emit(day)"
          >
            {{ day.day }}
          </button>
        }
      </div>
    }

    <!-- Month View -->
    @if (viewMode === 'month') {
      <div
        class="ax-date-picker-months"
        role="grid"
        aria-label="Select month"
      >
        @for (month of months; track $index) {
          <button
            type="button"
            class="ax-date-picker-month"
            role="gridcell"
            [class.ax-date-picker-month-selected]="
              selectedMonth === $index
            "
            [attr.aria-label]="month"
            [attr.aria-selected]="selectedMonth === $index"
            (click)="onMonthSelect($index, $event)"
          >
            {{ month }}
          </button>
        }
      </div>
    }

    <!-- Year View -->
    @if (viewMode === 'year') {
      <div class="ax-date-picker-years" role="grid" aria-label="Select year">
        @for (year of years; track year) {
          <button
            type="button"
            class="ax-date-picker-year"
            role="gridcell"
            [class.ax-date-picker-year-selected]="
              selectedYear === year
            "
            [attr.aria-label]="
              calendar === 'buddhist' && locale === 'th'
                ? (year + 543).toString()
                : year.toString()
            "
            [attr.aria-selected]="selectedYear === year"
            (click)="onYearSelect(year, $event)"
          >
            {{
              calendar === 'buddhist' && locale === 'th' ? year + 543 : year
            }}
          </button>
        }
      </div>
    }
  `,
})
export class CalendarGridComponent {
  @Input() viewMode: 'day' | 'month' | 'year' = 'day';
  @Input() calendarDays: CalendarDay[] = [];
  @Input() weekDays: string[] = [];
  @Input() months: string[] = [];
  @Input() years: number[] = [];
  @Input() selectedMonth = 0;
  @Input() selectedYear = 0;
  @Input() locale: DatePickerLocale = 'en';
  @Input() calendar: DatePickerCalendar = 'gregorian';

  @Output() dateSelect = new EventEmitter<CalendarDay>();
  @Output() dateHover = new EventEmitter<CalendarDay>();
  @Output() calendarMouseLeave = new EventEmitter<void>();
  @Output() monthSelect = new EventEmitter<number>();
  @Output() yearSelect = new EventEmitter<number>();

  private static readonly THAI_MONTHS = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];

  getDateAriaLabel(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    if (this.locale === 'th') {
      const displayYear =
        this.calendar === 'buddhist' ? year + 543 : year;
      const monthName = CalendarGridComponent.THAI_MONTHS[month];
      return `${day} ${monthName} ${displayYear}`;
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  onDateSelect(day: CalendarDay, event: Event): void {
    event.stopPropagation();
    this.dateSelect.emit(day);
  }

  onMonthSelect(monthIndex: number, event: Event): void {
    event.stopPropagation();
    this.monthSelect.emit(monthIndex);
  }

  onYearSelect(year: number, event: Event): void {
    event.stopPropagation();
    this.yearSelect.emit(year);
  }
}
