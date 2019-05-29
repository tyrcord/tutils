import { expect } from 'chai';
import 'mocha';
import { of, Subject, SubscriptionLike } from 'rxjs';

import { SubxList } from '../src/list';

describe('SubxList', () => {
  let subxList: SubxList;
  let source: Subject<number>;
  let subscription: SubscriptionLike;
  let subscription2: SubscriptionLike;

  beforeEach(() => {
    subxList = new SubxList();
    source = new Subject();
    subscription = source.subscribe();
    subscription2 = source.subscribe();
  });

  afterEach(() => {
    subxList.unsubscribeAll();
    source.complete();
  });

  describe('#length', () => {
    it('should return the number of tracked subscriptions', () => {
      expect(subxList.length).to.equal(0);
      subxList.add(subscription, subscription2);
      expect(subxList.length).to.equal(2);
    });
  });

  describe('#add()', () => {
    it('should add a subscription to the list', () => {
      expect(subxList.length).to.equal(0);
      subxList.add(subscription);
      expect(subxList.length).to.equal(1);

      subxList.add(subscription2);
      expect(subxList.length).to.equal(2);
    });
  });

  describe('#get()', () => {
    it('should return a subscription from the list with an index', () => {
      subxList.add(subscription);
      expect(subxList.get(0)).to.equal(subscription);
      expect(subxList.get(1)).to.equal(void 0);
    });
  });

  describe('#unsubscribeAt()', () => {
    it('should unsubscribe to a subscription with an index', () => {
      subxList.add(subscription, subscription2);
      expect(subxList.length).to.equal(2);

      const unsubscribed = subxList.unsubscribeAt(0);
      expect(subxList.length).to.equal(1);
      expect(subscription.closed).to.equal(true);
      expect(unsubscribed).to.equal(true);
    });

    it('should handle wrong indexes', () => {
      subxList.add(subscription);
      expect(subxList.length).to.equal(1);

      const unsubscribed = subxList.unsubscribeAt(1);

      expect(subxList.length).to.equal(1);
      expect(subscription.closed).to.equal(false);
      expect(unsubscribed).to.equal(false);
    });
  });

  describe('#unsubscribeAll()', () => {
    it('should unsubscribe to all subscriptions', () => {
      subxList.add(subscription, subscription2);
      subxList.unsubscribeAll();
      expect(subxList.length).to.equal(0);
      expect(subscription.closed).to.equal(true);
      expect(subscription2.closed).to.equal(true);
    });
  });

  describe('#purge()', () => {
    it('should unsubscribe to all closed subscriptions', () => {
      subxList.add(subscription);
      subxList.add(of(2).subscribe());
      subxList.add(subscription2);
      subxList.add(of(3).subscribe());
      subxList.add(source.subscribe());
      subxList.add(source.subscribe());
      subxList.add(of(4).subscribe());

      subxList.purge();
      expect(subxList.length).to.equal(4);
      expect(subscription.closed).to.equal(false);
      expect(subscription2.closed).to.equal(false);
    });
  });
});
