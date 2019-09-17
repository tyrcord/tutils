import { expect } from 'chai';
import 'mocha';
import { interval, of, Subject, SubscriptionLike } from 'rxjs';
import { take } from 'rxjs/operators';

import { SubxMap } from '../src/map';

describe('SubxMap', () => {
  let subxMap: SubxMap;
  let source: Subject<number>;
  let subscription: SubscriptionLike;
  let subscription2: SubscriptionLike;

  beforeEach(() => {
    subxMap = new SubxMap();
    source = new Subject();
    subscription = source.subscribe();
    subscription2 = source.subscribe();
  });

  afterEach(() => {
    subxMap.unsubscribeAll();
    source.complete();
  });

  describe('#length', () => {
    it('should return the number of tracked subscriptions', () => {
      expect(subxMap.length).to.equal(0);
      subxMap.set('key1', subscription);
      subxMap.set('key2', subscription2);
      expect(subxMap.length).to.equal(2);
    });
  });

  describe('#set()', () => {
    it('should add a subscription to the list', () => {
      expect(subxMap.length).to.equal(0);
      subxMap.set('key1', subscription);
      expect(subxMap.length).to.equal(1);
    });

    it(`should replace a subscription from the list and unsubscribe it when
      the key already exist`, () => {
      subxMap.set('key1', subscription);
      expect(subxMap.length).to.equal(1);
      expect(subscription.closed).to.equal(false);

      subxMap.set('key1', subscription2);
      expect(subxMap.length).to.equal(1);
      expect(subscription.closed).to.equal(true);
      expect(subscription2.closed).to.equal(false);
    });

    it(`should not unsubscribe a subscription when the same subscription
      is added with the same key`, () => {
      subxMap.set('key1', subscription);
      expect(subxMap.length).to.equal(1);
      expect(subscription.closed).to.equal(false);

      subxMap.set('key1', subscription);
      expect(subxMap.length).to.equal(1);
      expect(subscription.closed).to.equal(false);
    });

    it('should allow chaining calls', () => {
      expect(subxMap.length).to.equal(0);
      subxMap.set('key1', subscription).set('key2', subscription2);
      expect(subxMap.length).to.equal(2);
    });
  });

  describe('#get()', () => {
    it('should return a subscription from the list with an index', () => {
      subxMap.set('key1', subscription);
      expect(subxMap.get('key1')).to.equal(subscription);
      expect(subxMap.get('key2')).to.equal(void 0);
    });
  });

  describe('#hasSubscription()', () => {
    it('should return true if this list contains the given subscription', () => {
      subxMap.set('key1', subscription);
      expect(subxMap.hasSubscription(subscription)).to.equal(true);
    });

    it('should return false if this list does not contain the given subscription', () => {
      expect(subxMap.hasSubscription(subscription)).to.equal(false);
    });
  });

  describe('#unsubscribeForKey()', () => {
    it('should unsubscribe to a subscription with an index', () => {
      subxMap.set('key1', subscription);
      subxMap.set('key2', subscription2);
      expect(subxMap.length).to.equal(2);

      const unsubscribed = subxMap.unsubscribeForKey('key1');
      expect(subxMap.length).to.equal(1);
      expect(subscription.closed).to.equal(true);
      expect(unsubscribed).to.equal(true);
    });

    it('should handle wrong keys', () => {
      subxMap.set('key1', subscription);
      expect(subxMap.length).to.equal(1);

      const unsubscribed = subxMap.unsubscribeForKey('key2');

      expect(subxMap.length).to.equal(1);
      expect(subscription.closed).to.equal(false);
      expect(unsubscribed).to.equal(false);
    });
  });

  describe('#unsubscribeAll()', () => {
    it('should unsubscribe to all subscriptions', () => {
      subxMap.set('key1', subscription);
      subxMap.set('key2', subscription2);
      subxMap.unsubscribeAll();
      expect(subxMap.length).to.equal(0);
      expect(subscription.closed).to.equal(true);
      expect(subscription2.closed).to.equal(true);
    });
  });

  describe('#purge()', () => {
    it('should unsubscribe to all closed subscriptions', () => {
      subxMap.set('key1', subscription);
      subxMap.set('key2', of(2).subscribe());
      subxMap.set('key3', subscription2);
      subxMap.set('key4', of(3).subscribe());
      subxMap.set('key5', source.subscribe());
      subxMap.set('key6', source.subscribe());
      subxMap.set('key7', of(4).subscribe());

      subxMap.purge();
      expect(subxMap.length).to.equal(4);
      expect(subscription.closed).to.equal(false);
      expect(subscription2.closed).to.equal(false);
    });
  });

  describe('#setPausable()', () => {
    it('should pause the pausable observables', done => {
      const sourceInterval = interval(100).pipe(take(3));

      subxMap.pause();

      setTimeout(() => {
        subxMap.resume();
      }, 300);

      subxMap.setPausable('pausable', sourceInterval, value => {
        expect(value).to.equal(2);
        done();
      });

      expect(subxMap.length).to.equal(1);
    });

    it('should buffer the values for pausable observables when required', done => {
      const sourceInterval = interval(100).pipe(take(3));

      subxMap.pause();

      setTimeout(() => {
        subxMap.resume();
      }, 300);

      subxMap.setPausable(
        'pausable',
        sourceInterval,
        value => {
          subxMap.unsubscribeAll();
          expect(value).to.equal(0);
          done();
        },
        true,
      );

      expect(subxMap.length).to.equal(1);
    });
  });
});
