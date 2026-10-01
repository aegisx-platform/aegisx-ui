import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AxStatCardComponent } from './stat-card.component';

describe('AxStatCardComponent — trend-corner variant', () => {
  let fixture: ComponentFixture<AxStatCardComponent>;
  let component: AxStatCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AxStatCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AxStatCardComponent);
    component = fixture.componentInstance;
  });

  it('renders the corner sparkline when variant=trend-corner and trendData provided', () => {
    component.variant = 'trend-corner';
    component.value = 903;
    component.label = 'Total employees';
    component.subtitle = '25 new employees';
    component.deltaDirection = 'up';
    component.trendData = [30, 38, 34, 42, 48, 52, 60];
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const sparkline = host.querySelector('.ax-stat-card__corner-sparkline svg');
    expect(sparkline).toBeTruthy();
    expect(sparkline?.getAttribute('viewBox')).toBe('0 0 100 30');

    // Value and label render
    expect(host.textContent).toContain('903');
    expect(host.textContent).toContain('Total employees');
    expect(host.textContent).toContain('25 new employees');
  });

  it('omits corner sparkline when trendData is missing', () => {
    component.variant = 'trend-corner';
    component.value = 903;
    component.label = 'Total employees';
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const sparkline = host.querySelector('.ax-stat-card__corner-sparkline');
    expect(sparkline).toBeFalsy();
  });
});

describe('AxStatCardComponent — bottom progress bar', () => {
  let fixture: ComponentFixture<AxStatCardComponent>;
  let component: AxStatCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AxStatCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AxStatCardComponent);
    component = fixture.componentInstance;
    component.value = 100;
    component.progress = 52;
  });

  const bar = () =>
    (fixture.nativeElement as HTMLElement).querySelector(
      '.ax-stat-card__progress',
    );

  it('shows the bar on a plain variant when progress is set', () => {
    component.variant = 'compact';
    fixture.detectChanges();
    expect(bar()).toBeTruthy();
  });

  it('hides the bar by default on ring and gauge (they draw the circle)', () => {
    component.variant = 'ring';
    fixture.detectChanges();
    expect(bar()).toBeFalsy();
  });

  // OnPush: เปลี่ยน input รอบสองต้องผ่าน setInput ถึงจะ re-render
  it('showProgressBar forces the bar on or off', () => {
    fixture.componentRef.setInput('variant', 'ring');
    fixture.componentRef.setInput('showProgressBar', true);
    fixture.detectChanges();
    expect(bar()).toBeTruthy();

    fixture.componentRef.setInput('variant', 'compact');
    fixture.componentRef.setInput('showProgressBar', false);
    fixture.detectChanges();
    expect(bar()).toBeFalsy();
  });
});
