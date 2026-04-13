export interface ErrorAction {
  readonly label: string;
  readonly type: 'retry' | 'navigate' | 'login' | 'external';
  readonly route?: string;
}

export interface ErrorMessageConfig {
  readonly code: number | string;
  readonly severity: 'error' | 'warning' | 'info' | 'neutral';
  readonly icon: string;
  readonly featuredIcon: string;
  readonly title: string;
  readonly description: string;
  readonly primaryAction: ErrorAction;
  readonly secondaryAction?: ErrorAction;
  readonly technicalLabel: string;
}

export type ErrorSeverity = 'error' | 'warning' | 'info' | 'neutral';
