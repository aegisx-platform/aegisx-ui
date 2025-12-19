import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StockAlertPanelDocComponent } from './stock-alert-panel-doc.component';

describe('StockAlertPanelDocComponent', () => {
  let component: StockAlertPanelDocComponent;
  let fixture: ComponentFixture<StockAlertPanelDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAlertPanelDocComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StockAlertPanelDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Code Examples', () => {
    it('should have basic usage code examples', () => {
      expect(component.basicUsageCode).toBeDefined();
      expect(component.basicUsageCode.length).toBe(2);
      expect(component.basicUsageCode[0].label).toBe('HTML');
      expect(component.basicUsageCode[1].label).toBe('TypeScript');
    });

    it('should have severity code examples', () => {
      expect(component.severityCode).toBeDefined();
      expect(component.severityCode.length).toBeGreaterThan(0);
    });

    it('should have grouping code examples', () => {
      expect(component.groupingCode).toBeDefined();
      expect(component.groupingCode.length).toBeGreaterThan(0);
    });

    it('should have WebSocket code examples', () => {
      expect(component.webSocketCode).toBeDefined();
      expect(component.webSocketCode.length).toBe(2);
    });

    it('should have filtering code examples', () => {
      expect(component.filteringCode).toBeDefined();
      expect(component.filteringCode.length).toBeGreaterThan(0);
    });
  });

  describe('Component Tokens', () => {
    it('should have stock alert panel tokens defined', () => {
      expect(component.stockAlertPanelTokens).toBeDefined();
      expect(component.stockAlertPanelTokens.length).toBeGreaterThan(0);
    });

    it('should have color tokens', () => {
      const colorTokens = component.stockAlertPanelTokens.filter(
        (token) => token.category === 'Colors',
      );
      expect(colorTokens.length).toBeGreaterThan(0);
    });

    it('should have spacing tokens', () => {
      const spacingTokens = component.stockAlertPanelTokens.filter(
        (token) => token.category === 'Spacing',
      );
      expect(spacingTokens.length).toBeGreaterThan(0);
    });

    it('should have border tokens', () => {
      const borderTokens = component.stockAlertPanelTokens.filter(
        (token) => token.category === 'Borders',
      );
      expect(borderTokens.length).toBeGreaterThan(0);
    });

    it('should have required severity color tokens', () => {
      const tokenVars = component.stockAlertPanelTokens.map((t) => t.cssVar);
      expect(tokenVars).toContain('--ax-error-default');
      expect(tokenVars).toContain('--ax-warning-default');
      expect(tokenVars).toContain('--ax-info-default');
    });
  });

  describe('Alert Data', () => {
    it('should have basic alerts defined', () => {
      expect(component.basicAlerts).toBeDefined();
      expect(component.basicAlerts.length).toBeGreaterThan(0);
    });

    it('should have critical alerts defined', () => {
      expect(component.criticalAlerts).toBeDefined();
      expect(component.criticalAlerts.length).toBeGreaterThan(0);
      expect(
        component.criticalAlerts.every((a) => a.severity === 'critical'),
      ).toBe(true);
    });

    it('should have warning alerts defined', () => {
      expect(component.warningAlerts).toBeDefined();
      expect(component.warningAlerts.length).toBeGreaterThan(0);
      expect(
        component.warningAlerts.every((a) => a.severity === 'warning'),
      ).toBe(true);
    });

    it('should have info alerts defined', () => {
      expect(component.infoAlerts).toBeDefined();
      expect(component.infoAlerts.length).toBeGreaterThan(0);
      expect(component.infoAlerts.every((a) => a.severity === 'info')).toBe(
        true,
      );
    });

    it('should have mixed alerts combining all severities', () => {
      expect(component.mixedAlerts).toBeDefined();
      expect(component.mixedAlerts.length).toBeGreaterThan(
        component.criticalAlerts.length,
      );
    });

    it('should have alert type examples with all types', () => {
      expect(component.alertTypeExamples).toBeDefined();
      const types = component.alertTypeExamples.map((a) => a.type);
      expect(types).toContain('out-of-stock');
      expect(types).toContain('expired');
      expect(types).toContain('low-stock');
      expect(types).toContain('expiring');
      expect(types).toContain('overstock');
      expect(types).toContain('reorder');
    });
  });

  describe('Event Handlers', () => {
    it('should handle alert click event', () => {
      spyOn(console, 'log');

      const mockAlert = component.basicAlerts[0];
      component.handleAlertClick(mockAlert);

      expect(console.log).toHaveBeenCalledWith('Alert clicked:', mockAlert);
    });

    it('should handle alert action event', () => {
      spyOn(console, 'log');

      const mockEvent = {
        alert: component.basicAlerts[0],
        action: 'view-product' as const,
      };
      component.handleAlertAction(mockEvent);

      expect(console.log).toHaveBeenCalledWith(
        'Alert action:',
        mockEvent.action,
        'for alert:',
        mockEvent.alert.id,
      );
    });

    it('should handle alert dismiss event', () => {
      spyOn(console, 'log');

      const alertId = 'alert-001';
      component.handleAlertDismiss(alertId);

      expect(console.log).toHaveBeenCalledWith('Alert dismissed:', alertId);
    });

    it('should handle alert resolve event', () => {
      spyOn(console, 'log');

      const alertId = 'alert-001';
      component.handleAlertResolve(alertId);

      expect(console.log).toHaveBeenCalledWith('Alert resolved:', alertId);
    });
  });

  describe('Tab Content', () => {
    it('should render all tab groups', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabGroup = compiled.querySelector('mat-tab-group');
      expect(tabGroup).toBeTruthy();
    });

    it('should have Overview tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabs = compiled.querySelectorAll('mat-tab');
      const overviewTab = Array.from(tabs).find((tab) =>
        tab.textContent?.includes('Overview'),
      );
      expect(overviewTab).toBeTruthy();
    });

    it('should have Examples tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabs = compiled.querySelectorAll('mat-tab');
      const examplesTab = Array.from(tabs).find((tab) =>
        tab.textContent?.includes('Examples'),
      );
      expect(examplesTab).toBeTruthy();
    });

    it('should have API tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabs = compiled.querySelectorAll('mat-tab');
      const apiTab = Array.from(tabs).find((tab) =>
        tab.textContent?.includes('API'),
      );
      expect(apiTab).toBeTruthy();
    });

    it('should have Tokens tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabs = compiled.querySelectorAll('mat-tab');
      const tokensTab = Array.from(tabs).find((tab) =>
        tab.textContent?.includes('Tokens'),
      );
      expect(tokensTab).toBeTruthy();
    });

    it('should have Guidelines tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabs = compiled.querySelectorAll('mat-tab');
      const guidelinesTab = Array.from(tabs).find((tab) =>
        tab.textContent?.includes('Guidelines'),
      );
      expect(guidelinesTab).toBeTruthy();
    });
  });

  describe('Documentation Header', () => {
    it('should render doc header component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const docHeader = compiled.querySelector('ax-doc-header');
      expect(docHeader).toBeTruthy();
    });

    it('should have correct title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const docHeader = compiled.querySelector('ax-doc-header');
      expect(docHeader?.getAttribute('title')).toBe('Stock Alert Panel');
    });

    it('should have correct icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const docHeader = compiled.querySelector('ax-doc-header');
      expect(docHeader?.getAttribute('icon')).toBe('notifications_active');
    });
  });

  describe('Live Preview Components', () => {
    it('should render live preview components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const livePreviews = compiled.querySelectorAll('ax-live-preview');
      expect(livePreviews.length).toBeGreaterThan(0);
    });

    it('should render stock alert panel components in previews', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const stockAlertPanels = compiled.querySelectorAll(
        'ax-stock-alert-panel',
      );
      expect(stockAlertPanels.length).toBeGreaterThan(0);
    });
  });

  describe('Code Tabs', () => {
    it('should render code tabs components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const codeTabs = compiled.querySelectorAll('ax-code-tabs');
      expect(codeTabs.length).toBeGreaterThan(0);
    });
  });

  describe('Component Token Display', () => {
    it('should render component tokens component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const componentTokens = compiled.querySelector('ax-component-tokens');
      expect(componentTokens).toBeTruthy();
    });
  });

  describe('Alert Severity Display', () => {
    it('should display severity color indicators', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const severityColors = compiled.querySelectorAll('.severity-color');
      expect(severityColors.length).toBeGreaterThan(0);
    });

    it('should have critical severity indicator', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const criticalIndicator = compiled.querySelector(
        '.severity-color--critical',
      );
      expect(criticalIndicator).toBeTruthy();
    });

    it('should have warning severity indicator', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const warningIndicator = compiled.querySelector(
        '.severity-color--warning',
      );
      expect(warningIndicator).toBeTruthy();
    });

    it('should have info severity indicator', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const infoIndicator = compiled.querySelector('.severity-color--info');
      expect(infoIndicator).toBeTruthy();
    });
  });

  describe('API Documentation', () => {
    it('should display input properties table', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const apiTables = compiled.querySelectorAll(
        '.stock-alert-panel-doc__api-table',
      );
      expect(apiTables.length).toBeGreaterThan(0);
    });

    it('should document all required inputs', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tableContent = compiled.textContent || '';
      expect(tableContent).toContain('alerts');
      expect(tableContent).toContain('groupBy');
      expect(tableContent).toContain('showActions');
      expect(tableContent).toContain('enableRealtime');
    });

    it('should document all output events', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tableContent = compiled.textContent || '';
      expect(tableContent).toContain('alertClick');
      expect(tableContent).toContain('alertAction');
      expect(tableContent).toContain('alertDismiss');
      expect(tableContent).toContain('alertResolve');
      expect(tableContent).toContain('alertsLoad');
    });
  });

  describe('Guidelines', () => {
    it('should display do and dont guidelines', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const guidelines = compiled.querySelectorAll(
        '.stock-alert-panel-doc__guideline',
      );
      expect(guidelines.length).toBe(2);
    });

    it('should have do guidelines', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const doGuideline = compiled.querySelector(
        '.stock-alert-panel-doc__guideline--do',
      );
      expect(doGuideline).toBeTruthy();
    });

    it('should have dont guidelines', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const dontGuideline = compiled.querySelector(
        '.stock-alert-panel-doc__guideline--dont',
      );
      expect(dontGuideline).toBeTruthy();
    });
  });
});
