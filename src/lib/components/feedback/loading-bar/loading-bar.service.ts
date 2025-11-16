import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingBarService {
  private loading$ = new BehaviorSubject<boolean>(false);
  private progress$ = new BehaviorSubject<number>(0);

  getLoading() {
    return this.loading$.asObservable();
  }

  getProgress() {
    return this.progress$.asObservable();
  }

  start(): void {
    this.loading$.next(true);
    this.progress$.next(0);
    this.simulateProgress();
  }

  complete(): void {
    this.progress$.next(100);
    setTimeout(() => {
      this.loading$.next(false);
      this.progress$.next(0);
    }, 300);
  }

  setProgress(value: number): void {
    this.progress$.next(Math.min(Math.max(value, 0), 100));
  }

  private simulateProgress(): void {
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (!this.loading$.value) {
        clearInterval(interval);
        return;
      }

      currentProgress += Math.random() * 10;
      if (currentProgress > 90) {
        currentProgress = 90;
        clearInterval(interval);
      }
      this.progress$.next(currentProgress);
    }, 200);
  }
}
