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
   * Add a subscription to the list
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

  /**
   * Unsubscribe to a subscription with an index and remove it from list
   * @example
   *  this.unsubscribeAtIndex.get(0);
   */
  public unsubscribeAtIndex(index: number) {
    const subscription = this.get(index);

    if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe();
      this.subscriptionList.splice(index, 1);
    }
  }

  /**
   * Unsubscribe to all subscriptions and remove them from the list
   * @example
   *  this.subxList.unsubscribe();
   */
  public unsubscribe() {
    while (this.subscriptionList.length) {
      this.unsubscribeAtIndex(0);
    }
  }

  /**
   * Unsubscribe to all closed subscriptions and remove them from the list
   * @example
   *  this.subxList.purge();
   */
  public purge() {
    let length = this.subscriptionList.length;

    for (let index = 0; index < length; index++) {
      const subscription = this.subscriptionList[index];

      if (subscription.closed) {
        this.unsubscribeAtIndex(index);
        index--;
        length--;
      }
    }
  }
}
