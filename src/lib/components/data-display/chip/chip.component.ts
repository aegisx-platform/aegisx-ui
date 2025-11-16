import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChipVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error';
export type ChipSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ax-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent {
  @Input() variant: ChipVariant = 'default';
  @Input() size: ChipSize = 'md';
  @Input() removable = false;
  @Input() outline = false;
  @Input() clickable = false;

  @Output() remove = new EventEmitter<void>();
  @Output() chipClick = new EventEmitter<MouseEvent>();

  get chipClasses(): string {
    const classes = ['ax-chip'];
    classes.push(`ax-chip-${this.variant}`);
    classes.push(`ax-chip-${this.size}`);
    if (this.outline) classes.push('ax-chip-outline');
    if (this.clickable) classes.push('ax-chip-clickable');
    if (this.removable) classes.push('ax-chip-removable');
    return classes.join(' ');
  }

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit();
  }

  onClick(event: MouseEvent): void {
    if (this.clickable) {
      this.chipClick.emit(event);
    }
  }
}
