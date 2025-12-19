import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StockMovementTimelineDocComponent } from './stock-movement-timeline-doc.component';

describe('StockMovementTimelineDocComponent', () => {
  let component: StockMovementTimelineDocComponent;
  let fixture: ComponentFixture<StockMovementTimelineDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMovementTimelineDocComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StockMovementTimelineDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render doc header with correct title', () => {
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
      (tab) => tab.getAttribute('label') === 'Overview',
    );
    expect(overviewTab).toBeTruthy();
  });

  it('should have Examples tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const examplesTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
      (tab) => tab.getAttribute('label') === 'Examples',
    );
    expect(examplesTab).toBeTruthy();
  });

  it('should have API tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const apiTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
      (tab) => tab.getAttribute('label') === 'API',
    );
    expect(apiTab).toBeTruthy();
  });

  it('should have Tokens tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tokensTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
      (tab) => tab.getAttribute('label') === 'Tokens',
    );
    expect(tokensTab).toBeTruthy();
  });

  it('should have Guidelines tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const guidelinesTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
      (tab) => tab.getAttribute('label') === 'Guidelines',
    );
    expect(guidelinesTab).toBeTruthy();
  });

  it('should render live preview components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const livePreviews = compiled.querySelectorAll('ax-live-preview');
    expect(livePreviews.length).toBeGreaterThan(0);
  });

  it('should render code tabs components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const codeTabs = compiled.querySelectorAll('ax-code-tabs');
    expect(codeTabs.length).toBeGreaterThan(0);
  });

  it('should have sample movements data', () => {
    expect(component.sampleMovements).toBeDefined();
    expect(component.sampleMovements.length).toBeGreaterThan(0);
  });

  it('should have code examples', () => {
    expect(component.basicUsageCode).toBeDefined();
    expect(component.chartIntegrationCode).toBeDefined();
    expect(component.groupingCode).toBeDefined();
    expect(component.filteringCode).toBeDefined();
    expect(component.exportCode).toBeDefined();
    expect(component.realtimeCode).toBeDefined();
    expect(component.dateRangeCode).toBeDefined();
  });

  it('should have component tokens defined', () => {
    expect(component.stockMovementTimelineTokens).toBeDefined();
    expect(component.stockMovementTimelineTokens.length).toBeGreaterThan(0);
  });

  it('should render API documentation tables', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const apiTables = compiled.querySelectorAll(
      '.stock-movement-timeline-doc__api-table table',
    );
    expect(apiTables.length).toBeGreaterThan(0);
  });

  it('should render Do and Dont guidelines', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const doGuideline = compiled.querySelector(
      '.stock-movement-timeline-doc__guideline--do',
    );
    const dontGuideline = compiled.querySelector(
      '.stock-movement-timeline-doc__guideline--dont',
    );
    expect(doGuideline).toBeTruthy();
    expect(dontGuideline).toBeTruthy();
  });

  it('should handle filter change event', () => {
    const mockFilter = { types: ['purchase'] };
    spyOn(console, 'log');
    component.handleFilterChange(mockFilter);
    expect(console.log).toHaveBeenCalledWith('Filter changed:', mockFilter);
  });

  it('should handle export event', () => {
    const mockEvent = { format: 'pdf', data: [] };
    spyOn(console, 'log');
    component.handleExport(mockEvent);
    expect(console.log).toHaveBeenCalledWith('Export event:', mockEvent);
  });

  it('should handle movement click event', () => {
    const mockMovement = component.sampleMovements[0];
    spyOn(console, 'log');
    component.handleMovementClick(mockMovement);
    expect(console.log).toHaveBeenCalledWith('Movement clicked:', mockMovement);
  });

  it('should handle movements load event', () => {
    const mockMovements = component.sampleMovements;
    spyOn(console, 'log');
    component.handleMovementsLoad(mockMovements);
    expect(console.log).toHaveBeenCalledWith(
      'Movements loaded:',
      mockMovements,
    );
  });

  it('should have custom date range defined', () => {
    expect(component.customDateRange).toBeDefined();
    expect(component.customDateRange.start).toBeInstanceOf(Date);
    expect(component.customDateRange.end).toBeInstanceOf(Date);
  });

  it('should have groupBy strategies defined', () => {
    expect(component.groupByDay).toBe('day');
    expect(component.groupByWeek).toBe('week');
  });

  it('should render movement type indicators in examples', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const typeIndicators = compiled.querySelectorAll(
      '.stock-movement-timeline-doc__type-demo',
    );
    expect(typeIndicators.length).toBeGreaterThan(0);
  });

  it('should render component tokens table', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tokensComponent = compiled.querySelector('ax-component-tokens');
    expect(tokensComponent).toBeTruthy();
  });

  it('should have accessibility guidelines', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const a11yList = compiled.querySelector(
      '.stock-movement-timeline-doc__a11y-list',
    );
    expect(a11yList).toBeTruthy();
  });

  it('should have best practices section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const bestPractices = compiled.querySelector(
      '.stock-movement-timeline-doc__best-practices',
    );
    expect(bestPractices).toBeTruthy();
  });
});
