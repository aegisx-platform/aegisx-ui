import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppGroup } from '../models/ax-nav.model';

export interface AppSwitcherData {
  apps: readonly AppGroup[];
  activeAppId: string;
}

@Component({
  selector: 'ax-app-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="ax-app-switcher" (click)="$event.stopPropagation()">
      <!-- Header -->
      <div class="ax-app-switcher__header">
        <div>
          <div class="ax-app-switcher__title">Switch App</div>
          <div class="ax-app-switcher__subtitle">เลือกกลุ่มงานที่ต้องการ</div>
        </div>
        <button
          type="button"
          class="ax-app-switcher__close"
          (click)="dialogRef.close()"
          aria-label="Close app switcher"
        >
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Grid -->
      <div class="ax-app-switcher__grid">
        @for (app of data.apps; track app.id) {
          <button
            type="button"
            class="ax-app-switcher__card"
            [class.ax-app-switcher__card--active]="app.id === data.activeAppId"
            [style.borderColor]="
              app.id === data.activeAppId ? app.color : 'transparent'
            "
            [style.background]="
              app.id === data.activeAppId
                ? app.color + '14'
                : 'var(--ax-surface-subtle, #f8fafc)'
            "
            (click)="selectApp(app)"
          >
            <div
              class="ax-app-switcher__icon"
              [style.background]="app.color + '26'"
              [style.color]="app.color"
            >
              <mat-icon [svgIcon]="app.icon"></mat-icon>
            </div>
            <div class="ax-app-switcher__label">{{ app.label }}</div>
            <div class="ax-app-switcher__label-th">{{ app.labelTh }}</div>
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ax-app-switcher {
        width: 480px;
        background: var(--ax-surface, #fff);
        border-radius: 20px;
        padding: 28px 28px 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        animation: popIn 0.2s ease;
      }

      .ax-app-switcher__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .ax-app-switcher__title {
        font-size: 18px;
        font-weight: 700;
        color: var(--ax-text-primary, #0f172a);
      }

      .ax-app-switcher__subtitle {
        font-size: 13px;
        color: var(--ax-text-muted, #94a3b8);
        margin-top: 2px;
      }

      .ax-app-switcher__close {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: none;
        background: var(--ax-surface-hover, #f1f5f9);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ax-text-secondary, #64748b);
      }

      .ax-app-switcher__close:hover {
        background: var(--ax-surface-active, #e2e8f0);
      }

      .ax-app-switcher__close mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .ax-app-switcher__grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;
      }

      .ax-app-switcher__card {
        padding: 18px 12px;
        border-radius: 14px;
        border: 2px solid transparent;
        cursor: pointer;
        text-align: center;
        transition: all 0.15s;
      }

      .ax-app-switcher__card:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }

      .ax-app-switcher__icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 10px;
      }

      .ax-app-switcher__icon mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .ax-app-switcher__label {
        font-size: 14px;
        font-weight: 600;
        color: var(--ax-text-primary, #0f172a);
      }

      .ax-app-switcher__label-th {
        font-size: 11px;
        color: var(--ax-text-muted, #94a3b8);
        margin-top: 2px;
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
export class AxAppSwitcherComponent {
  readonly dialogRef = inject(DialogRef<AppGroup | undefined>);
  readonly data: AppSwitcherData = inject(DIALOG_DATA);

  selectApp(app: AppGroup): void {
    this.dialogRef.close(app);
  }
}
