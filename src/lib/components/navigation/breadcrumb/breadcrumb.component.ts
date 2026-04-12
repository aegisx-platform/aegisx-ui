import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbItem, BreadcrumbSize } from './breadcrumb.types';

@Component({
  selector: 'ax-breadcrumb',
  standalone: true,
  imports: [NgStyle, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class AxBreadcrumbComponent {
  private router = inject(Router);

  @Input() items: BreadcrumbItem[] = [];
  @Input() separator: string = '/';
  @Input() separatorIcon?: string;
  @Input() size: BreadcrumbSize = 'md';
  @Input() backgroundColor?: string;
  @Input() showBorder = false;
  @Input() padding: string = '0.5rem 2rem';
  @Output() itemClick = new EventEmitter<BreadcrumbItem>();

  get breadcrumbClasses(): string {
    return `ax-breadcrumb ax-breadcrumb-${this.size}`;
  }

  get hostStyles(): Record<string, string | undefined> {
    return {
      background: this.backgroundColor,
      padding: this.padding,
      'border-bottom': this.showBorder
        ? '1px solid color-mix(in srgb, var(--ax-border-default) 50%, transparent)'
        : undefined,
    };
  }

  onItemClick(item: BreadcrumbItem, event: MouseEvent): void {
    if (item.url) {
      event.preventDefault();
      // Auto-navigate using Angular Router
      this.router.navigate([item.url]);
      // Still emit event for backward compatibility or custom handling
      this.itemClick.emit(item);
    }
  }

  isLastItem(index: number): boolean {
    return index === this.items.length - 1;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
