import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { TmtService } from './tmt.service';
import { TmtConcept, TmtLevel, getTmtLevelConfig } from './tmt.types';

@Component({
  selector: 'ax-tmt-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  template: `
    @if (code) {
      <span
        class="tmt-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-all"
        [class]="badgeClasses()"
        [class.cursor-pointer]="clickable"
        [class.hover:shadow-sm]="clickable"
        [matTooltip]="tooltipText()"
        (click)="onClick()"
      >
        @if (showIcon) {
          <mat-icon class="!text-sm !w-3.5 !h-3.5">{{
            levelConfig().icon
          }}</mat-icon>
        }
        <span class="font-mono">{{ code }}</span>
        @if (showLevel) {
          <span class="opacity-70">[{{ level }}]</span>
        }
        @if (clickable) {
          <mat-icon
            class="!text-xs !w-3 !h-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >open_in_new</mat-icon
          >
        }
      </span>
    } @else {
      <span class="text-gray-400 text-xs">-</span>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
      .tmt-badge {
        line-height: 1.4;
      }
    `,
  ],
})
export class AxTmtBadgeComponent {
  private dialog = inject(MatDialog);
  private tmtService = inject(TmtService);

  // Inputs
  @Input() code: string | null = null;
  @Input() level: TmtLevel = 'GPU';
  @Input() showLevel = true;
  @Input() showIcon = true;
  @Input() clickable = true;
  @Input() size: 'sm' | 'md' = 'sm';

  // Outputs
  @Output() clicked = new EventEmitter<TmtConcept>();

  // Internal state
  private concept = signal<TmtConcept | null>(null);

  // Computed values
  levelConfig = computed(() => getTmtLevelConfig(this.level));

  badgeClasses = computed(() => {
    const config = this.levelConfig();
    const sizeClasses = this.size === 'sm' ? 'text-xs' : 'text-sm py-1 px-2.5';
    return `${config.bgClass} ${config.colorClass} ${config.borderClass} border ${sizeClasses} group`;
  });

  tooltipText = computed(() => {
    const config = this.levelConfig();
    const concept = this.concept();
    if (concept) {
      return `${concept.preferred_term || concept.fsn}\n${config.labelTh} (${config.label})`;
    }
    return `${config.labelTh} (${config.label})\nคลิกเพื่อดูรายละเอียด`;
  });

  onClick() {
    if (!this.clickable || !this.code) return;

    // Load concept and open dialog
    this.tmtService.getByCode(this.code).subscribe((concept) => {
      if (concept) {
        this.concept.set(concept);
        this.clicked.emit(concept);
        this.openDetailDialog(concept);
      }
    });
  }

  private async openDetailDialog(concept: TmtConcept) {
    // Dynamically import the dialog to avoid circular dependencies
    const { AxTmtDetailDialogComponent } = await import(
      './ax-tmt-detail-dialog.component'
    );
    this.dialog.open(AxTmtDetailDialogComponent, {
      data: { concept },
      width: '600px',
      maxHeight: '90vh',
    });
  }
}
