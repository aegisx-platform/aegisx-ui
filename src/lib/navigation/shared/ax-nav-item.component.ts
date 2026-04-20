import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavModule, NavModuleType } from '../models/ax-nav.model';
import { AxNavBadgeComponent } from './ax-nav-badge.component';
import { AxNavActiveBarComponent } from './ax-nav-active-bar.component';

@Component({
  selector: 'ax-nav-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatTooltipModule,
    AxNavBadgeComponent,
    AxNavActiveBarComponent,
  ],
  template: `
    <div class="ax-nav-item__wrapper">
      @switch (moduleType) {
        @case ('divider') {
          <div class="ax-nav-item__divider" [attr.aria-hidden]="true">
            @if (showLabel && module.label) {
              <span class="ax-nav-item__divider-label">{{ module.label }}</span>
            }
          </div>
        }
        @case ('external') {
          <a
            class="ax-nav-item"
            [class.ax-nav-item--topbar]="variant === 'topbar'"
            [class.ax-nav-item--dock]="variant === 'dock'"
            [href]="module.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            [matTooltip]="showTooltip ? module.label : ''"
            matTooltipPosition="right"
            [attr.aria-label]="module.label + ' (external)'"
            (click)="moduleClick.emit(module)"
          >
            <mat-icon
              class="ax-nav-item__icon"
              [svgIcon]="resolvedIcon()"
            ></mat-icon>
            @if (showLabel) {
              <span class="ax-nav-item__label">{{ module.label }}</span>
              <mat-icon class="ax-nav-item__external-indicator"
                >open_in_new</mat-icon
              >
            }
          </a>
        }
        @default {
          @if (showActiveBar && variant !== 'dock') {
            <ax-nav-active-bar [active]="active" [color]="appColor" />
          }
          <button
            type="button"
            class="ax-nav-item"
            [class.ax-nav-item--active-rail]="active && variant === 'rail'"
            [class.ax-nav-item--active-dock]="active && variant === 'dock'"
            [class.ax-nav-item--active-topbar]="active && variant === 'topbar'"
            [class.ax-nav-item--dock]="variant === 'dock'"
            [class.ax-nav-item--topbar]="variant === 'topbar'"
            [class.ax-nav-item--has-children]="
              variant === 'dock' && hasChildren
            "
            [matTooltip]="showTooltip ? module.label : ''"
            matTooltipPosition="right"
            [attr.aria-label]="module.label"
            [attr.aria-current]="active ? 'page' : null"
            [attr.aria-expanded]="hasChildren ? isExpanded : null"
            (click)="moduleClick.emit(module)"
          >
            <mat-icon
              class="ax-nav-item__icon"
              [class.ax-nav-item__icon--diamond]="isDiamond()"
              [svgIcon]="resolvedIcon()"
            ></mat-icon>
            @if (showLabel) {
              <span class="ax-nav-item__label">{{ module.label }}</span>
            }
            @if (module.badge && !(active && variant === 'dock')) {
              @if (showLabel) {
                <ax-nav-badge [count]="module.badge" />
              } @else {
                <ax-nav-badge [count]="module.badge" [dot]="true" />
              }
            }
            @if (variant === 'dock' && hasChildren) {
              <mat-icon
                class="ax-nav-item__chevron"
                [class.ax-nav-item__chevron--expanded]="isExpanded"
                aria-hidden="true"
                >chevron_right</mat-icon
              >
            }
          </button>
        }
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        font-family: inherit;
      }

      :host-context(.ax-nav-topbar__tabs) {
        width: auto;
      }

      .ax-nav-item__wrapper {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .ax-nav-item {
        width: var(--ax-nav-btn-size, 46px);
        height: var(--ax-nav-btn-size, 46px);
        border-radius: var(--ax-nav-btn-radius, 10px);
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        outline: none;
        cursor: pointer;
        position: relative;
        background: transparent;
        color: var(--ax-nav-icon-default, #94a3b8);
        transition: all var(--ax-duration-fast, 150ms) ease;
      }

      .ax-nav-item:hover {
        background: var(--ax-nav-btn-hover, rgba(148, 163, 184, 0.12));
        color: var(--ax-nav-icon-hover, #cbd5e1);
      }

      /* Rail active */
      .ax-nav-item--active-rail {
        background: var(--ax-nav-btn-active, rgba(59, 130, 246, 0.2));
        color: var(--ax-nav-icon-active, #3b82f6);
      }
      .ax-nav-item--active-rail:hover {
        background: var(--ax-nav-btn-active, rgba(59, 130, 246, 0.25));
        color: var(--ax-nav-icon-active, #3b82f6);
      }

      /* Dock variant */
      .ax-nav-item--dock {
        background: var(--ax-nav-dock-btn-bg, rgba(148, 163, 184, 0.08));
      }
      .ax-nav-item--dock:hover {
        background: var(--ax-nav-btn-hover, rgba(148, 163, 184, 0.15));
        color: var(--ax-nav-text-on-dark, #fff);
        transform: scale(1.06);
      }
      .ax-nav-item--active-dock {
        background: var(--ax-nav-dock-btn-active, #fff);
        color: var(--ax-nav-bg, #0f172a);
        box-shadow: var(
          --ax-nav-dock-item-shadow,
          0 2px 12px rgba(0, 0, 0, 0.15)
        );
      }
      .ax-nav-item--active-dock:hover {
        background: var(--ax-nav-dock-btn-active, #fff);
        color: var(--ax-nav-bg, #1a1d23);
        transform: scale(1);
      }

      /* Topbar variant */
      .ax-nav-item--topbar {
        width: auto;
        height: auto;
        border-radius: var(--ax-radius-md, 8px);
        padding: 6px 12px;
        gap: 5px;
        font-size: 13px;
        font-weight: 400;
        color: var(--ax-nav-icon-default, rgba(255, 255, 255, 0.5));
        white-space: nowrap;
      }
      .ax-nav-item--topbar:hover {
        background: var(--ax-nav-btn-hover, rgba(255, 255, 255, 0.05));
        color: var(--ax-nav-icon-hover, rgba(255, 255, 255, 0.8));
      }
      .ax-nav-item--active-topbar {
        background: var(
          --ax-nav-topbar-item-active-bg,
          rgba(255, 255, 255, 0.12)
        );
        color: var(--ax-nav-text-on-dark, #fff);
        font-weight: 600;
      }
      .ax-nav-item--active-topbar:hover {
        background: var(
          --ax-nav-topbar-item-active-hover,
          rgba(255, 255, 255, 0.15)
        );
      }

      .ax-nav-item__icon {
        flex-shrink: 0;
        font-size: 22px;
        width: 22px;
        height: 22px;
        overflow: visible;
      }

      /* Ensure the inner SVG fills the mat-icon host element */
      .ax-nav-item__icon svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .ax-nav-item__icon--diamond {
        width: 32px;
        height: 32px;
        font-size: 32px;
        /* Do not reset color — let it inherit from the button */
      }

      .ax-nav-item--topbar .ax-nav-item__icon--diamond {
        width: 24px;
        height: 24px;
        font-size: 24px;
      }

      .ax-nav-item__label {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Divider */
      .ax-nav-item__divider {
        width: 100%;
        padding: 6px 12px;
      }
      .ax-nav-item__divider::after {
        content: '';
        display: block;
        height: 1px;
        background: var(--ax-nav-divider, rgba(148, 163, 184, 0.15));
      }
      .ax-nav-item__divider-label {
        display: block;
        font-size: 9px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--ax-nav-icon-default, #94a3b8);
        margin-bottom: 4px;
      }

      /* External link indicator */
      .ax-nav-item__external-indicator {
        font-size: 12px;
        width: 12px;
        height: 12px;
        opacity: 0.4;
        margin-left: auto;
        flex-shrink: 0;
      }

      /* External link (anchor) inherits button styles */
      a.ax-nav-item {
        text-decoration: none;
        color: inherit;
      }

      /* Chevron indicator for dock items with children */
      .ax-nav-item__chevron {
        position: absolute;
        right: -2px;
        top: -2px;
        width: 14px;
        height: 14px;
        font-size: 14px;
        color: var(--ax-nav-icon-default, #94a3b8);
        opacity: 0.7;
        transition:
          transform var(--ax-duration-fast, 150ms) ease,
          opacity var(--ax-duration-fast, 150ms) ease;
        pointer-events: none;
      }
      .ax-nav-item__chevron--expanded {
        transform: rotate(90deg);
        opacity: 1;
        color: var(--ax-nav-icon-active, #3b82f6);
      }
      .ax-nav-item--active-dock .ax-nav-item__chevron {
        color: var(--ax-nav-bg, #0f172a);
        opacity: 1;
      }
    `,
  ],
})
export class AxNavItemComponent {
  @Input({ required: true }) module!: NavModule;
  @Input() active = false;
  @Input() appColor = 'var(--ax-primary, #3b82f6)';
  @Input() variant: 'rail' | 'dock' | 'topbar' = 'rail';
  @Input() showTooltip = true;
  @Input() showActiveBar = true;
  @Input() showLabel = false;
  @Input() iconStyle: 'mono' | 'diamond' = 'mono';
  @Input() darkContext = true;
  @Input() hasChildren = false;
  @Input() isExpanded = false;
  @Output() moduleClick = new EventEmitter<NavModule>();

  get moduleType(): NavModuleType {
    return this.module.type ?? 'route';
  }

  isDiamond(): boolean {
    return (this.module.iconStyle ?? this.iconStyle) === 'diamond';
  }

  resolvedIcon(): string {
    const icon = this.module.icon;
    // Strip legacy axd:/axdl: prefixes → use ax: mono icon
    if (icon.startsWith('axd:') || icon.startsWith('axdl:')) {
      return `ax:${icon.split(':')[1]}`;
    }
    if (icon.includes(':')) return icon;
    return `ax:${icon}`;
  }
}
