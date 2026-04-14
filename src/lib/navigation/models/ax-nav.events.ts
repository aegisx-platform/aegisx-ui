import {
  NavMode,
  NavModuleType,
  NavNotification,
  CommandItem,
} from './ax-nav.model';

export interface NavModuleClickEvent {
  appId: string;
  moduleId: string;
  route: string;
  type: NavModuleType;
  action?: string;
  externalUrl?: string;
}

export interface NavActionEvent {
  appId: string;
  moduleId: string;
  action: string;
}

export interface NavAppSwitchEvent {
  previousAppId: string;
  newAppId: string;
}

export interface NavHospitalSwitchEvent {
  previousHospitalId: string;
  newHospitalId: string;
}

export interface NavModeChangeEvent {
  previousMode: NavMode;
  newMode: NavMode;
}

export interface NavNotificationClickEvent {
  notification: NavNotification;
}

export interface NavCommandExecuteEvent {
  item: CommandItem;
}

export interface NavUserMenuEvent {
  action: 'profile' | 'settings' | 'theme' | 'logout';
}
