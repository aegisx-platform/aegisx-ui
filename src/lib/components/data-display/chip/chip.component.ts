import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * Chip Component — Untitled UI "Tags" style
 *
 * Compact inline label for metadata, categories, filters.
 * Smaller than ax-badge — designed for dense info display.
 *
 * @example
 * <ax-chip>บัญชียาหลัก (E)</ax-chip>
 * <ax-chip color="success">2 หน่วยบรรจุ</ax-chip>
 * <ax-chip color="error" [removable]="true" (remove)="onRemove()">ยาที่ต้องระวังสูง</ax-chip>
 */
@Component({
  selector: 'ax-chip',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="chipClasses">
      @if (dot) {
        <span class="ax-chip__dot" [attr.data-color]="color"></span>
      }
      <span class="ax-chip__label"><ng-content></ng-content></span>
      @if (removable) {
        <button type="button" class="ax-chip__remove" (click)="onRemove($event)">
          <mat-icon>close</mat-icon>
        </button>
      }
    </span>
  `,
  styleUrls: ['./chip.component.scss'],
})
export class AxChipComponent {
  /** Semantic color */
  @Input() color: 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'brand' = 'neutral';

  /** Size */
  @Input() size: 'sm' | 'md' | 'lg' = 'sm';

  /** Show dot indicator */
  @Input() dot = false;

  /** Show remove button */
  @Input() removable = false;

  /** Emitted on remove click */
  @Output() remove = new EventEmitter<void>();

  get chipClasses(): string {
    return `ax-chip ax-chip--${this.size} ax-chip--${this.color}${this.dot ? ' ax-chip--dot' : ''}`;
  }

  onRemove(e: Event): void {
    e.stopPropagation();
    this.remove.emit();
  }
}
