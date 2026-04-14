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
import {
  NavUser,
  NavMode,
  Hospital,
  LAYOUT_OPTIONS,
} from '../models/ax-nav.model';

@Component({
  selector: 'ax-nav-user-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="ax-nav-user-menu">
      <!-- User info -->
      <div class="ax-nav-user-menu__info">
        <div class="ax-nav-user-menu__name">{{ user.name }}</div>
        <div class="ax-nav-user-menu__role">{{ user.role }}</div>
        @if (hospital) {
          <div class="ax-nav-user-menu__hospital">{{ hospital.label }}</div>
        }
      </div>

      <div class="ax-nav-user-menu__divider"></div>

      <!-- Links -->
      <button
        type="button"
        class="ax-nav-user-menu__item"
        (click)="menuAction.emit('profile')"
      >
        <mat-icon class="ax-nav-user-menu__item-icon">person</mat-icon>
        <span>โปรไฟล์</span>
      </button>
      <button
        type="button"
        class="ax-nav-user-menu__item"
        (click)="menuAction.emit('settings')"
      >
        <mat-icon class="ax-nav-user-menu__item-icon">settings</mat-icon>
        <span>ตั้งค่า</span>
      </button>

      <div class="ax-nav-user-menu__divider"></div>

      <!-- Layout picker -->
      <div class="ax-nav-user-menu__layout-section">
        <div class="ax-nav-user-menu__layout-label">LAYOUT</div>
        <div class="ax-nav-user-menu__layout-buttons">
          @for (opt of layoutOptions; track opt.id) {
            <button
              type="button"
              class="ax-nav-user-menu__layout-btn"
              [class.ax-nav-user-menu__layout-btn--active]="
                opt.id === currentMode
              "
              [attr.aria-label]="'Switch to ' + opt.label + ' layout'"
              [attr.title]="opt.description"
              (click)="modeChange.emit(opt.id)"
            >
              @if (opt.icon) {
                <mat-icon class="ax-nav-user-menu__layout-icon">{{ opt.icon }}</mat-icon>
              } @else {
                {{ opt.label }}
              }
            </button>
          }
        </div>
      </div>

      <div class="ax-nav-user-menu__divider"></div>

      <!-- Logout -->
      <button
        type="button"
        class="ax-nav-user-menu__item ax-nav-user-menu__logout"
        (click)="menuAction.emit('logout')"
      >
        <mat-icon class="ax-nav-user-menu__item-icon">logout</mat-icon>
        <span>ออกจากระบบ</span>
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        bottom: calc(100% + 8px);
        left: 0;
        z-index: 9999;
      }

      :host-context(.ax-nav-shell--topnav) {
        bottom: auto;
        top: 0;
        left: auto;
        right: 0;
      }

      .ax-nav-user-menu {
        width: 240px;
        background: var(--ax-surface, #fff);
        border-radius: 14px;
        box-shadow:
          0 8px 30px rgba(0, 0, 0, 0.12),
          0 0 0 1px rgba(0, 0, 0, 0.06);
        overflow: hidden;
        padding-bottom: 8px;
        animation: popIn 0.18s ease;
      }

      .ax-nav-user-menu__info {
        padding: 16px 16px 12px;
      }

      .ax-nav-user-menu__name {
        font-size: 14px;
        font-weight: 600;
        color: var(--ax-text-primary, #0f172a);
      }

      .ax-nav-user-menu__role {
        font-size: 12px;
        color: var(--ax-text-muted, #94a3b8);
      }

      .ax-nav-user-menu__hospital {
        font-size: 11px;
        color: var(--ax-text-disabled, #cbd5e1);
        margin-top: 2px;
      }

      .ax-nav-user-menu__divider {
        height: 1px;
        background: var(--ax-border-subtle, #f1f5f9);
      }

      .ax-nav-user-menu__item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        width: 100%;
        border: none;
        cursor: pointer;
        background: transparent;
        font-size: 13px;
        color: var(--ax-text-secondary, #475569);
        text-align: left;
        transition: background 0.1s;
      }
      .ax-nav-user-menu__item:hover {
        background: var(--ax-surface-hover, #f8fafc);
      }

      .ax-nav-user-menu__logout:hover {
        background: var(--ax-background-subtle);
      }

      .ax-nav-user-menu__item-icon {
        color: var(--ax-text-muted, #94a3b8);
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      .ax-nav-user-menu__logout .ax-nav-user-menu__item-icon {
        color: inherit;
      }

      .ax-nav-user-menu__layout-section {
        padding: 12px 16px 14px;
      }

      .ax-nav-user-menu__layout-label {
        font-size: 10px;
        font-weight: 600;
        color: var(--ax-text-muted, #94a3b8);
        margin-bottom: 8px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .ax-nav-user-menu__layout-buttons {
        display: flex;
        gap: 2px;
        background: var(--ax-surface-muted, #f1f5f9);
        border-radius: 8px;
        padding: 3px;
      }

      .ax-nav-user-menu__layout-btn {
        flex: 1;
        padding: 6px 0;
        border-radius: 6px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 11px;
        font-weight: 500;
        color: var(--ax-text-secondary, #64748b);
        transition: all 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ax-nav-user-menu__layout-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      .ax-nav-user-menu__layout-btn:hover {
        color: var(--ax-text-primary, #0f172a);
        background: rgba(255, 255, 255, 0.5);
      }
      .ax-nav-user-menu__layout-btn--active {
        background: var(--ax-surface, #fff);
        color: var(--ax-text-primary, #0f172a);
        font-weight: 600;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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
export class AxNavUserMenuComponent implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) user!: NavUser;
  @Input() hospital?: Hospital;
  @Input() currentMode: NavMode = 'rail';

  @Output() menuAction = new EventEmitter<
    'profile' | 'settings' | 'theme' | 'logout'
  >();
  @Output() modeChange = new EventEmitter<NavMode>();
  @Output() closed = new EventEmitter<void>();

  readonly layoutOptions = LAYOUT_OPTIONS;

  ngOnInit(): void {
    // Close on click outside
    fromEvent<MouseEvent>(this.document, 'mousedown')
      .pipe(
        filter(
          (event) => !this.elementRef.nativeElement.contains(event.target),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.closed.emit());
  }
}
