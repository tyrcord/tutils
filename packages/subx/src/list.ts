import { SubscriptionLike } from 'rxjs';

/**
 * The SubxList object holds and manages a list of Subscriptions
 */
export class SubxList {
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
  public add(...subscriptions: SubscriptionLike[]) {
    Array.prototype.push.apply(this.subscriptionList, subscriptions);
  }

  /**
   * Return a Subscription from the list with a specified index
   * @param index The index of the Subscription
   * @returns {RxJS.SubscriptionLike|undefined} The Subscription associated with
   * the specified index, or undefined if using an invalid index number
   * @example
   *  this.subxList.get(0);
   */
  public get(index: number) {
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
  public unsubscribeAll() {
    while (this.subscriptionList.length) {
      this.unsubscribeAt(0);
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
        this.unsubscribeAt(index);
        index--;
        length--;
      }
    }
  }
}
