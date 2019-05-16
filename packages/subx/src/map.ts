import { SubscriptionLike } from 'rxjs';

/**
 * The SubxMap object holds and manages Key-Subscription pairs
 */
export class SubxMap {
  /**
   * Return the number of Subscriptions
   * @type {number}
   */
  public get length() {
    return this.subscriptionMap.size;
  }

  protected subscriptionMap: Map<string, SubscriptionLike> = new Map();

  /**
   * Add a Subscription to the list with a specified key
   * @param key The key of the Subscription
   * @param subscription The key of the Subscription
   * @example
   *  this.subxMap.add('key', observable.subscribe(...));
   */
  public add(key: string, subscription: SubscriptionLike) {
    const oldSubscription = this.subscriptionMap.get(key);

    if (oldSubscription) {
      oldSubscription.unsubscribe();
    }

    this.subscriptionMap.set(key, subscription);
  }

  /**
   * Return a Subscription from the list with a specified key
   * @param key The key of the Subscription
   * @returns {RxJS.SubscriptionLike|undefined} The Subscription associated with
   * the specified key, or undefined if the key can't be found in the list
   * @example
   *  const subscription = subxMap.get('key');
   */
  public get(key: string) {
    return this.subscriptionMap.get(key);
  }

/**
 * Unsubscribe to a Subscription with a specified key and remove it from the list
 * @param key The key of the Subscription
 * @example
 *  this.subxMap.unsubscribeForKey('key');
 */
  public unsubscribeForKey(key: string) {
    const subscription = this.subscriptionMap.get(key);

    if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe();
      this.subscriptionMap.delete(key);
    }
  }

  /**
   * Unsubscribe to all Subscriptions and remove them from the list
   * @example
   *  this.subxMap.unsubscribe();
   */
  public unsubscribe() {
    for (const subscriptionKey of this.subscriptionMap.keys()) {
      this.unsubscribeForKey(subscriptionKey);
    }
  }

  /**
   * Unsubscribe to all closed Subscriptions and remove them from the list
   * @example
   *  this.subxMap.purge();
   */
  public purge() {
    for (const [key, subscription] of this.subscriptionMap.entries()) {
      if (subscription.closed) {
        this.unsubscribeForKey(key);
      }
    }
  }
}
