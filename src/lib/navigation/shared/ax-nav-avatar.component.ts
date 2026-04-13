import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'ax-nav-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="ax-nav-avatar"
      [style.width.px]="size"
      [style.height.px]="size"
      [style.fontSize.px]="size > 38 ? 16 : 13"
      [style.borderRadius.px]="size > 30 ? 14 : 10"
      (click)="avatarClick.emit()"
      [attr.aria-label]="'User menu'"
    >
      @if (avatarUrl) {
        <img [src]="avatarUrl" [alt]="initials" class="ax-nav-avatar__img" />
      } @else {
        {{ initials }}
      }
      @if (online) {
        <span
          class="ax-nav-avatar__dot"
          [style.borderColor]="borderColor"
        ></span>
      }
    </button>
  `,
  styles: [
    `
      .ax-nav-avatar {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #3b82f6, #6366f1);
        color: #fff;
        font-weight: 700;
        cursor: pointer;
        border: none;
        flex-shrink: 0;
      }

      .ax-nav-avatar__img {
        width: 100%;
        height: 100%;
        border-radius: inherit;
        object-fit: cover;
      }

      .ax-nav-avatar__dot {
        position: absolute;
        bottom: -1px;
        right: -1px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #22c55e;
        border: 2px solid var(--ax-nav-avatar-dot-border, #1a1d23);
      }
    `,
  ],
})
export class AxNavAvatarComponent {
  @Input() size = 42;
  @Input() initials = '';
  @Input() avatarUrl?: string;
  @Input() online = true;
  @Input() borderColor = '#1a1d23';
  @Output() avatarClick = new EventEmitter<void>();
}
