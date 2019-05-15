import { SubscriptionLike } from 'rxjs';

/**
 * The SubxList object manages a subscription list
 */
export class SubxList {
  public get length() {
    return this.subscriptionList.length;
  }

  protected subscriptionList: SubscriptionLike[] = [];

  /**
   * Add a subscription to the tracked subscriptions
   * @example
   *  this.subxList.add(observable.subscribe(...));
   */
  public add(...subscriptions: SubscriptionLike[]) {
    Array.prototype.push.apply(this.subscriptionList, subscriptions);
  }

  /**
   * Return a subscription from list with an index
   * @example
   *  this.subxList.get(0);
   */
  public get(index: number) {
    return this.subscriptionList[index];
  }
   * @example
   *  this.subxList.unsubscribe();
   */
  public unsubscribe() {
    for (const subscription of this.subscriptionList) {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    }
    this.subscriptionList = [];
  }
}
