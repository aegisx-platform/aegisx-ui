import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TmtService } from './tmt.service';
import {
  TmtConcept,
  TmtConceptWithChildren,
  TmtHierarchy,
  TmtLevel,
  getTmtLevelConfig,
} from './tmt.types';

@Component({
  selector: 'ax-tmt-hierarchy',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  template: `
    <div class="tmt-hierarchy">
      @if (loading()) {
        <div class="flex items-center justify-center p-4">
          <mat-spinner [diameter]="24"></mat-spinner>
          <span class="ml-2 text-sm text-gray-500">กำลังโหลด...</span>
        </div>
      } @else if (error()) {
        <div
          class="flex flex-col items-center justify-center p-4 text-gray-500"
        >
          <mat-icon class="!text-3xl mb-2">error_outline</mat-icon>
          <span class="text-sm">ไม่สามารถโหลดข้อมูลได้</span>
        </div>
      } @else if (hierarchy()) {
        <div class="hierarchy-tree text-sm">
          <!-- Ancestors (going up) -->
          @for (
            ancestor of hierarchy()!.ancestors;
            track ancestor.id;
            let i = $index
          ) {
            <div
              class="tree-node flex items-start gap-2 py-1"
              [style.padding-left.px]="i * 20"
            >
              <div class="flex items-start gap-1.5 flex-1 min-w-0">
                <span [class]="getNodeClasses(ancestor, false)">
                  <mat-icon class="!text-sm !w-4 !h-4">{{
                    getLevelIcon(ancestor.level)
                  }}</mat-icon>
                </span>
                <div class="flex-1 min-w-0">
                  <span
                    class="font-medium"
                    [class.break-words]="isNameExpanded(ancestor.id)"
                  >
                    {{ ancestor.level }}:
                    {{ getDisplayName(ancestor, !isNameExpanded(ancestor.id)) }}
                  </span>
                  @if (shouldShowToggle(ancestor)) {
                    <button
                      mat-icon-button
                      class="!w-5 !h-5 ml-1 align-middle"
                      (click)="toggleNameExpansion(ancestor.id, $event)"
                      [matTooltip]="
                        isNameExpanded(ancestor.id) ? 'ย่อชื่อ' : 'ดูชื่อเต็ม'
                      "
                    >
                      <mat-icon class="!text-sm !w-4 !h-4 text-gray-500">{{
                        isNameExpanded(ancestor.id)
                          ? 'unfold_less'
                          : 'unfold_more'
                      }}</mat-icon>
                    </button>
                  }
                  <span class="text-gray-400 text-xs font-mono ml-2"
                    >({{ ancestor.concept_code }})</span
                  >
                </div>
              </div>
            </div>
          }

          <!-- Current concept (highlighted) -->
          <div
            class="tree-node flex items-start gap-2 py-1.5 bg-blue-50 rounded-md -mx-2 px-2"
            [style.padding-left.px]="hierarchy()!.ancestors.length * 20"
          >
            <div class="flex items-start gap-1.5 flex-1 min-w-0">
              <span [class]="getNodeClasses(hierarchy()!.concept, true)">
                <mat-icon class="!text-sm !w-4 !h-4">{{
                  getLevelIcon(hierarchy()!.concept.level)
                }}</mat-icon>
              </span>
              <div class="flex-1 min-w-0">
                <span
                  class="font-bold text-blue-700"
                  [class.break-words]="isNameExpanded(hierarchy()!.concept.id)"
                >
                  {{ hierarchy()!.concept.level }}:
                  {{
                    getDisplayName(
                      hierarchy()!.concept,
                      !isNameExpanded(hierarchy()!.concept.id)
                    )
                  }}
                </span>
                @if (shouldShowToggle(hierarchy()!.concept)) {
                  <button
                    mat-icon-button
                    class="!w-5 !h-5 ml-1 align-middle"
                    (click)="
                      toggleNameExpansion(hierarchy()!.concept.id, $event)
                    "
                    [matTooltip]="
                      isNameExpanded(hierarchy()!.concept.id)
                        ? 'ย่อชื่อ'
                        : 'ดูชื่อเต็ม'
                    "
                  >
                    <mat-icon class="!text-sm !w-4 !h-4 text-blue-600">{{
                      isNameExpanded(hierarchy()!.concept.id)
                        ? 'unfold_less'
                        : 'unfold_more'
                    }}</mat-icon>
                  </button>
                }
                <span class="text-blue-500 text-xs font-mono ml-2"
                  >({{ hierarchy()!.concept.concept_code }})</span
                >
                <mat-icon class="!text-sm !w-4 !h-4 text-blue-500 ml-2"
                  >arrow_back</mat-icon
                >
              </div>
            </div>
          </div>

          <!-- Descendants (tree) -->
          @for (child of hierarchy()!.descendants; track child.id) {
            <ng-container
              *ngTemplateOutlet="
                treeNode;
                context: {
                  node: child,
                  depth: hierarchy()!.ancestors.length + 1,
                }
              "
            ></ng-container>
          }
        </div>
      } @else {
        <div
          class="flex flex-col items-center justify-center p-4 text-gray-500"
        >
          <mat-icon class="!text-3xl mb-2">account_tree</mat-icon>
          <span class="text-sm">ไม่พบข้อมูล hierarchy</span>
        </div>
      }
    </div>

    <!-- Recursive tree node template -->
    <ng-template #treeNode let-node="node" let-depth="depth">
      <div
        class="tree-node flex items-start gap-2 py-1 hover:bg-gray-50 rounded cursor-pointer transition-colors"
        [style.padding-left.px]="depth * 20"
        (click)="onNodeClick(node)"
      >
        <div class="flex items-start gap-1.5 flex-1 min-w-0">
          @if (node.children?.length) {
            <mat-icon class="!text-xs !w-3 !h-3 text-gray-400 mt-0.5"
              >subdirectory_arrow_right</mat-icon
            >
          } @else {
            <span class="w-3"></span>
          }
          <span [class]="getNodeClasses(node, false)" class="mt-0.5">
            <mat-icon class="!text-sm !w-4 !h-4">{{
              getLevelIcon(node.level)
            }}</mat-icon>
          </span>
          <div class="flex-1 min-w-0">
            <span [class.break-words]="isNameExpanded(node.id)">
              {{ node.level }}:
              {{ getDisplayName(node, !isNameExpanded(node.id)) }}
            </span>
            @if (shouldShowToggle(node)) {
              <button
                mat-icon-button
                class="!w-5 !h-5 ml-1 align-middle"
                (click)="toggleNameExpansion(node.id, $event)"
                [matTooltip]="
                  isNameExpanded(node.id) ? 'ย่อชื่อ' : 'ดูชื่อเต็ม'
                "
              >
                <mat-icon class="!text-sm !w-4 !h-4 text-gray-500">{{
                  isNameExpanded(node.id) ? 'unfold_less' : 'unfold_more'
                }}</mat-icon>
              </button>
            }
            <span class="text-gray-400 text-xs font-mono ml-2"
              >({{ node.concept_code }})</span
            >
          </div>
        </div>
      </div>
      @if (node.children?.length && expandedNodes().has(node.id)) {
        @for (child of node.children; track child.id) {
          <ng-container
            *ngTemplateOutlet="
              treeNode;
              context: { node: child, depth: depth + 1 }
            "
          ></ng-container>
        }
      }
    </ng-template>
  `,
  styles: [
    `
      .tmt-hierarchy {
        font-size: 13px;
      }
      .tree-node {
        line-height: 1.5;
      }
    `,
  ],
})
export class AxTmtHierarchyComponent implements OnChanges {
  private tmtService = inject(TmtService);

