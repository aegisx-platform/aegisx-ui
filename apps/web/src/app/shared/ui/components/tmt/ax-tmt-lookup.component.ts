import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  forwardRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of,
  takeUntil,
} from 'rxjs';
import { TmtService } from './tmt.service';
import { TmtConcept, TmtLevel, getTmtLevelConfig } from './tmt.types';

@Component({
  selector: 'ax-tmt-lookup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatTooltipModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AxTmtLookupComponent),
      multi: true,
    },
  ],
  template: `
    <mat-form-field [appearance]="appearance" class="w-full">
      @if (label) {
        <mat-label>{{ label }}</mat-label>
      }

      <mat-icon matPrefix class="mr-2 text-gray-400">search</mat-icon>

      <input
        matInput
        [placeholder]="placeholder"
        [disabled]="disabled"
        [(ngModel)]="searchText"
        (ngModelChange)="onSearchChange($event)"
        [matAutocomplete]="auto"
        (focus)="onFocus()"
        (blur)="onBlur()"
      />

      @if (loading()) {
        <mat-spinner matSuffix [diameter]="20"></mat-spinner>
      } @else if (selectedConcept() && !searchText) {
        <button
          mat-icon-button
          matSuffix
          (click)="clear(); $event.stopPropagation()"
          matTooltip="ล้างการเลือก"
        >
          <mat-icon>close</mat-icon>
        </button>
      }

      <mat-autocomplete
        #auto="matAutocomplete"
        [displayWith]="displayFn"
        (optionSelected)="onSelect($event.option.value)"
      >
        @if (searchResults().length > 0) {
          @for (concept of searchResults(); track concept.id) {
            <mat-option [value]="concept" class="tmt-option">
              <div class="flex items-center gap-2 py-1">
                <span
                  class="inline-flex items-center justify-center w-6 h-6 rounded text-xs"
                  [class]="getLevelClasses(concept.level)"
                >
                  {{ concept.level }}
                </span>
                <div class="flex-1 min-w-0">
                  <div class="font-mono text-sm">
                    {{ concept.concept_code }}
                  </div>
                  <div class="text-xs text-gray-600 truncate">
                    {{ concept.preferred_term || concept.fsn }}
                  </div>
                </div>
              </div>
            </mat-option>
          }
        } @else if (searchText && searchText.length >= 2 && !loading()) {
          <mat-option disabled>
            <div class="flex items-center gap-2 text-gray-500">
              <mat-icon>search_off</mat-icon>
              <span>ไม่พบผลลัพธ์</span>
            </div>
          </mat-option>
        }
      </mat-autocomplete>

      @if (hint) {
        <mat-hint>{{ hint }}</mat-hint>
      }
    </mat-form-field>

    <!-- Selected display (below input) -->
    @if (selectedConcept() && showSelectedInfo) {
      <div class="mt-1 p-2 bg-blue-50 rounded-md text-sm">
        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
            [class]="getLevelClasses(selectedConcept()!.level)"
          >
            {{ selectedConcept()!.level }}
          </span>
          <span class="font-mono">{{ selectedConcept()!.concept_code }}</span>
        </div>
        <div class="text-gray-600 mt-1">
          {{ selectedConcept()!.preferred_term || selectedConcept()!.fsn }}
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .tmt-option {
        line-height: 1.3 !important;
        height: auto !important;
        padding: 8px 16px !important;
      }
    `,
  ],
})
export class AxTmtLookupComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  private tmtService = inject(TmtService);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Inputs
  @Input() label = 'TMT Code';
  @Input() placeholder = 'ค้นหารหัส TMT หรือชื่อยา...';
  @Input() hint: string | null = null;
  @Input() level: TmtLevel | TmtLevel[] | null = null;
  @Input() required = false;
  @Input() disabled = false;
  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() showSelectedInfo = true;
  @Input() limit = 20;

  // Outputs
  @Output() selected = new EventEmitter<TmtConcept>();
  @Output() cleared = new EventEmitter<void>();

  // State
  searchText = '';
  loading = signal(false);
  searchResults = signal<TmtConcept[]>([]);
  selectedConcept = signal<TmtConcept | null>(null);

  // ControlValueAccessor
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: number | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  ngOnInit() {
    // Setup debounced search
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (!term || term.length < 2) {
            return of([]);
          }
          this.loading.set(true);
          return this.tmtService.search(term, {
            level: this.level || undefined,
            limit: this.limit,
          });
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((results) => {
        this.searchResults.set(results);
        this.loading.set(false);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ControlValueAccessor implementation
  writeValue(value: number | null): void {
    if (value) {
      // Load concept by ID
      this.tmtService.getById(value).subscribe((concept) => {
        if (concept) {
          this.selectedConcept.set(concept);
          this.searchText = '';
        }
      });
    } else {
      this.selectedConcept.set(null);
      this.searchText = '';
    }
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  onSelect(concept: TmtConcept) {
    this.selectedConcept.set(concept);
    this.searchText = '';
    this.searchResults.set([]);
    this.onChange(concept.id);
    this.selected.emit(concept);
  }

  onFocus() {
    // Trigger search if there's text
    if (this.searchText && this.searchText.length >= 2) {
      this.searchSubject.next(this.searchText);
    }
  }

  onBlur() {
    this.onTouched();
  }

  clear() {
    this.selectedConcept.set(null);
    this.searchText = '';
    this.searchResults.set([]);
    this.onChange(null);
    this.cleared.emit();
  }

  displayFn(concept: TmtConcept | null): string {
    return concept ? concept.concept_code : '';
  }

  getLevelClasses(level: TmtLevel): string {
    const config = getTmtLevelConfig(level);
    return `${config.bgClass} ${config.colorClass}`;
  }
}
