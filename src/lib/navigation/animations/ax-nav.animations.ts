import {
  trigger,
  transition,
  style,
  animate,
  AnimationTriggerMetadata,
} from '@angular/animations';

export const navSlideIn: AnimationTriggerMetadata = trigger('navSlideIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-8px)' }),
    animate('250ms ease', style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
  transition(':leave', [
    animate('200ms ease', style({ opacity: 0, transform: 'translateX(-8px)' })),
  ]),
]);

export const navSlideRight: AnimationTriggerMetadata = trigger(
  'navSlideRight',
  [
    transition(':enter', [
      style({ transform: 'translateX(100%)' }),
      animate('250ms ease', style({ transform: 'translateX(0)' })),
    ]),
    transition(':leave', [
      animate('200ms ease', style({ transform: 'translateX(100%)' })),
    ]),
  ],
);

export const navPopIn: AnimationTriggerMetadata = trigger('navPopIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.95)' }),
    animate('180ms ease', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
]);

export const navActiveBar: AnimationTriggerMetadata = trigger('navActiveBar', [
  transition(':enter', [
    style({ height: 0, opacity: 0 }),
    animate(
      '250ms cubic-bezier(0.4,0,0.2,1)',
      style({ height: '28px', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate('200ms ease', style({ height: 0, opacity: 0 })),
  ]),
]);
