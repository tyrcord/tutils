# SubX

RxJS Subscriptions management.

Provide Apis to store and manage RxJS subscriptions and provide methods to unsubscribe them all.

## Prerequisites

The project has dependencies that require Node 8.9 or higher, together
with NPM 5.5.1 or higher.

# Contents

- [Installation](#installation)
- [SubxList](#subxlist)
    - [API](docs/subx-list)
- [SubxMap](#subxmap)
    - [API](docs/subx-map)
- [License](#license)

# Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

```bash
npm install @tutils/subx --save
```

# SubxList

Object that holds and manages a list of Subscriptions.

### Usage

```ts
import { SubxList } from '@tutils/subx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const subxList = new SubxList();
const source = new Subject();

const subscription = source.subscribe();
const subscription2 = source.subscribe();

subxList.add(subscription);
subxList.add(subscription2);

...

subxList.unsubscribe();
```

[API Reference](docs/subx-list)

# SubxMap

Object that holds and manages Key-Subscription pairs.

### Usage

```ts
import { SubxMap } from '@tutils/subx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const subxList = new SubxMap();
const source = new Subject();

const subscription = source.subscribe();
const subscription2 = source.subscribe();

subxList.add('key1', subscription);
subxList.add('key2', subscription2);

...

subxList.unsubscribe();
```
[API Reference](docs/subx-map)

# License
Copyright (c) Tyrcord, Inc. Licensed under the ISC License.

See [LICENSE](LICENSE) file in the project root for details.
