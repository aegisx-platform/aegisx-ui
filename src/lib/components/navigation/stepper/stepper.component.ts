import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Step {
  label: string;
  description?: string;
  completed?: boolean;
  error?: boolean;
}

export type StepperOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'ax-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
  @Input() steps: Step[] = [];
  @Input() activeIndex = 0;
  @Input() orientation: StepperOrientation = 'horizontal';
  @Input() clickable = true;
  @Output() activeIndexChange = new EventEmitter<number>();
  @Output() stepClick = new EventEmitter<number>();

  get stepperClasses(): string {
    const classes = ['ax-stepper', `ax-stepper-${this.orientation}`];
    return classes.join(' ');
  }

  onStepClick(index: number): void {
    if (!this.clickable) return;
    if (this.steps[index].error) return;

    this.activeIndex = index;
    this.activeIndexChange.emit(index);
    this.stepClick.emit(index);
  }

  getStepClasses(index: number): string {
    const classes = ['ax-step'];
    if (index === this.activeIndex) classes.push('ax-step-active');
    if (this.steps[index].completed) classes.push('ax-step-completed');
    if (this.steps[index].error) classes.push('ax-step-error');
    if (this.clickable) classes.push('ax-step-clickable');
    return classes.join(' ');
  }

  getStepNumber(index: number): string {
    if (this.steps[index].error) return '!';
    if (this.steps[index].completed) return '✓';
    return (index + 1).toString();
  }

  trackByIndex(index: number): number {
    return index;
  }
}
