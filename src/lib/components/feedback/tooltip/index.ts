// Export types first to avoid duplicates
export * from './tooltip.types';

// Export component (but not the duplicate TooltipPosition type)
export { TooltipComponent } from './tooltip.component';

// Export directive (but not the duplicate TooltipPosition type)
export { TooltipDirective } from './tooltip.directive';
