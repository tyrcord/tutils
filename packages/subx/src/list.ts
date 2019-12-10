import { Observable, SubscriptionLike } from 'rxjs';

import { SubxBase } from './base';

/**
 * The SubxList object holds and manages a list of Subscriptions
 */
export class SubxList extends SubxBase {
  /**
   * Return the number of Subscriptions
   * @type {number}
   */
  public get length() {
    return this.subscriptionList.length;
  }

  protected subscriptionList: SubscriptionLike[] = [];

  /**
   * Add Subscriptions to the list
   * @param subscriptionN The subscriptions to add to the list
   * @example
   *  this.subxList.add(observable.subscribe(...));
   */
  public add(...subscriptions: SubscriptionLike[]): void {
    Array.prototype.push.apply(this.subscriptionList, subscriptions);
  }

  /**
   * Add a "pausable" obversable to the list
   * @param {RxJS.Observable} source - An Observable
   * @param {Function} next - The callback of an Observer
   * @param {boolean} [shouldBufferData=false] - Determine if data should be
   * buffered or not when the observable is paused
   * @example
   *  this.subxList.addPausable(source, () => {});
   */
  public addPausable<V>(
    source: Observable<V>,
    next: (value: V) => void,
    shouldBufferData: boolean = false,
  ): void {
    const pausableSource = this.makePausableObservable(
      source,
      shouldBufferData,
    );
    this.add(pausableSource.subscribe(next));
  }

  /**
   * Return a Subscription from the list with a specified index
   * @param index The index of the Subscription
   * @returns {RxJS.SubscriptionLike|undefined} The Subscription associated with
   * the specified index, or undefined if using an invalid index number
   * @example
   *  this.subxList.get(0);
   */
  public get(index: number): SubscriptionLike | undefined {
    return this.subscriptionList[index];
  }

  /**
   * Unsubscribe to a Subscription with a specified index and remove it from list
   * @param index The index of the Subscription
   * @returns {boolean} true if a Subscription in the list existed and has been
   * unsubscribed and removed, or false if the Subscription does not exist.
   * @example
   *  this.subxList.unsubscribeAt(0);
   */
  public unsubscribeAt(index: number): boolean {
    const subscription = this.get(index);

    if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe();
      this.subscriptionList.splice(index, 1);

      return true;
    }

    return false;
  }

  /**
   * Unsubscribe to all Subscriptions and remove them from the list
   * @example
   *  this.subxList.unsubscribeAll();
   */
  public unsubscribeAll(): void {
    while (this.subscriptionList.length) {
      this.unsubscribeAt(0);
    }
  }

  /**
   * Unsubscribe to all closed Subscriptions and remove them from the list
   * @example
   *  this.subxList.purge();
   */
  public purge(): void {
    let length = this.subscriptionList.length;

    for (let index = 0; index < length; index++) {
      const subscription = this.subscriptionList[index];

      if (subscription.closed) {
        this.unsubscribeAt(index);
        index--;
        length--;
      }
    }
  }
}
