import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  inject,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { NavMode, LAYOUT_OPTIONS } from '../models/ax-nav.model';

@Component({
  selector: 'ax-nav-config-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="ax-nav-config">
      <div class="ax-nav-config__title">Layout Mode</div>
      <div class="ax-nav-config__subtitle">เลือกรูปแบบ navigation</div>
      <div class="ax-nav-config__options">
        @for (opt of layoutOptions; track opt.id) {
          <button
            type="button"
            class="ax-nav-config__option"
            [class.ax-nav-config__option--active]="opt.id === currentMode"
            [attr.aria-label]="'Switch to ' + opt.label + ' layout'"
            (click)="selectMode(opt.id)"
          >
            <div class="ax-nav-config__option-label">{{ opt.label }}</div>
            <div class="ax-nav-config__option-desc">{{ opt.description }}</div>
            @if (opt.id === currentMode) {
              <mat-icon class="ax-nav-config__check">check_circle</mat-icon>
            }
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        left: calc(100% + 12px);
        bottom: 0;
        z-index: 9999;
      }

      .ax-nav-config {
        width: 200px;
        background: var(--ax-surface, #fff);
        border-radius: 12px;
        padding: 16px;
        box-shadow:
          0 8px 30px rgba(0, 0, 0, 0.12),
          0 0 0 1px rgba(0, 0, 0, 0.06);
        animation: popIn 0.18s ease;
      }

      .ax-nav-config__title {
        font-size: 14px;
        font-weight: 600;
        color: var(--ax-text-primary, #0f172a);
      }

      .ax-nav-config__subtitle {
        font-size: 11px;
        color: var(--ax-text-muted, #94a3b8);
        margin-bottom: 12px;
      }

      .ax-nav-config__options {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .ax-nav-config__option {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
        padding: 8px 10px;
        border-radius: 8px;
        border: 1.5px solid var(--ax-border, #e5e7eb);
        background: var(--ax-surface, #fff);
        cursor: pointer;
        text-align: left;
        width: 100%;
        transition: all 0.15s;
        position: relative;
      }
      .ax-nav-config__option:hover {
        border-color: var(--ax-border-hover, #cbd5e1);
        background: var(--ax-hover, #f8fafc);
      }
      .ax-nav-config__option--active {
        border-color: var(--ax-primary, #3b82f6);
        background: var(--ax-primary-subtle, #eff6ff);
      }
      .ax-nav-config__option--active:hover {
        background: var(--ax-primary-hover, #dbeafe);
      }

      .ax-nav-config__option-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--ax-text-primary, #0f172a);
        flex: 1;
      }
      .ax-nav-config__option--active .ax-nav-config__option-label {
        color: var(--ax-primary-dark, #2563eb);
      }

      .ax-nav-config__option-desc {
        font-size: 10px;
        color: var(--ax-text-muted, #94a3b8);
        width: 100%;
      }

      .ax-nav-config__check {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: var(--ax-primary, #3b82f6);
      }

      @keyframes popIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
  ],
})
export class AxNavConfigPopoverComponent implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  @Input() currentMode: NavMode = 'rail';
  @Output() readonly modeChange = new EventEmitter<NavMode>();
  @Output() readonly closed = new EventEmitter<void>();

  readonly layoutOptions = LAYOUT_OPTIONS;

  ngOnInit(): void {
    fromEvent<MouseEvent>(this.document, 'mousedown')
      .pipe(
        filter(
          (event) => !this.elementRef.nativeElement.contains(event.target),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.closed.emit());
  }

  selectMode(mode: NavMode): void {
    this.modeChange.emit(mode);
  }
}
