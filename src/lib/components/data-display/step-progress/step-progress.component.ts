import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  input,
  output,
} from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  StepProgressItem,
  StepProgressOverflow,
  StepProgressSize,
} from './step-progress.types';

/**
 * `<ax-step-progress>` — compact horizontal step-progress timeline.
 *
 * Supports three sizes (sm / md / lg), five step states, and three overflow
 * modes. Pure presentation — owns no HTTP, no router. Designed for inline use
 * in data-table rows as well as larger detail-page headers.
 *
 * @example
 * <ax-step-progress [steps]="items" size="sm" overflow="collapse" [maxVisible]="5" />
 */
@Component({
  selector: 'ax-step-progress',
  standalone: true,
  imports: [DatePipe, NgTemplateOutlet, MatIconModule, MatTooltipModule],
  templateUrl: './step-progress.component.html',
  styleUrls: ['./step-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AxStepProgressComponent {
  /** Ordered list of steps to display. Required. */
  readonly steps = input.required<StepProgressItem[]>();

  /** Visual density. Defaults to 'sm' for table-row use. */
  readonly size = input<StepProgressSize>('sm');

  /** How to handle step lists wider than the container. */
  readonly overflow = input<StepProgressOverflow>('none');

  /** Max visible markers when overflow='collapse'. Ignored otherwise. */
  readonly maxVisible = input<number>(5);

  /** When true, markers are keyboard-focusable and emit (stepClick). */
  readonly clickable = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  /** aria-label for the whole group. */
  readonly ariaLabel = input<string>('Step progress');

  /** Emitted when a marker is activated (click / Enter / Space). */
  readonly stepClick = output<StepProgressItem>();

  @HostBinding('class') get hostClass(): string {
    return `size-${this.size()} overflow-${this.overflow()}`;
  }

  @HostBinding('attr.role') readonly role = 'group';

  @HostBinding('attr.aria-label') get labelAttr(): string {
    return this.ariaLabel();
  }

  /**
   * Derived view: full list when overflow !== 'collapse', otherwise a
   * trimmed list containing first + current + last + up to (maxVisible - 3)
   * neighbours of the current step.
   *
   * Returns an array of { type: 'step', item } | { type: 'ellipsis', count, hiddenLabels }.
   */
  protected readonly visibleItems = computed(() => {
    const steps = this.steps();
    const max = this.maxVisible();
    if (this.overflow() !== 'collapse' || steps.length <= max) {
      return steps.map((item) => ({ type: 'step' as const, item }));
    }
    const currentIndex = steps.findIndex((s) => s.status === 'current');
    const anchor = currentIndex === -1 ? steps.length - 1 : currentIndex;
    const lastIndex = steps.length - 1;

    const kept = new Set<number>([0, anchor, lastIndex]);
    let before = anchor - 1;
    let after = anchor + 1;
    while (kept.size < max) {
      const addedBefore = before > 0 && !kept.has(before);
      if (addedBefore) {
        kept.add(before);
        before--;
        if (kept.size >= max) break;
      }
      const addedAfter = after < lastIndex && !kept.has(after);
      if (addedAfter) {
        kept.add(after);
        after++;
      }
      if (!addedBefore && !addedAfter) break;
    }

    const ordered = Array.from(kept).sort((a, b) => a - b);
    const result: Array<
      | { type: 'step'; item: StepProgressItem }
      | { type: 'ellipsis'; count: number; hiddenLabels: string[] }
    > = [];

    for (let i = 0; i < ordered.length; i++) {
      result.push({ type: 'step', item: steps[ordered[i]] });
      const next = ordered[i + 1];
      if (next !== undefined && next - ordered[i] > 1) {
        const hiddenLabels = steps
          .slice(ordered[i] + 1, next)
          .map((s) => s.label);
        result.push({
          type: 'ellipsis',
          count: hiddenLabels.length,
          hiddenLabels,
        });
      }
    }
    return result;
  });

  protected fallbackIndex(index: number): string {
    return String(index + 1);
  }

  /**
   * Status of the connector AFTER visibleItems[i] — inherits from the NEXT
   * rendered step's status (or 'upcoming' when the next node is an ellipsis
   * or end-of-list).
   *
   * This matches the reference UX where the line between current and the
   * next upcoming step reads as "not yet reached" (dashed / muted), not
   * "already traversed" (solid dark).
   */
  protected connectorStatusAfter(i: number): string {
    const nodes = this.visibleItems();
    const nextNode = nodes[i + 1];
    if (!nextNode) return 'upcoming';
    if (nextNode.type === 'ellipsis') return 'upcoming';
    return nextNode.item.status;
  }

  protected onStepClick(item: StepProgressItem): void {
    if (this.clickable()) {
      this.stepClick.emit(item);
    }
  }

  protected onStepKeydown(event: KeyboardEvent, item: StepProgressItem): void {
    if (!this.clickable()) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.stepClick.emit(item);
    }
  }

  protected tooltipFor(item: StepProgressItem): string {
    const parts: string[] = [item.label];
    if (item.status === 'completed' && item.actor) {
      parts.push(`โดย ${item.actor}`);
    }
    if (item.status === 'completed' && item.timestamp) {
      parts.push(new Date(item.timestamp).toLocaleDateString('th-TH'));
    }
    return parts.join(' · ');
  }

  protected ariaForMarker(
    item: StepProgressItem,
    index: number,
    total: number,
  ): string {
    return `Step ${index + 1} of ${total}, ${item.label}, ${item.status}`;
  }
}
