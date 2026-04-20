import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AvatarSize, AvatarShape, AvatarColor } from './avatar.types';

@Component({
  selector: 'ax-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AxAvatarComponent {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() name: string = '';
  @Input() size: AvatarSize = 'md';
  @Input() shape: AvatarShape = 'circle';
  /** Optional tint color — see {@link AvatarColor}. */
  @Input() color?: AvatarColor;

  imageError = false;

  get avatarClasses(): string {
    const classes = ['ax-avatar'];
    classes.push(`ax-avatar-${this.size}`);
    classes.push(`ax-avatar-${this.shape}`);
    if (this.color) classes.push(`ax-avatar-tint-${this.color}`);
    return classes.join(' ');
  }

  get initials(): string {
    if (!this.name) return '';
    const parts = this.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return this.name.substring(0, 2).toUpperCase();
  }

  onImageError(): void {
    this.imageError = true;
  }
}
