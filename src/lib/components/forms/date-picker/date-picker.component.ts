import {
  Component,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type DatePickerSize = 'sm' | 'md' | 'lg';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'ax-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Select date';
  @Input() disabled = false;
  @Input() required = false;
  @Input() size: DatePickerSize = 'md';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() helperText = '';
  @Input() errorMessage = '';

  value: Date | null = null;
  isOpen = false;
  focused = false;

  currentMonth: Date = new Date();
  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  calendarDays: CalendarDay[] = [];

  private onChange = (_value: unknown) => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  constructor(private elementRef: ElementRef) {
    this.generateCalendar();
  }

  get containerClasses(): string {
    return 'ax-date-picker-container';
  }

  get wrapperClasses(): string {
    const classes = ['ax-date-picker-wrapper'];
    classes.push(`ax-date-picker-wrapper-${this.size}`);
    if (this.focused) classes.push('ax-date-picker-wrapper-focused');
    if (this.disabled) classes.push('ax-date-picker-wrapper-disabled');
    if (this.errorMessage) classes.push('ax-date-picker-wrapper-error');
    return classes.join(' ');
  }

  get displayMessage(): string {
    return this.errorMessage || this.helperText;
  }

  get displayValue(): string {
    if (!this.value) return '';
    return this.formatDate(this.value);
  }

  get currentMonthYear(): string {
    return this.currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.focused = true;
      if (this.value) {
        this.currentMonth = new Date(
          this.value.getFullYear(),
          this.value.getMonth(),
          1,
        );
      }
      this.generateCalendar();
    }
  }

  selectDate(day: CalendarDay): void {
    if (day.isDisabled) return;

    this.value = day.date;
    this.onChange(this.value);
    this.onTouched();
    this.isOpen = false;
    this.focused = false;
    this.generateCalendar();
  }

  previousMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1,
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1,
    );
    this.generateCalendar();
  }

  clearValue(): void {
    this.value = null;
    this.onChange(null);
    this.onTouched();
    this.generateCalendar();
  }

  private generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevLastDay.getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.calendarDays = [];

    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      this.calendarDays.push(this.createCalendarDay(date, false));
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      this.calendarDays.push(this.createCalendarDay(date, true));
    }

    // Next month days
    const remainingDays = 42 - this.calendarDays.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      this.calendarDays.push(this.createCalendarDay(date, false));
    }
  }

  private createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    return {
      date: dateOnly,
      day: date.getDate(),
      isCurrentMonth,
      isToday: dateOnly.getTime() === today.getTime(),
      isSelected: this.value
        ? dateOnly.getTime() === new Date(this.value).setHours(0, 0, 0, 0)
        : false,
      isDisabled: this.isDateDisabled(dateOnly),
    };
  }

  private isDateDisabled(date: Date): boolean {
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;
    return false;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.focused = false;
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: Date | null): void {
    this.value = value;
    if (value) {
      this.currentMonth = new Date(value.getFullYear(), value.getMonth(), 1);
    }
    this.generateCalendar();
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
