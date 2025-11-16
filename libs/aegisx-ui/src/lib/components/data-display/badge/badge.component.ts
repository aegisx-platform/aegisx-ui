import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ax-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class AxBadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'md';
  @Input() dot = false;
  @Input() outline = false;
  @Input() removable = false;

  get badgeClasses(): string {
    const classes = ['ax-badge'];
    classes.push(`ax-badge-${this.variant}`);
    classes.push(`ax-badge-${this.size}`);
    if (this.dot) classes.push('ax-badge-dot');
    if (this.outline) classes.push('ax-badge-outline');
    if (this.removable) classes.push('ax-badge-removable');
    return classes.join(' ');
  }
}
