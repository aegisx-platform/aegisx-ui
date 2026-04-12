import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  inject,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

/**
 * Auto-detect icon type directive for mat-icon.
 *
 * Detects whether the icon name is a Material font icon (no hyphen)
 * or a registered SVG icon (has hyphen) and sets the appropriate
 * rendering mode automatically.
 *
 * Convention:
 * - `home`, `settings`, `dashboard` → Material font icon (text content)
 * - `budget-ledger`, `purchase-order` → SVG icon ([svgIcon] binding)
 *
 * @example
 * ```html
 * <!-- Instead of manually switching between font/svg: -->
 * <mat-icon [axIcon]="item.icon"></mat-icon>
 *
 * <!-- Works for both: -->
 * <mat-icon [axIcon]="'home'"></mat-icon>         <!-- font icon -->
 * <mat-icon [axIcon]="'budget-ledger'"></mat-icon> <!-- svg icon -->
 * ```
 */
@Directive({
  selector: 'mat-icon[axIcon]',
  standalone: true,
})
export class AxIconDirective implements OnChanges {
  @Input() axIcon: string | undefined | null = '';

  private readonly matIcon = inject(MatIcon);
  private readonly el = inject(ElementRef);

  ngOnChanges(): void {
    const name = this.axIcon;
    if (!name) return;

    if (name.includes('-')) {
      // SVG icon — set svgIcon property, clear text content
      this.matIcon.svgIcon = name;
      this.el.nativeElement.textContent = '';
    } else {
      // Material font icon — clear svgIcon, set text content
      this.matIcon.svgIcon = '';
      this.el.nativeElement.textContent = name;
    }
  }
}
