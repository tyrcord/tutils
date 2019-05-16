import { expect } from 'chai';
import 'mocha';
import { interval, Observable, of, Subject, SubscriptionLike } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SubxList } from '../src/list';

describe('SubxList', () => {
  let subxList: SubxList;
  let source: Observable<number>;
  let end: Subject<boolean>;
  let subscription: SubscriptionLike;
  let subscription2: SubscriptionLike;

  beforeEach(() => {
    subxList = new SubxList();
    end = new Subject();
    source = interval(1000).pipe(takeUntil(end));
    subscription = source.subscribe();
    subscription2 = source.subscribe();
  });

  afterEach(() => {
    subxList.unsubscribe();
    end.next(true);
    end.complete();
  });

  describe('#length', () => {
    it('should return the number of tracked subscriptions', () => {
      subxList.add(subscription, subscription2);
      expect(subxList.length).to.equal(2);
    });
  });

  describe('#add()', () => {
    it('should add a subscription to the list', () => {
      subxList.add(subscription);
      expect(subxList.length).to.equal(1);
      expect(subscription.closed).to.equal(false);

      subxList.add(subscription2);
      expect(subxList.length).to.equal(2);
      expect(subscription2.closed).to.equal(false);
    });
  });

  describe('#get()', () => {
    it('should return a subscription from the list with an index', () => {
      subxList.add(subscription);
      expect(subxList.get(0)).to.equal(subscription);
      expect(subxList.get(1)).to.equal(void 0);
    });
  });

  describe('#unsubscribeAtIndex()', () => {
    it('should unsubscribe to a subscription with an index', () => {
      subxList.add(subscription, subscription2);
      subxList.add(of(2).subscribe());

      expect(subxList.length).to.equal(3);

      subxList.unsubscribeAtIndex(1);
      expect(subxList.length).to.equal(2);
      expect(subscription2.closed).to.equal(true);
    });

    it('should handle wrong indexes', () => {
      subxList.add(subscription);
      subxList.unsubscribeAtIndex(1);
      expect(subxList.length).to.equal(1);
      expect(subscription.closed).to.equal(false);
    });
  });

  describe('#unsubscribe()', () => {
    it('should unsubscribe to all subscriptions', () => {
      subxList.add(subscription, subscription2);
      subxList.add(of(2).subscribe());
      subxList.unsubscribe();
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
