import { BehaviorSubject, merge, Observable } from 'rxjs';

import {
  bufferToggle,
  filter,
  flatMap,
  mergeAll,
  windowToggle,
} from 'rxjs/operators';

export class SubxBase {
  protected pauserBehaviorSubject: BehaviorSubject<boolean>;

  protected get pauser$() {
    if (!this.pauserBehaviorSubject) {
      this.pauserBehaviorSubject = new BehaviorSubject<boolean>(false);
    }
    return this.pauserBehaviorSubject;
  }

  protected on$: Observable<boolean>;

  protected off$: Observable<boolean>;

  /**
   * Pause all "pausable" subscriptions of the list
   * @example
   *  this.subxList.pauseAll();
   */
  public pauseAll() {
    this.pauser$.next(true);
  }

  /**
   * Resume all "pausable" subscriptions of the list
   * @example
   *  this.subxList.resumeAll();
   */
  public resumeAll() {
    this.pauser$.next(false);
  }

  /**
   * Make an obversable "pausable"
   * @param {RxJS.Observable} source - An Observable
   * @param {boolean} [shouldBufferData=false] - Determine if data should be
   * buffered or not when the observable is paused
   * @returns {RxJS.Observable} The Pausable Observable
   * @example
   *  this.subxList.makePausableObservable(source);
   */
  protected makePausableObservable<V>(
    source: Observable<V>,
    shouldBufferData = false,
  ): Observable<V> {
    const off$ = this.pauser$.pipe(filter(paused => !paused));
    const on$ = this.pauser$.pipe(filter(paused => !!paused));

    if (shouldBufferData) {
      return merge(
        source.pipe(bufferToggle(on$, () => off$)),
        source.pipe(windowToggle(off$, () => on$)),
      ).pipe(flatMap(x => x));
    }

    return source.pipe(
      windowToggle(off$, () => on$),
      mergeAll(),
    );
  }
}
