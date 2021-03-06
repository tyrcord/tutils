import { Observable, SubscriptionLike } from 'rxjs';

import { SubxBase } from './base';

/**
 * The SubxMap object holds and manages Key-Subscription pairs
 */
export class SubxMap extends SubxBase {
  /**
   * Return the number of Subscriptions
   * @type {number}
   */
  public get length() {
    return this.subscriptionMap.size;
  }

  protected subscriptionMap: Map<string, SubscriptionLike> = new Map();

  /**
   * Add or update a Subscription to the list with a specified key.
   * Will unsubscribe a Subscription when updating a existing key.
   * @param key The key of the Subscription
   * @param subscription The Subscription to add to the list
   * @example
   *  this.subxMap.set('key', observable.subscribe(...));
   */
  public set(key: string, subscription: SubscriptionLike): SubxMap {
    const oldSubscription = this.subscriptionMap.get(key);

    if (oldSubscription && oldSubscription !== subscription) {
      oldSubscription.unsubscribe();
    }

    this.subscriptionMap.set(key, subscription);

    return this;
  }

  /**
   * Add a "pausable" obversable to the list with a specified key.
   * @param key The key of the Subscription
   * @param {RxJS.Observable} source - An Observable
   * @param {Function} next - The callback of an Observer
   * @param {boolean} [shouldBufferData=false] - Determine if data should be
   * buffered or not when the observable is paused
   * @example
   *  this.subxMap.setPausable(source, () => {});
   */
  public setPausable<V>(
    key: string,
    source: Observable<V>,
    next: (value: V) => void,
    shouldBufferData: boolean = false,
  ): SubxMap {
    const pausableSource = this.makePausableObservable(
      source,
      shouldBufferData,
    );
    return this.set(key, pausableSource.subscribe(next));
  }

  /**
   * Return a Subscription from the list with a specified key
   * @param key The key of the Subscription
   * @returns {RxJS.SubscriptionLike|undefined} The Subscription associated with
   * the specified key, or undefined if the key can't be found in the list
   * @example
   *  const subscription = subxMap.get('key');
   */
  public get(key: string): SubscriptionLike | undefined {
    return this.subscriptionMap.get(key);
  }

  /**
   * Returns a boolean indicating whether an subscription exists or not.
   * @param subscription The subscription to find within the list
   * @returns {boolean} `true` if a subscription exists in the list;
   * otherwise `false`
   * @example
   *  this.subxMap.hasSubscription(subscription);
   */
  public hasSubscription(subscription: SubscriptionLike): boolean {
    for (const value of this.subscriptionMap.values()) {
      if (value === subscription) {
        return true;
      }
    }

    return false;
  }

  /**
   * Unsubscribe to a Subscription with a specified key and remove it from the list
   * @param key The key of the Subscription
   * @returns {boolean} true if a Subscription in the list existed and has been
   * unsubscribed and removed, or false if the Subscription does not exist
   * @example
   *  const unsubscribed = subxMap.unsubscribeForKey('key');
   */
  public unsubscribeForKey(key: string): boolean {
    const subscription = this.subscriptionMap.get(key);

    if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe();
      return this.subscriptionMap.delete(key);
    }

    return false;
  }

  /**
   * Unsubscribe to all Subscriptions and remove them from the list
   * @example
   *  this.subxMap.unsubscribeAll();
   */
  public unsubscribeAll(): void {
    for (const key of this.subscriptionMap.keys()) {
      this.unsubscribeForKey(key);
    }
  }

  /**
   * Unsubscribe to all closed Subscriptions and remove them from the list
   * @example
   *  this.subxMap.purge();
   */
  public purge(): void {
    for (const [key, subscription] of this.subscriptionMap.entries()) {
      if (subscription.closed) {
        this.unsubscribeForKey(key);
      }
    }
  }
}
