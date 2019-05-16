import { SubscriptionLike } from 'rxjs';

/**
 * The SubxList object holds and manages a list of Subscriptions
 */
export class SubxList {

  /**
   * Number of Subscriptions hold
   * @type {number}
   */
  public get length() {
    return this.subscriptionList.length;
  }

  protected subscriptionList: SubscriptionLike[] = [];

  /**
   * Add Subscriptions to the list
   * @example
   *  this.subxList.add(observable.subscribe(...));
   */
  public add(...subscriptions: SubscriptionLike[]) {
    Array.prototype.push.apply(this.subscriptionList, subscriptions);
  }

  /**
   * Return a Subscription from list with a specified index
   * @param index The index of the Subscription
   * @example
   *  this.subxList.get(0);
   */
  public get(index: number) {
    return this.subscriptionList[index];
  }

  /**
   * Unsubscribe to a Subscription with a specified index and remove it from list
   * @param index The index of the Subscription
   * @example
   *  this.subxList.unsubscribeAtIndex(0);
   */
  public unsubscribeAtIndex(index: number) {
    const subscription = this.get(index);

    if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe();
      this.subscriptionList.splice(index, 1);
    }
  }

  /**
   * Unsubscribe to all Subscriptions and remove them from the list
   * @example
   *  this.subxList.unsubscribe();
   */
  public unsubscribe() {
    while (this.subscriptionList.length) {
      this.unsubscribeAtIndex(0);
    }
  }

  /**
   * Unsubscribe to all closed Subscriptions and remove them from the list
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
