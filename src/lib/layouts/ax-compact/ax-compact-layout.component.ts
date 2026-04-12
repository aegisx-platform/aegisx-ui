import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  TemplateRef,
  inject,
  signal,
} from '@angular/core';
import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AxIconDirective } from '../../components/navigation/icon/ax-icon.directive';
import { AxLoadingBarComponent } from '../../components/feedback/loading-bar/loading-bar.component';
import { AxNavigationItem } from '../../types/ax-navigation.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

const COLLAPSED_STORAGE_KEY = 'ax-compact-layout:collapsed';

@Component({
  selector: 'ax-compact-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    AxIconDirective,
    AxLoadingBarComponent,
  ],
  templateUrl: './ax-compact-layout.component.html',
  styleUrls: ['./ax-compact-layout.component.scss'],
})
export class AxCompactLayoutComponent implements OnInit {
  @Input() set navigation(value: AxNavigationItem[]) {
    this._axNavigation.set(value);
  }

  private _axNavigation = signal<AxNavigationItem[]>([]);
  get axNavigation() {
    return this._axNavigation();
  }
  @Input() showFooter = true;
  @Input() appName = 'AegisX Platform';
  @Input() appVersion = '';
  @Input() logoUrl?: string;
  @Input() showDefaultUserMenu = true;
  @Input() showSettingsMenuItem = true;
  @Output() navigationToggled = new EventEmitter<void>();
  @Output() profileClicked = new EventEmitter<void>();
  @Output() settingsClicked = new EventEmitter<void>();
  @Output() logoutClicked = new EventEmitter<void>();

  @ContentChild('toolbarTitle') toolbarTitle!: TemplateRef<unknown>;
  @ContentChild('headerActions') headerActions!: TemplateRef<unknown>;
  @ContentChild('userMenu') userMenu?: TemplateRef<unknown>;
  @ContentChild('navigationHeader') navigationHeader!: TemplateRef<unknown>;
  @ContentChild('navigationFooter') navigationFooter!: TemplateRef<unknown>;
  @ContentChild('footerContent') footerContent!: TemplateRef<unknown>;

  currentYear = new Date().getFullYear();
  isScreenSmall = signal(false);
  isNavigationExpanded = signal(false);

  /** Mobile drawer open state (separate from desktop collapsed). */
  readonly mobileOpen = signal(false);

  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Check initial screen size (SSR-safe)
    if (isPlatformBrowser(this._platformId)) {
      const isMobile = window.innerWidth < 768;
      this.isScreenSmall.set(isMobile);

      if (!isMobile) {
        // Restore collapsed state from localStorage
        const stored = localStorage.getItem(COLLAPSED_STORAGE_KEY);
        this.isNavigationExpanded.set(stored !== 'true');
      }
    }

    // Auto-close mobile drawer on route navigation
    this._router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => this.closeMobileMenu());
  }

  toggleNavigation(): void {
    this.navigationToggled.emit();
    const next = !this.isNavigationExpanded();
    this.isNavigationExpanded.set(next);
    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(!next));
    }
  }

  /** Open/close the mobile drawer overlay. */
  toggleMobileMenu(): void {
    this.mobileOpen.set(!this.mobileOpen());
  }

  /** Close the mobile drawer (e.g., when backdrop is clicked). */
  closeMobileMenu(): void {
    this.mobileOpen.set(false);
  }
}
