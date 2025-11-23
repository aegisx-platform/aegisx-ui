import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'outlined' | 'elevated';
export type CardSize = 'sm' | 'md' | 'lg';
export type CardColor =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
export type CardColorIntensity = 'filled' | 'subtle';

@Component({
  selector: 'ax-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class AxCardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() size: CardSize = 'md';
  @Input() color: CardColor = 'default';
  @Input() colorIntensity: CardColorIntensity = 'filled';
  @Input() hoverable = false;
  @Input() clickable = false;
  @Input() loading = false;
  @Input() title = '';
  @Input() subtitle = '';

  get cardClasses(): string {
    const classes = ['ax-card'];
    classes.push(`ax-card-${this.variant}`);
    classes.push(`ax-card-${this.size}`);
    if (this.color !== 'default') {
      classes.push(`ax-card-${this.color}`);
      classes.push(`ax-card-${this.colorIntensity}`);
    }
    if (this.hoverable) classes.push('ax-card-hoverable');
    if (this.clickable) classes.push('ax-card-clickable');
    if (this.loading) classes.push('ax-card-loading');
    return classes.join(' ');
  }
}
