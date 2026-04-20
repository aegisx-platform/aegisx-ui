import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  AxDashboardPanelComponent,
  AxDashboardPanelNavSlotDirective,
} from './ax-dashboard-panel.component';

@Component({
  standalone: true,
  imports: [AxDashboardPanelComponent, AxDashboardPanelNavSlotDirective],
  template: `
    <ax-dashboard-panel>
      <div axNav class="test-nav">NAV-SLOT</div>
      <div class="hero">HERO</div>
      <div class="chart">CHART</div>
    </ax-dashboard-panel>
  `,
})
class WithNavHost {}

@Component({
  standalone: true,
  imports: [AxDashboardPanelComponent, AxDashboardPanelNavSlotDirective],
  template: `
    <ax-dashboard-panel>
      <div class="hero">HERO</div>
      <div class="chart">CHART</div>
    </ax-dashboard-panel>
  `,
})
class WithoutNavHost {}

describe('AxDashboardPanelComponent', () => {
  it('projects content into [axNav] slot when provided', async () => {
    await TestBed.configureTestingModule({
      imports: [WithNavHost],
    }).compileComponents();
    const fixture: ComponentFixture<WithNavHost> =
      TestBed.createComponent(WithNavHost);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(
      host.querySelector('.ax-dashboard-panel__nav .test-nav')?.textContent,
    ).toBe('NAV-SLOT');
  });

  it('omits the nav slot wrapper when no [axNav] content is projected', async () => {
    await TestBed.configureTestingModule({
      imports: [WithoutNavHost],
    }).compileComponents();
    const fixture = TestBed.createComponent(WithoutNavHost);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('.ax-dashboard-panel__nav')).toBeFalsy();
    expect(host.querySelectorAll('.ax-dashboard-panel__body > *').length).toBe(
      2,
    );
  });
});
