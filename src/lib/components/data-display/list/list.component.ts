import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ListItem, ListSize } from './list.types';

@Component({
  selector: 'ax-list',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class AxListComponent {
  @Input() items: ListItem[] = [];
  @Input() size: ListSize = 'md';
  @Input() bordered: boolean = false;
  @Input() hoverable: boolean = false;
  @Input() divided: boolean = true;

  get listClasses(): string {
    const classes = ['ax-list'];
    classes.push(`ax-list-${this.size}`);
    if (this.bordered) classes.push('ax-list-bordered');
    if (this.hoverable) classes.push('ax-list-hoverable');
    if (this.divided) classes.push('ax-list-divided');
    return classes.join(' ');
  }

  trackByIndex(index: number): number {
    return index;
  }
}
