# SubxList

Object that holds and manages a list of Subscriptions.

# API Summary

- [Accessors](#accessors)
    - [length](#length)
- [Methods](#methods)
    - [add](#add)
    - [get](#get)
    - [unsubscribeAtIndex](#unsubscribeAtIndex)
    - [unsubscribe](#unsubscribe)
    - [purge](#purge)

## Accessors

### length

Return the number of Subscriptions.

`subxList.length`

#### Example

```ts
const length = subxList.length;
```

## Methods

### add

Add Subscriptions to the list.

`subxList.add([subscription1[, ...[, subscriptionN]])`

#### Parameters

| Name    | Type      | Description  |
|---------|-----------|--------------|
| subscriptionN	| RxJS.SubscriptionLike | The subscriptions to add to the list

#### Example

```ts
subxList.add(subscription);
```

### get

Return a Subscription from the list with a specified index.

`subxList.get(index)`

#### Parameters

| Name    | Type      | Description  |
|---------|-----------|--------------|
| index	  | number	  | The index of the Subscription

#### Returns

The Subscription associated with the specified index, or `undefined` if using an invalid index number.

#### Example

```ts
const subscription = subxList.get(0);
```

### unsubscribeAtIndex

Unsubscribe to a Subscription with a specified index and remove it from list.

`subxList.unsubscribeAtIndex(index)`

#### Parameters

| Name    | Type      | Description  |
|---------|-----------|--------------|
| index	  | number	  | The index of the Subscription

#### Returns

`true` if a Subscription in the list existed and has been unsubscribed and removed, or `false` if the Subscription does not exist.

#### Example

```ts
const unsubscribed = subxList.unsubscribeAtIndex(0);
```

### unsubscribe

Unsubscribe to all Subscriptions and remove them from the list.

`subxList.unsubscribe()`

#### Example

```ts
subxList.unsubscribe();
```

### purge

Unsubscribe to all closed Subscriptions and remove them from the list.

`subxList.purge()`

#### Example

```ts
subxList.purge();
```
