// Models (selective to avoid conflicts with components barrel)
export type {
  NavMode,
  AppGroup,
  NavModule,
  NavChild,
  Hospital,
  NavNotification,
  NavUser,
} from './models/ax-nav.model';

// Re-export nav-specific CommandItem and LayoutOption under prefixed names
// to avoid collision with components/navigation/command-palette and ax-layout-switcher
export type { CommandItem as NavCommandItem } from './models/ax-nav.model';
export type { LayoutOption as NavLayoutOption } from './models/ax-nav.model';
export { LAYOUT_OPTIONS as NAV_LAYOUT_OPTIONS } from './models/ax-nav.model';

// Events
export type {
  NavModuleClickEvent,
  NavAppSwitchEvent,
  NavHospitalSwitchEvent,
  NavModeChangeEvent,
  NavNotificationClickEvent,
  NavCommandExecuteEvent,
  NavUserMenuEvent,
} from './models/ax-nav.events';

// Services
export { AxNavService } from './services/ax-nav.service';

// Animations
export {
  navSlideIn,
  navSlideRight,
  navPopIn,
  navActiveBar,
} from './animations/ax-nav.animations';

// Shell
export { AxNavShellComponent } from './shell/ax-nav-shell.component';

// Layouts
export { AxNavRailComponent } from './layouts/ax-nav-rail.component';

// Features
export { AxAppSwitcherComponent } from './features/ax-app-switcher.component';
export type { AppSwitcherData } from './features/ax-app-switcher.component';

// Shared (AxNavItemComponent renamed to avoid conflict with navbar AxNavItemComponent)
export { AxNavLogoComponent } from './shared/ax-nav-logo.component';
export { AxNavAvatarComponent } from './shared/ax-nav-avatar.component';
export { AxNavBadgeComponent } from './shared/ax-nav-badge.component';
export { AxNavActiveBarComponent } from './shared/ax-nav-active-bar.component';
export { AxNavItemComponent as AxNavRailItemComponent } from './shared/ax-nav-item.component';
