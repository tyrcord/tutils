# SubxMap

Object that holds and manages Key-Subscription pairs.

# API Summary

- [Accessors](#accessors)
    - [length](#length)
- [Methods](#methods)
    - [add](#add)
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

### add

Add a Subscription to the list with a specified key.

`subxMap.add(key, subscription)`

#### Parameters

| Name    | Type      | Description  |
|---------|-----------|--------------|
| key	  | string	  | The key of the Subscription
| subscription	  | RxJS.SubscriptionLike	  | The subscription to add to the list

#### Example

```ts
subxMap.add('key', observable.subscribe(...));
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
