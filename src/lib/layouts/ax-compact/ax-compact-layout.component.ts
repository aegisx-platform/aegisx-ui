import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  inject,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AxNavigationComponent } from '../../components/ax-navigation.component';
import {
  AxNavigationItem,
  AxNavigationConfig,
} from '../../types/ax-navigation.types';
import { AxLoadingBarComponent } from '../../components/ax-loading-bar.component';
import { AegisxMediaWatcherService } from '../../services/media-watcher/media-watcher.service';
import {
  LoadingBarService,
  LoadingBarState,
} from '../../components/feedback/loading-bar/loading-bar.service';
import { Subject, takeUntil } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ax-compact-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    AxNavigationComponent,
    AxLoadingBarComponent,
  ],
  templateUrl: './ax-compact-layout.component.html',
  styleUrls: ['./ax-compact-layout.component.scss'],
})
export class AxCompactLayoutComponent implements OnInit, OnDestroy {
  @Input() set navigation(value: AxNavigationItem[]) {
    this._axNavigation.set(value);
  }

  private _axNavigation = signal<AxNavigationItem[]>([]);
  get axNavigation() {
    return this._axNavigation();
  }
  @Input() showFooter = true;
  @Input() appName = 'AegisX Platform';
  @Input() appVersion = 'v2.0';
  @Input() isDarkMode = false;
  @Input() logoUrl?: string;
  @Input() showDefaultUserMenu = true;
  @Input() showSettingsMenuItem = true;
  @Output() navigationToggled = new EventEmitter<void>();
  @Output() profileClicked = new EventEmitter<void>();
  @Output() settingsClicked = new EventEmitter<void>();
  @Output() logoutClicked = new EventEmitter<void>();

  @ContentChild('toolbarTitle') toolbarTitle!: TemplateRef<unknown>;
  @ContentChild('headerActions') headerActions!: TemplateRef<unknown>;
  @ContentChild('navigationHeader') navigationHeader!: TemplateRef<unknown>;
  @ContentChild('navigationFooter') navigationFooter!: TemplateRef<unknown>;
  @ContentChild('footerContent') footerContent!: TemplateRef<unknown>;

  currentYear = new Date().getFullYear();
  isScreenSmall = false;
  isNavigationExpanded = signal(false); // Start collapsed, will be set correctly in ngOnInit
  navigationConfig = signal<Partial<AxNavigationConfig>>({
    state: 'collapsed', // Start collapsed
    mode: 'side',
    position: 'left',
    showToggleButton: true,
    autoCollapse: true,
    breakpoint: 'lg',
  });

  private _unsubscribeAll = new Subject<void>();
  private _mediaWatcher = inject(AegisxMediaWatcherService);
  private _loadingBarService = inject(LoadingBarService);

  // Expose loading bar state as a signal for reactive template binding
  protected readonly loadingBarState = toSignal(
    this._loadingBarService.state$,
    {
      initialValue: {
        visible: false,
        mode: 'indeterminate' as const,
        progress: 0,
        color: 'primary' as const,
        message: undefined,
      },
    },
  );

  ngOnInit(): void {
    // Check initial screen size immediately
    const checkInitialSize = () => {
      // Check if window width is less than 768px (md breakpoint)
      const isMobile = window.innerWidth < 768;
      this.isScreenSmall = isMobile;

      if (isMobile) {
        this.isNavigationExpanded.set(false);
        this.navigationConfig.update((config) => ({
          ...config,
          state: 'collapsed',
        }));
      } else {
        this.isNavigationExpanded.set(true);
        this.navigationConfig.update((config) => ({
          ...config,
          state: 'expanded',
        }));
      }
    };

    // Set initial state
    checkInitialSize();

    // Then subscribe to media changes
    this._mediaWatcher.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        const wasScreenSmall = this.isScreenSmall;
        this.isScreenSmall = result.matches; // matches = true when on mobile/tablet

        // If transitioning to small screen, collapse navigation
        if (!wasScreenSmall && this.isScreenSmall) {
          this.isNavigationExpanded.set(false);
          this.navigationConfig.update((config) => ({
            ...config,
            state: 'collapsed',
          }));
        }
        // If transitioning to large screen, expand navigation
        else if (wasScreenSmall && !this.isScreenSmall) {
          this.isNavigationExpanded.set(true);
          this.navigationConfig.update((config) => ({
            ...config,
            state: 'expanded',
          }));
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  toggleNavigation(_navigationId: string): void {
    this.navigationToggled.emit();
    const currentState = this.isNavigationExpanded();
    this.isNavigationExpanded.set(!currentState);

    // Update navigation config
    this.navigationConfig.update((config) => ({
      ...config,
      state: !currentState ? 'expanded' : 'collapsed',
    }));
  }

  onNavigationStateChange(state: 'collapsed' | 'expanded'): void {
    this.isNavigationExpanded.set(state === 'expanded');
  }

  onNavigationItemClick(item: AxNavigationItem): void {
    // Close navigation on mobile after clicking an item
    if (this.isScreenSmall && item.type === 'item' && item.link) {
      this.isNavigationExpanded.set(false);
      this.navigationConfig.update((config) => ({
        ...config,
        state: 'collapsed',
      }));
    }
  }
}
