import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { AxNavService } from '../services/ax-nav.service';
import { AxNavRailComponent } from './ax-nav-rail.component';
import { AxNavExpandedPanelComponent } from '../shared/ax-nav-expanded-panel.component';
import { NavModule } from '../models/ax-nav.model';

@Component({
  selector: 'ax-nav-expanded',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AxNavRailComponent, AxNavExpandedPanelComponent],
  template: `
    <div class="ax-nav-expanded">
      <ax-nav-rail
        [hideTooltips]="true"
        (appSwitcherClick)="appSwitcherClick.emit()"
        (searchClick)="searchClick.emit()"
        (hospitalClick)="hospitalClick.emit()"
        (notificationClick)="notificationClick.emit()"
        (settingsClick)="settingsClick.emit()"
        (userMenuClick)="userMenuClick.emit()"
      />
      @if (navService.activeApp(); as app) {
        <ax-nav-expanded-panel
          [app]="app"
          [modules]="navService.visibleModules()"
          [activeModuleId]="navService.activeModuleId()"
          [pinned]="navService.pinned()"
          [user]="navService.user() ?? undefined"
          (moduleSelect)="onModuleSelect($event)"
          (pinToggle)="navService.togglePin()"
          (collapse)="navService.setMode('rail')"
        />
      }
    </div>
  `,
  styles: [
    `
      .ax-nav-expanded {
        display: flex;
        height: 100vh;
        flex-shrink: 0;
      }
    `,
  ],
})
export class AxNavExpandedComponent {
  readonly navService = inject(AxNavService);

  @Output() appSwitcherClick = new EventEmitter<void>();
  @Output() searchClick = new EventEmitter<void>();
  @Output() hospitalClick = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();
  @Output() settingsClick = new EventEmitter<void>();
  @Output() userMenuClick = new EventEmitter<void>();

  onModuleSelect(mod: NavModule): void {
    this.navService.setActiveModule(mod.id);
  }
}
