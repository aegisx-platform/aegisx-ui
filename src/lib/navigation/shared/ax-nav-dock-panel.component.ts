import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AxNavBadgeComponent } from './ax-nav-badge.component';
import { NavModule, NavChild } from '../models/ax-nav.model';

@Component({
  selector: 'ax-nav-dock-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, AxNavBadgeComponent],
  template: `
    <aside
      class="ax-nav-dock-panel"
      role="navigation"
      [attr.aria-label]="'Sub-navigation for ' + module.label"
    >
      <header class="ax-nav-dock-panel__header">
        <span class="ax-nav-dock-panel__title">{{ module.label }}</span>
        <button
          type="button"
          class="ax-nav-dock-panel__close"
          (click)="closed.emit()"
          aria-label="Close sub-navigation"
        >
          <mat-icon>close</mat-icon>
        </button>
      </header>

      <nav class="ax-nav-dock-panel__list">
        @for (child of module.children ?? []; track child.id) {
          <button
            type="button"
            class="ax-nav-dock-panel__item"
            [class.ax-nav-dock-panel__item--active]="
              child.route === activeChildRoute
            "
            [style.--ax-nav-dock-panel-active-color]="appColor"
            (click)="childSelect.emit(child)"
          >
            @if (child.icon) {
              <mat-icon
                class="ax-nav-dock-panel__icon"
                [svgIcon]="resolveIcon(child.icon)"
              ></mat-icon>
            }
            <span class="ax-nav-dock-panel__label">{{ child.label }}</span>
            @if (child.badge) {
              <ax-nav-badge [count]="child.badge" />
            }
          </button>
        }
      </nav>
    </aside>
  `,
  styles: [
    `
      :host {
        display: contents;
        font-family: inherit;
      }

      .ax-nav-dock-panel {
        position: absolute;
        left: calc(var(--ax-spacing-md, 16px) + 80px);
        top: var(--ax-spacing-md, 16px);
        bottom: var(--ax-spacing-md, 16px);
        width: 240px;
        background: var(--ax-nav-panel-bg, #fff);
        border-radius: 0 var(--ax-radius-lg, 12px) var(--ax-radius-lg, 12px) 0;
        border: var(--ax-border-width-thin, 1px) solid
          var(--ax-nav-dock-border, rgba(148, 163, 184, 0.1));
        border-left: none;
        box-shadow: var(
          --ax-nav-dock-shadow,
          0 8px 40px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(148, 163, 184, 0.08)
        );
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: var(--ax-z-nav-dock, 50);
        animation: axNavDockPanelSlide 200ms ease-out;
      }

      @keyframes axNavDockPanelSlide {
        from {
          opacity: 0;
          transform: translateX(-12px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .ax-nav-dock-panel__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 16px 10px;
        flex-shrink: 0;
      }

      .ax-nav-dock-panel__title {
        font-size: 14px;
        font-weight: 700;
        color: var(--ax-nav-panel-text, #0f172a);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .ax-nav-dock-panel__close {
        width: 26px;
        height: 26px;
        border-radius: 6px;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ax-nav-panel-icon-muted, #94a3b8);
        transition: background var(--ax-duration-fast, 150ms);
      }
      .ax-nav-dock-panel__close:hover {
        background: var(--ax-nav-panel-item-hover-bg, #f8fafc);
        color: var(--ax-nav-panel-text, #0f172a);
      }
      .ax-nav-dock-panel__close:focus-visible {
        outline: 2px solid var(--ax-primary, #3b82f6);
        outline-offset: 2px;
      }
      .ax-nav-dock-panel__close mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .ax-nav-dock-panel__list {
        flex: 1;
        overflow-y: auto;
        padding: 0 12px 12px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .ax-nav-dock-panel__item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 12px;
        border-radius: 8px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--ax-nav-panel-text-muted, #64748b);
        font-weight: 450;
        font-size: 13.5px;
        text-align: left;
        width: 100%;
        transition: background var(--ax-duration-instant, 100ms);
      }
      .ax-nav-dock-panel__item:hover {
        background: var(--ax-nav-panel-item-hover-bg, #f8fafc);
        color: var(--ax-nav-panel-text, #0f172a);
      }
      .ax-nav-dock-panel__item:focus-visible {
        outline: 2px solid var(--ax-primary, #3b82f6);
        outline-offset: -2px;
      }
      .ax-nav-dock-panel__item--active {
        background: var(--ax-nav-panel-item-active-bg, #f1f5f9);
        color: var(--ax-nav-panel-text, #0f172a);
        font-weight: 600;
      }
      .ax-nav-dock-panel__item--active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 18px;
        border-radius: 0 2px 2px 0;
        background: var(
          --ax-nav-dock-panel-active-color,
          var(--ax-primary, #3b82f6)
        );
      }

      .ax-nav-dock-panel__icon {
        flex-shrink: 0;
        width: 18px;
        height: 18px;
        font-size: 18px;
        color: var(--ax-nav-panel-icon-muted, #94a3b8);
        overflow: visible;
      }
      .ax-nav-dock-panel__icon svg {
        width: 100%;
        height: 100%;
      }

      .ax-nav-dock-panel__label {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ],
})
export class AxNavDockPanelComponent {
  @Input({ required: true }) module!: NavModule;
  @Input({ required: true }) appColor!: string;
  @Input() activeChildRoute: string | null = null;

  @Output() childSelect = new EventEmitter<NavChild>();
  @Output() closed = new EventEmitter<void>();

  resolveIcon(icon: string): string {
    if (icon.startsWith('axd:') || icon.startsWith('axdl:')) {
      return `ax:${icon.split(':')[1]}`;
    }
    if (icon.includes(':')) return icon;
    return `ax:${icon}`;
  }
}
