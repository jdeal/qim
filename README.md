# qim

WARNING: This is experimental right now. The API could still wildly change!

Query your plain JS objects with powerful select and update functions. Immutable and functional.

## What?

Let's start with some data like this:

```js
const users = {
  mary: {
    name: {
      first: 'Mary',
      last: 'Bar'
    },
    friends: [],
    balance: 1000
  },
  joe: {
    name: {
      first: 'Joe',
      last: 'Foo'
    },
    friends: [],
    balance: 100
  }
};
```

`qim` makes it easy to reach in and modify an object. `qim`'s `update` function takes a query as an array of
"navigators" (more about that in a bit) and an object to modify.

```js
import {update} from 'qim';

const newUsers = update(['mary', 'balance', bal => bal + 10], users);
```

Strings navigate into the object, and functions apply modifications to that part of the object.

After this, Mary's balance has 10 more dollars, and our new object looks like:

```js
const users = {
  mary: {
    name: {
      first: 'Mary',
      last: 'Bar'
    },
    friends: [],
    balance: 1010
  },
  joe: {
    name: {
      first: 'Joe',
      last: 'Foo'
    },
    friends: [],
    balance: 100
  }
};
```

These modifications are immutable, and they share unmodified branches:

```js
console.log(newUsers !== users);
// true
console.log(newUsers.joe === users.joe);
// true
```

Changing something to its current value is a no-op:

```js
const newUsers = setIn(['joe', 'name', 'first', () => 'Joe'], users);
console.log(newUsers === users);
// true
```

Okay, now let's make things more interesting. Let's increase everyone's balance by 10.

```js
import {$eachValue} from 'qim';

const newUsers = updateIn([$eachValue, 'balance', bal => bal + 10], users);
```

As mentioned, each part of a query path in `qim` is actually a "navigator". Strings navigate to keys, and
functions apply modifications. `$eachValue` is a navigator that navigates to each value of an array or object. Kind of
like `mapValues` from `lodash`, but navigators in `qim` are only worried about what they navigate to, never about
anything they don't navigate to. Let's see what that means.

Let's say we want to increase everyone's balance by 10, but only if the balance is 500 or greater. Hmm, that sounds like
a map and a filter. But we want to modify the object, so we can't really filter. We have to do something like this:

```js
import {mapValues} from 'lodash/fp';

const newUsers = mapValues(
  user => {
    if (user.balance < 500) {
      return user;
    }
    return {
      ...user,
      balance: user.balance + 10
    };
  }
, users);
```

This is a simple example, but there are already a couple problems here. We have to worry about returning users that we
don't actually touch, _and_ we have to worry about the rest of the user properties that we don't touch. With `qim`, you
can do this instead:

```js
import {$if} from 'qim';

const newUsers = updateIn([$eachValue, 'balance', $if(bal => bal >= 500), bal => bal + 10], users);
```

Here we introduce `$if`, which is a predicate selector. Any function given to `$if` acts as a filter, and we only
continue navigating if the predicate passes. But we don't have to worry about the unfiltered users. Those remain
unchanged. And we only have to worry about the `balance` property. Other properties are also unchanged.

These navigators are useful for selecting data too.

```js
import {select} from 'qim';

const names = select([$eachValue, 'name', 'first'], users);
// ['Joe', 'Mary']
```

Let's get a little more fancy. Let's grab all the first names of people that have high balances.

```js
import {has} from 'qim';

// All functions are curried, so you can leave off the data to get a function.
const hasHighBalance = has(['balance', $if(bal => bal >= 500)]);

const names = select([$eachValue, $if(hasHighBalance), 'name', 'first']);
// ['Mary']
```

`has` checks if a selection returns anything. We use currying to create a function for checking if a user's balance
is high, and we use that as a predicate to select first names of users with a high balance.

Cool, huh?

## API

### `select(query, object)`

Returns an array of selected results from an object.

### `get(query, object)`

Returns a single result from an object.

### `has(query, object)`

Returns true if an object has a matching result.

### `update(query, object)`

Returns a mutation of an object without changing the original object.

### `set(query, value, object)`

Just a convenience method to set a query path to a constant value.

## Navigators

### `$eachValue`

Navigates to each value of an array or object.

### `$eachKey`

Navigates to each key of an array or object.

### `$eachPair`

Navigates to each key/value pair of an array or object. A key/value pair is just an array of `[key, value]`.

### `$if(predicate)`

Navigates if the current selection matches the predicate.

### `$set(value)`

Just a convenience for setting a value, rather than using `() => value`.

### `$begin`

Selects the empty list at the beginning of an array.

### `$end`

Selects the empty list at the end of an array.

### `$slice(begin, end)`

Selects a slice of an array from `begin` to `end` index.

### `$nav(query)`

Given a query path, navigates as if that query was a single selector.

## Thanks

The whole "navigator" idea is borrowed from https://github.com/nathanmarz/specter.
