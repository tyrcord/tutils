import { SubscriptionLike } from 'rxjs';

/**
 * The SubxMap object holds key-Subscription pairs
 * until the method unsubscribe is called
 */
export class SubxMap {
  protected subscriptionMap: Map<string, SubscriptionLike> = new Map();

  /**
   * Add a subscription to the tracked subscriptions with a specified key
   * @param key The key of the Subscription
   * @param subscription The key of the Subscription
   * @example
   *  this.subxMap.add('key', observable.subscribe(...));
   */
  public add(key: string, subscription: SubscriptionLike) {
    this.subscriptionMap.set(key, subscription);
  }

  /**
   * Unsubscribe to all subscriptions or to the specified subscription by key
   * @param [key] The key of the Subscription
   * @example
   *  this.subxMap.unsubscribe();
   *  this.subxMap.unsubscribe('key');
   */
  public unsubscribe(key?: string) {
    if (key) {
      this.unsubscribeForKey(key);
    } else {
      for (const subscriptionKey of this.subscriptionMap.keys()) {
        this.unsubscribeForKey(subscriptionKey);
      }
    }
  }

  private unsubscribeForKey(key: string) {
    const subscription = this.subscriptionMap.get(key);
    if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe();
    }

    this.subscriptionMap.delete(key);
  }
}
