import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'ax-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class AxTabsComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeIndex = 0;
  @Output() activeIndexChange = new EventEmitter<number>();
  @Output() tabChange = new EventEmitter<number>();

  onTabClick(index: number): void {
    if (this.tabs[index].disabled) return;

    this.activeIndex = index;
    this.activeIndexChange.emit(index);
    this.tabChange.emit(index);
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
