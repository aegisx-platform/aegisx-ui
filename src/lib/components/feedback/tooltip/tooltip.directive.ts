import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  ComponentRef,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import { TooltipComponent } from './tooltip.component';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[axTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('axTooltip') text = '';
  @Input() tooltipPosition: TooltipPosition = 'top';
  @Input() tooltipDelay = 200;

  private componentRef: ComponentRef<TooltipComponent> | null = null;
  private showTimeout: any;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.text) return;

    this.showTimeout = setTimeout(() => {
      this.show();
    }, this.tooltipDelay);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    this.hide();
  }

  private show(): void {
    if (this.componentRef) return;

    this.componentRef = this.viewContainerRef.createComponent(TooltipComponent);
    this.componentRef.instance.text = this.text;
    this.componentRef.instance.position = this.tooltipPosition;

    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipPos =
      this.componentRef.location.nativeElement.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (this.tooltipPosition) {
      case 'top':
        top = hostPos.top - tooltipPos.height - 8;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'bottom':
        top = hostPos.bottom + 8;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'left':
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.left - tooltipPos.width - 8;
        break;
      case 'right':
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.right + 8;
        break;
    }

    this.componentRef.instance.top = top;
    this.componentRef.instance.left = left;
  }

  private hide(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  ngOnDestroy(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    this.hide();
  }
}
