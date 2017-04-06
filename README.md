# qim

WARNING: This is experimental right now. The API could still wildly change!

Immutable/functional select/update queries for plain JS.

## Say what?

Let's start with some data like this:

```js
const state = {
  entity: {
    account: {
      100: {
        owner: 'joe',
        type: 'savings',
        balance: 90
      },
      200: {
        owner: 'mary',
        type: 'savings',
        balance: 1100
      },
      300: {
        owner: 'bob',
        type: 'checking',
        balance: 50
      }
    }
  }
};
```

Let's say we want to change our `state` so that for every _savings account_, we:

1. Add 5% interest to any balance > 1000.
2. Subtract 10 from any balance < 100. Cause fees are how banks make money, right?

(And I know banks should have transactions, yada, yada.)

Let's try this with vanilla JS:

```js
const newState = {
  ...state,
  entity: {
    ...state.entity,
    account: Object.keys(state.entity.account).reduce((result, id) => {
      const account = state.entity.account[id];
      if (account.type === 'savings') {
        if (account.balance >= 1000) {
          result[id] = {
            ...account,
            balance: account.balance * 1.05
          };
          return result;
        }
        if (account.balance < 100) {
          result[id] = {
            ...account,
            balance: account.balance - 10
          };
          return result;
        }
      }
      result[id] = account;
      return result;
    }, {})
  }
};
```

Yuck. That is ugly. Our relatively simple requirements ballooned into quite a bit of code. Lots of references to
things we don't really care about. Okay, hopefully nobody writes code like that. Let's use lodash-fp to clean that up.

```js
import fp from 'lodash/fp';

const newState = fp.update(['entity', 'account'], fp.mapValues(account =>
  account.type === 'savings' ? (
    fp.update('balance', fp.cond([
      [bal => bal >= 1000, bal => bal * 1.05],
      [bal => bal < 100, bal => bal - 10],
      [fp.stubTrue, bal => bal]
    ]), account)
  ) : account
), state)
```

Okay, that's a lot more concise, but there are still some problems:

1. We have to return `account` in the case where it's not a savings account. Our original requirement was really to filter out savings accounts and operate on those, but we can't really do that, because we want to modify the whole state. Using a `filter` would strip out the accounts we don't modify.
2. Similarly, we have return the balance even if it's not a low or high balance that we want to change.
3. If we nest deeper _and_ break out of point-free style, it gets pretty awkward to write or read the code. We could clean that up by splitting this into multiple functions, but remember how concise the requirement is vs the resulting code complexity.
4. If none of our accounts actually match these criteria, we'll still end up with a new state object.

`qim` boils this down to the essential declarative parts, using an expressive query path, and it avoids unnecessary mutations.

```js
import {update, $eachValue, $apply} from 'qim';

const newState = update(['entity', 'account', $eachValue,
  account => account.type === 'savings', 'balance',
  [bal => bal >= 1000, $apply(bal => bal * 1.05)],
  [bal => bal < 100, $apply(bal => bal - 10)]
], state);
```

Even if you've never seen this before, hopefully you have a rough idea of what's going on. Instead of only accepting an array of strings for a path, `qim`'s `update` function accepts an array of "navigators". Using different types of navigators together creates a rich query path for selecting from and updating a nested object. Let's stretch out the previous example to take a closer look at some of the navigators used.

```js
const newState = update([
  // A string navigates to that key in the object.
  'entity', 'account',
  // $eachValue is like a wildcard that matches each value of an object or array.
  $eachValue,
  // Functions act like predicates and navigate only if it matches.
  account => account.type === 'savings',
  'balance',
  // Arrays are just nested queries and will descend...
  [
    bal => bal >= 1000,
    // $apply is used to transform that part of the object.
    $apply(bal => bal * 1.05)
  ],
  // ...and then return
  [
    bal => bal < 100,
    // Having the transform function inside the query path allows
    // us to do multiple transformations on different paths.
    $apply(bal => bal - 10)
  ]
], state);
```

Because navigators are only ever working on the part of the object that you've navigated to, you don't ever have to worry the parts of the object that you don't touch. Those parts remain intact.

These modifications are immutable, and they share unmodified branches:

```js
console.log(newState !== state);
// true
console.log(newState[300] === state[300]);
// true
```

Changing something to its current value is a no-op:

```js
const newState = update(['entity', 'account', 300, 'type', () => 'checking'], state);
console.log(newState === state);
// true
```

These navigators are useful for selecting data too. Instead of modifying an object, the `select` method navigates to each matching part of the query and returns all the matching parts in an array.

```js
import {select} from 'qim';

const names = select(['entity', 'account', $eachValue, 'owner'], state);
// ['joe', 'mary', 'bob']
```

Let's get a little more fancy. Let's grab all the usernames of people that have high balances.

```js
import {has} from 'qim';

// All functions are curried, so you can leave off the data to get a function.
const hasHighBalance = has(['balance', bal => bal >= 1000]);

const usernames = select(['entity', 'account', $eachValue, hasHighBalance, 'owner'], state);
// ['mary']
```

`has` checks if a selection returns anything. We use currying to create a function for checking if an account balance
is high, and we use that as a predicate to select the owners with a high balance.

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
