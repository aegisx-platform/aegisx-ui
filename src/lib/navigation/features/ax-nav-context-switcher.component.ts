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

export interface ContextOption {
  readonly id: string;
  readonly label: string;
  readonly code?: string;
  readonly icon?: string;
}

@Component({
  selector: 'ax-nav-context-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="ax-nav-ctx">
      <div class="ax-nav-ctx__title">{{ title }}</div>
      @for (opt of options; track opt.id) {
        <button
          type="button"
          class="ax-nav-ctx__item"
          [class.ax-nav-ctx__item--active]="opt.id === activeId"
          (click)="selectOption(opt)"
        >
          @if (opt.icon) {
            <mat-icon class="ax-nav-ctx__icon" [svgIcon]="opt.icon"></mat-icon>
          } @else {
            <mat-icon class="ax-nav-ctx__icon">business</mat-icon>
          }
          <div class="ax-nav-ctx__label-wrap">
            <div class="ax-nav-ctx__label">{{ opt.label }}</div>
            @if (opt.code) {
              <div class="ax-nav-ctx__code">{{ opt.code }}</div>
            }
          </div>
          @if (opt.id === activeId) {
            <mat-icon class="ax-nav-ctx__check">check</mat-icon>
          }
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        left: calc(100% + 12px);
        top: 0;
        z-index: var(--ax-z-nav-overlay, 9999);
      }

      .ax-nav-ctx {
        width: 220px;
        background: var(--ax-surface, #fff);
        border-radius: var(--ax-radius-lg, 12px);
        padding: var(--ax-spacing-sm);
        box-shadow: var(--ax-nav-popover-shadow,
          0 8px 30px rgba(0, 0, 0, 0.12),
          0 0 0 1px rgba(0, 0, 0, 0.06));
        animation: popIn 0.15s ease;
      }

      .ax-nav-ctx__title {
        font-size: 11px;
        font-weight: 600;
        color: var(--ax-text-muted, #94a3b8);
        padding: 6px 8px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .ax-nav-ctx__item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        width: 100%;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        background: transparent;
        font-size: 13px;
        color: var(--ax-text-secondary, #475569);
        font-weight: 400;
        text-align: left;
        transition: background var(--ax-duration-instant, 100ms);
      }
      .ax-nav-ctx__item:hover {
        background: var(--ax-hover, #f8fafc);
      }
      .ax-nav-ctx__item--active {
        background: var(--ax-primary-subtle, #eff6ff);
        color: var(--ax-primary-dark, #1e40af);
        font-weight: 600;
      }
      .ax-nav-ctx__item--active:hover {
        background: var(--ax-primary-hover, #dbeafe);
      }

      .ax-nav-ctx__icon {
        color: var(--ax-text-muted, #94a3b8);
        font-size: 16px;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }
      .ax-nav-ctx__item--active .ax-nav-ctx__icon {
        color: var(--ax-primary, #3b82f6);
      }

      .ax-nav-ctx__label-wrap {
        flex: 1;
        min-width: 0;
      }

      .ax-nav-ctx__label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .ax-nav-ctx__code {
        font-size: 10px;
        color: var(--ax-text-muted, #94a3b8);
      }
      .ax-nav-ctx__item--active .ax-nav-ctx__code {
        color: var(--ax-primary-light, #60a5fa);
      }

      .ax-nav-ctx__check {
        color: var(--ax-primary, #3b82f6);
        font-size: 16px;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
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
export class AxNavContextSwitcherComponent implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) title!: string;
  @Input({ required: true }) options!: readonly ContextOption[];
  @Input({ required: true }) activeId!: string;

  @Output() readonly optionSelect = new EventEmitter<ContextOption>();
  @Output() readonly closed = new EventEmitter<void>();

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

  selectOption(opt: ContextOption): void {
    this.optionSelect.emit(opt);
  }
}
