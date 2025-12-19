import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpiryBadgeDocComponent } from './expiry-badge-doc.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ExpiryBadgeDocComponent', () => {
  let component: ExpiryBadgeDocComponent;
  let fixture: ComponentFixture<ExpiryBadgeDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiryBadgeDocComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpiryBadgeDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the doc header with correct title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('ax-doc-header');
    expect(header).toBeTruthy();
  });

  it('should render all 5 tabs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabs = compiled.querySelectorAll('mat-tab');
    expect(tabs.length).toBe(5);
  });

  it('should have Overview tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const overviewTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
      (tab) => tab.textContent?.includes('Overview'),
    );
    expect(overviewTab).toBeTruthy();
  });

  it('should have Examples tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const examplesTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
      (tab) => tab.textContent?.includes('Examples'),
    );
    expect(examplesTab).toBeTruthy();
  });

  it('should have API tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const apiTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
      (tab) => tab.textContent?.includes('API'),
    );
    expect(apiTab).toBeTruthy();
  });

  it('should have Tokens tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tokensTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
      (tab) => tab.textContent?.includes('Tokens'),
    );
    expect(tokensTab).toBeTruthy();
  });

  it('should have Guidelines tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const guidelinesTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
      (tab) => tab.textContent?.includes('Guidelines'),
    );
    expect(guidelinesTab).toBeTruthy();
  });

  describe('Code Examples', () => {
    it('should have basic usage code example', () => {
      expect(component.basicUsageCode).toBeDefined();
      expect(component.basicUsageCode.length).toBeGreaterThan(0);
    });

    it('should have status colors code example', () => {
      expect(component.statusColorsCode).toBeDefined();
      expect(component.statusColorsCode.length).toBeGreaterThan(0);
    });

    it('should have sizes code example', () => {
      expect(component.sizesCode).toBeDefined();
      expect(component.sizesCode.length).toBeGreaterThan(0);
    });

    it('should have variants code example', () => {
      expect(component.variantsCode).toBeDefined();
      expect(component.variantsCode.length).toBeGreaterThan(0);
    });

    it('should have compact mode code example', () => {
      expect(component.compactModeCode).toBeDefined();
      expect(component.compactModeCode.length).toBeGreaterThan(0);
    });

    it('should have custom thresholds code example', () => {
      expect(component.customThresholdsCode).toBeDefined();
      expect(component.customThresholdsCode.length).toBeGreaterThan(0);
    });

    it('should have countdown options code example', () => {
      expect(component.countdownOptionsCode).toBeDefined();
      expect(component.countdownOptionsCode.length).toBeGreaterThan(0);
    });
  });

  describe('Component Tokens', () => {
    it('should define expiry badge tokens', () => {
      expect(component.expiryBadgeTokens).toBeDefined();
      expect(component.expiryBadgeTokens.length).toBeGreaterThan(0);
    });

    it('should have color tokens for all status states', () => {
      const colorTokens = component.expiryBadgeTokens.filter(
        (token) => token.category === 'Colors',
      );
      expect(colorTokens.length).toBeGreaterThan(0);

      // Check for success (safe) colors
      const successTokens = colorTokens.filter((token) =>
        token.cssVar.includes('success'),
      );
      expect(successTokens.length).toBeGreaterThan(0);

      // Check for warning colors
      const warningTokens = colorTokens.filter((token) =>
        token.cssVar.includes('warning'),
      );
      expect(warningTokens.length).toBeGreaterThan(0);

      // Check for error (critical) colors
      const errorTokens = colorTokens.filter((token) =>
        token.cssVar.includes('error'),
      );
      expect(errorTokens.length).toBeGreaterThan(0);
    });

    it('should have spacing tokens', () => {
      const spacingTokens = component.expiryBadgeTokens.filter(
        (token) => token.category === 'Spacing',
      );
      expect(spacingTokens.length).toBeGreaterThan(0);
    });

    it('should have border tokens', () => {
      const borderTokens = component.expiryBadgeTokens.filter(
        (token) => token.category === 'Borders',
      );
      expect(borderTokens.length).toBeGreaterThan(0);
    });

    it('should have typography tokens', () => {
      const typographyTokens = component.expiryBadgeTokens.filter(
        (token) => token.category === 'Typography',
      );
      expect(typographyTokens.length).toBeGreaterThan(0);
    });
  });

  describe('Live Preview Components', () => {
    it('should render ax-expiry-badge components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const badges = compiled.querySelectorAll('ax-expiry-badge');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should render live preview containers', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const previews = compiled.querySelectorAll('ax-live-preview');
      expect(previews.length).toBeGreaterThan(0);
    });

    it('should render code tabs', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const codeTabs = compiled.querySelectorAll('ax-code-tabs');
      expect(codeTabs.length).toBeGreaterThan(0);
    });
  });

  describe('Helper Methods', () => {
    it('should generate future date correctly', () => {
      const days = 15;
      const futureDate = component.getFutureDate(days);
      const today = new Date();
      const expectedDate = new Date();
      expectedDate.setDate(today.getDate() + days);

      expect(futureDate.getDate()).toBe(expectedDate.getDate());
    });

    it('should generate past date correctly', () => {
      const days = 5;
      const pastDate = component.getPastDate(days);
      const today = new Date();
      const expectedDate = new Date();
      expectedDate.setDate(today.getDate() - days);

      expect(pastDate.getDate()).toBe(expectedDate.getDate());
    });
  });

  describe('Event Handlers', () => {
    it('should have handleBadgeClick method', () => {
      expect(component.handleBadgeClick).toBeDefined();
      expect(typeof component.handleBadgeClick).toBe('function');
    });

    it('should handle badge click without errors', () => {
      const mockEvent = {
        expiryDate: new Date(),
        daysUntilExpiry: 15,
        status: 'warning',
        message: '15 days left',
      };

      expect(() => component.handleBadgeClick(mockEvent)).not.toThrow();
    });
  });

  describe('API Documentation', () => {
    it('should render input properties table', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tables = compiled.querySelectorAll(
        '.expiry-badge-doc__api-table table',
      );
      expect(tables.length).toBeGreaterThan(0);
    });

    it('should document all required inputs', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tableContent = compiled.querySelector(
        '.expiry-badge-doc__api-table',
      )?.textContent;

      expect(tableContent).toContain('expiryDate');
      expect(tableContent).toContain('warningDays');
      expect(tableContent).toContain('criticalDays');
      expect(tableContent).toContain('showCountdown');
      expect(tableContent).toContain('showIcon');
      expect(tableContent).toContain('size');
      expect(tableContent).toContain('variant');
      expect(tableContent).toContain('compact');
    });

    it('should document output events', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tableContent = compiled.querySelector(
        '.expiry-badge-doc__api-table',
      )?.textContent;

      expect(tableContent).toContain('badgeClick');
      expect(tableContent).toContain('ExpiryInfo');
    });
  });

  describe('Guidelines Section', () => {
    it('should render do and dont guidelines', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const doSection = compiled.querySelector(
        '.expiry-badge-doc__guideline--do',
      );
      const dontSection = compiled.querySelector(
        '.expiry-badge-doc__guideline--dont',
      );

      expect(doSection).toBeTruthy();
      expect(dontSection).toBeTruthy();
    });

    it('should render accessibility guidelines', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const a11yList = compiled.querySelector('.expiry-badge-doc__a11y-list');
      expect(a11yList).toBeTruthy();
    });

    it('should render best practices', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const bestPractices = compiled.querySelector(
        '.expiry-badge-doc__best-practices',
      );
      expect(bestPractices).toBeTruthy();
    });

    it('should render color semantics', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const colorSemantics = compiled.querySelector(
        '.expiry-badge-doc__color-semantics',
      );
      expect(colorSemantics).toBeTruthy();
    });
  });

  describe('Examples Section', () => {
    it('should render product inventory table example', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const table = compiled.querySelector('.expiry-badge-doc__table');
      expect(table).toBeTruthy();
    });

    it('should render product card examples', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const cards = compiled.querySelectorAll(
        '.expiry-badge-doc__product-card',
      );
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should render variant comparison', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const variantGroups = compiled.querySelectorAll(
        '.expiry-badge-doc__variant-group',
      );
      expect(variantGroups.length).toBeGreaterThan(0);
    });
  });

  describe('Status Rules', () => {
    it('should render status rules section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const statusRules = compiled.querySelector(
        '.expiry-badge-doc__status-rules',
      );
      expect(statusRules).toBeTruthy();
    });

    it('should document all four status states', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const statusContent = compiled.querySelector(
        '.expiry-badge-doc__status-rules',
      )?.textContent;

      expect(statusContent).toContain('Safe');
      expect(statusContent).toContain('Warning');
      expect(statusContent).toContain('Critical');
      expect(statusContent).toContain('Expired');
    });
  });
});
