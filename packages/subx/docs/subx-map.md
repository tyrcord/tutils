# SubxMap

Object that holds and manages Key-Subscription pairs.

# API Summary

- [Accessors](#accessors)
    - [length](#length)
- [Methods](#methods)
    - [set](#set)
    - [get](#get)
    - [hasSubscription](#hasSubscription)
    - [unsubscribeForKey](#unsubscribeForKey)
    - [unsubscribe](#unsubscribeAll)
    - [purge](#purge)

## Accessors

### length

Return the number of Subscriptions.

`subxMap.length`

#### Example

```ts
const length = subxMap.length;
```

## Methods

### set

Add or update a Subscription to the list with a specified key.
Will unsubscribe a Subscription when updating a existing key.

`subxMap.set(key, subscription)`

#### Parameters

| Name    | Type      | Description  |
|---------|-----------|--------------|
| key	  | string	  | The key of the Subscription
| subscription	  | RxJS.SubscriptionLike	  | The subscription to add to the list

#### Returns

The SubxMap object.

#### Examples

```ts
const subscription = observable.subscribe(...);
const subscription2 = observable.subscribe(...);

// Add a new subscription to the list
subxMap.set('key', subscription);

// Updating an element in the list will automatically unsubscribe the previous subscription
subxMap.set('key', subscription2);
```

Since the `set()` method returns back the same SubxMap object, you can chain the method call like below:

```ts
// Add a new subscription to the list
subxMap.set('key', subscription)
    .set('key2', subscription2);
```

### get

Return a Subscription from the list with a specified key.

`subxMap.get(key)`

##### Parameters

| Name    | Type      | Description  |
|---------|-----------|--------------|
| key	  | string	  | The key of the Subscription

#### Returns

The Subscription associated with the specified key, or `undefined` if the key can't be found in the list.

##### Example

```ts
const subscription = subxMap.get('key');
```

### hasSubscription

Returns a boolean indicating whether an subscription exists or not.

`subxMap.hasSubscription(subscription)`

##### Parameters

| Name    | Type      | Description  |
|---------|-----------|--------------|
| subscription	  | RxJS.SubscriptionLike	  | The subscription to find within the list

#### Returns

`true` if a subscription exists in the list; otherwise `false`.

##### Example

```ts
subxMap.hasSubscription(subscription);
```

### unsubscribeForKey

Unsubscribe to a Subscription with a specified key and remove it from the list.

`subxMap.unsubscribeForKey(key)`

#### Parameters

| Name    | Type      | Description  |
|---------|-----------|--------------|
| key	  | string	  | The key of the Subscription

#### Returns

`true` if a Subscription in the list existed and has been unsubscribed and removed, or `false` if the Subscription does not exist.

#### Example

```ts
const unsubscribed = subxMap.unsubscribeForKey('key');
```

### unsubscribeAll

Unsubscribe to all Subscriptions and remove them from the list.

`subxMap.unsubscribeAll()`

#### Example

```ts
subxMap.unsubscribe();
```

### purge

Unsubscribe to all closed Subscriptions and remove them from the list.

`subxMap.purge()`

#### Example

```ts
subxMap.purge();
```
