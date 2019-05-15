import { expect } from 'chai';
import 'mocha';
import { interval, Observable, of, Subject, SubscriptionLike } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SubxMap } from '../src/map';

describe('SubxMap', () => {
  let subxMap: SubxMap;
  let source: Observable<number>;
  let end: Subject<boolean>;
  let subscription: SubscriptionLike;
  let subscription2: SubscriptionLike;

  beforeEach(() => {
    subxMap = new SubxMap();
    end = new Subject();
    source = interval(1000).pipe(takeUntil(end));
    subscription = source.subscribe();
    subscription2 = source.subscribe();
  });

  afterEach(() => {
    subxMap.unsubscribe();
    end.next(true);
    end.complete();
  });

  describe('#size', () => {
    it('should return the number of tracked subscriptions', () => {
      subxMap.add('key1', subscription);
      subxMap.add('key2', subscription2);
      expect(subxMap.size).to.equal(2);
    });
  });

  describe('#add()', () => {
    it('should add a subscription to the list', () => {
      subxMap.add('key1', subscription);
      expect(subxMap.size).to.equal(1);
      expect(subscription.closed).to.equal(false);

      subxMap.add('key2', subscription2);
      expect(subxMap.size).to.equal(2);
      expect(subscription2.closed).to.equal(false);
    });

    it('should replace a subscription from the list and unsubscribe it when the key already exist', () => {
      subxMap.add('key1', subscription);
      expect(subxMap.size).to.equal(1);
      expect(subscription.closed).to.equal(false);

      subxMap.add('key1', subscription2);
      expect(subxMap.size).to.equal(1);
      expect(subscription.closed).to.equal(true);
      expect(subscription2.closed).to.equal(false);
    });
  });

  describe('#get()', () => {
    it('should return a subscription from the list with an index', () => {
      subxMap.add('key1', subscription);
      expect(subxMap.get('key1')).to.equal(subscription);
      expect(subxMap.get('key2')).to.equal(void 0);
    });
  });

  describe('#unsubscribeForKey()', () => {
    it('should unsubscribe to a subscription with an index', () => {
      subxMap.add('key1', subscription);
      subxMap.add('key2', subscription2);
      subxMap.add('key3', of(2).subscribe());

      expect(subxMap.size).to.equal(3);

      subxMap.unsubscribeForKey('key2');
      expect(subxMap.size).to.equal(2);
      expect(subscription2.closed).to.equal(true);
    });

    it('should handle wrong indexes', () => {
      subxMap.add('key1', subscription);
      subxMap.unsubscribeForKey('key2');
      expect(subxMap.size).to.equal(1);
      expect(subscription.closed).to.equal(false);
    });
  });

  describe('#unsubscribe()', () => {
    it('should unsubscribe to all subscriptions', () => {
      subxMap.add('key1', subscription);
      subxMap.add('key2', subscription2);
      subxMap.add('key3', of(2).subscribe());
      subxMap.unsubscribe();
      expect(subxMap.size).to.equal(0);
      expect(subscription.closed).to.equal(true);
      expect(subscription2.closed).to.equal(true);
    });
  });

  describe('#purge()', () => {
    it('should unsubscribe to all closed subscriptions', () => {
      subxMap.add('key1', subscription);
      subxMap.add('key2', of(2).subscribe());
      subxMap.add('key3', subscription2);
      subxMap.add('key4', of(3).subscribe());
      subxMap.add('key5', source.subscribe());
      subxMap.add('key6', source.subscribe());
      subxMap.add('key7', of(4).subscribe());

      subxMap.purge();
      expect(subxMap.size).to.equal(4);
      expect(subscription.closed).to.equal(false);
      expect(subscription2.closed).to.equal(false);
    });
  });
});
