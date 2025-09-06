// Main module export
export * from './aegisx-ui.module';


// Services
export * from './services/config/config.service';
export * from './services/navigation/navigation.service';
export * from './services/loading/loading.service';
export * from './services/media-watcher/media-watcher.service';
export * from './services/icon.service';

// Components
export * from './components/navigation/navigation.component';
export * from './components/loading-bar/loading-bar.component';
export * from './components/user-menu/user-menu.component';
export * from './components/card/card.component';
export * from './components/alert/alert.component';
export * from './components/drawer/drawer.component';

// Layouts
export * from './layouts/layout-wrapper/layout-wrapper.component';
export * from './layouts/empty/empty-layout.component';
export * from './layouts/classic/classic-layout.component';
export * from './layouts/compact/compact-layout.component';
export * from './layouts/enterprise/enterprise-layout.component';

// Layout Components
export * from './layouts/components/navbar/navbar.component';
export * from './layouts/components/toolbar/toolbar.component';

// Types and interfaces
export * from './types';

// Animations
export * from './animations';

// Utils
export * from './utils';

// Directives
export * from './directives';

// Fuse Legacy Components (to be replaced with Ax versions)
export * from './layouts/fuse-classic/fuse-classic-layout.component';
export * from './layouts/fuse-compact/fuse-compact-layout.component';
export * from './layouts/fuse-classic/simple-vertical-navigation.component';
export * from './services/fuse-media-watcher.service';
export * from './components/fuse-loading-bar.component';
export * from './components/fuse-fullscreen.component';
export * from './providers/fuse.provider';

// Ax Components
export * from './components/ax-navigation.component';
export * from './components/ax-navigation-icon.component';
export * from './types/ax-navigation.types';