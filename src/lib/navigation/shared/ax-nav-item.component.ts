import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavModule } from '../models/ax-nav.model';
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
        [matTooltip]="showTooltip ? module.label : ''"
        matTooltipPosition="right"
        [attr.aria-label]="module.label"
        [attr.aria-current]="active ? 'page' : null"
        (click)="moduleClick.emit(module)"
      >
        <mat-icon class="ax-nav-item__icon" [svgIcon]="module.icon"></mat-icon>
        @if (showLabel) {
          <span class="ax-nav-item__label">{{ module.label }}</span>
        }
        @if (module.badge) {
          @if (showLabel) {
            <ax-nav-badge [count]="module.badge" />
          } @else {
            <ax-nav-badge [count]="module.badge" [dot]="true" />
          }
        }
      </button>
    </div>
  `,
  styles: [
    `
      .ax-nav-item__wrapper {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .ax-nav-item {
        width: 54px;
        height: 54px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        outline: none;
        cursor: pointer;
        position: relative;
        background: transparent;
        color: rgba(255, 255, 255, 0.4);
        transition: all 0.15s ease;
      }

      .ax-nav-item:hover {
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.8);
      }

      /* Rail active */
      .ax-nav-item--active-rail {
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
      }
      .ax-nav-item--active-rail:hover {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
      }

      /* Dock variant */
      .ax-nav-item--dock {
        background: rgba(255, 255, 255, 0.04);
      }
      .ax-nav-item--dock:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
        transform: scale(1.06);
      }
      .ax-nav-item--active-dock {
        background: #fff;
        color: #1a1d23;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      }
      .ax-nav-item--active-dock:hover {
        background: #fff;
        color: #1a1d23;
        transform: scale(1);
      }

      /* Topbar variant */
      .ax-nav-item--topbar {
        width: auto;
        height: auto;
        border-radius: 8px;
        padding: 6px 12px;
        gap: 5px;
        font-size: 13px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        white-space: nowrap;
      }
      .ax-nav-item--topbar:hover {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.8);
      }
      .ax-nav-item--active-topbar {
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        font-weight: 600;
      }
      .ax-nav-item--active-topbar:hover {
        background: rgba(255, 255, 255, 0.15);
      }

      .ax-nav-item__icon {
        flex-shrink: 0;
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .ax-nav-item__label {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ],
})
export class AxNavItemComponent {
  @Input({ required: true }) module!: NavModule;
  @Input() active = false;
  @Input() appColor = '#3b82f6';
  @Input() variant: 'rail' | 'dock' | 'topbar' = 'rail';
  @Input() showTooltip = true;
  @Input() showActiveBar = true;
  @Input() showLabel = false;
  @Output() moduleClick = new EventEmitter<NavModule>();
}