  // Inputs
  @Input() tmtId: number | null = null;
  @Input() tmtCode: string | null = null;
  @Input() highlightLevel: TmtLevel | null = null;
  @Input() showAllLevels = true;
  @Input() expandedByDefault = true;
  @Input() maxDepth = 5;

  // Outputs
  @Output() nodeClicked = new EventEmitter<TmtConcept>();
  @Output() loaded = new EventEmitter<TmtHierarchy>();

  // State
  loading = signal(false);
  error = signal(false);
  hierarchy = signal<TmtHierarchy | null>(null);
  expandedNodes = signal<Set<number>>(new Set());
  expandedNames = signal<Set<number>>(new Set()); // Track expanded names

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tmtId'] || changes['tmtCode']) {
      this.loadHierarchy();
    }
  }

  private async loadHierarchy() {
    if (!this.tmtId && !this.tmtCode) {
      this.hierarchy.set(null);
      return;
    }

    this.loading.set(true);
    this.error.set(false);

    try {
      let id = this.tmtId;

      // If only code provided, get concept first
      if (!id && this.tmtCode) {
        const concept = await this.tmtService
          .getByCode(this.tmtCode)
          .toPromise();
        if (concept) {
          id = concept.id;
        }
      }

      if (!id) {
        this.error.set(true);
        return;
      }

      const result = await this.tmtService
        .getHierarchy(id, { maxDepth: this.maxDepth })
        .toPromise();

      if (result) {
        this.hierarchy.set(result);
        this.loaded.emit(result);

        // Auto-expand if configured
        if (this.expandedByDefault) {
          this.expandAll(result.descendants);
        }
      } else {
        this.error.set(true);
      }
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  private expandAll(nodes: TmtConceptWithChildren[]) {
    const expanded = new Set<number>();
    const traverse = (items: TmtConceptWithChildren[]) => {
      for (const item of items) {
        expanded.add(item.id);
        if (item.children) {
          traverse(item.children);
        }
      }
    };
    traverse(nodes);
    this.expandedNodes.set(expanded);
  }

  getDisplayName(concept: TmtConcept, truncate: boolean = true): string {
    // Prefer Thai name, fallback to FSN
    const name = concept.preferred_term || concept.fsn || concept.concept_code;

    // Truncate if requested and name is long
    if (truncate && name.length > 50) {
      return name.substring(0, 47) + '...';
    }

    return name;
  }

  isNameExpanded(conceptId: number): boolean {
    return this.expandedNames().has(conceptId);
  }

  toggleNameExpansion(conceptId: number, event: Event): void {
    event.stopPropagation(); // Prevent triggering node click
    const expanded = new Set(this.expandedNames());
    if (expanded.has(conceptId)) {
      expanded.delete(conceptId);
    } else {
      expanded.add(conceptId);
    }
    this.expandedNames.set(expanded);
  }

  shouldShowToggle(concept: TmtConcept): boolean {
    const name = concept.preferred_term || concept.fsn || concept.concept_code;
    return name.length > 50;
  }

  getLevelIcon(level: TmtLevel): string {
    return getTmtLevelConfig(level).icon;
  }

  getNodeClasses(concept: TmtConcept, isHighlighted: boolean): string {
    const config = getTmtLevelConfig(concept.level as TmtLevel);
    const base = `inline-flex items-center justify-center w-5 h-5 rounded ${config.bgClass} ${config.colorClass}`;
    return isHighlighted ? `${base} ring-2 ring-blue-300` : base;
  }

  onNodeClick(node: TmtConceptWithChildren) {
    // Toggle expansion
    const expanded = new Set(this.expandedNodes());
    if (expanded.has(node.id)) {
      expanded.delete(node.id);
    } else {
      expanded.add(node.id);
    }
    this.expandedNodes.set(expanded);

    // Emit event
    this.nodeClicked.emit(node);
  }
}
