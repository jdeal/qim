# qim

WARNING: This is experimental right now. The API could still wildly change!

`qim` makes it simple to reach in and modify complex nested JS objects. This is possible with a query path that is just a simple JS array, much like you might use with `set` and `update` from `lodash`, but with a more powerful concept of "navigators" (borrowed from [Specter](https://github.com/nathanmarz/specter), a Clojure library). Instead of just string keys, `qim`'s navigators can act as predicates, wildcards, slices, and other tools. Those same navigators allow you to reach in and select parts of JS objects as well.

`qim`'s updates are immutable, returning new objects, but those objects share any unchanged parts with the original object.

`qim`'s API is curried and data last, so it should fit well with other functional libraries like `lodash` and `ramda`.

And `qim` does its best to stay performant!

# A not-too-contrived example

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

Okay, drum roll... with `qim`, we can do that like this:

```js
import {update, $eachValue, $apply} from 'qim';

const newState = update(['entity', 'account', $eachValue,
  account => account.type === 'savings', 'balance',
  [bal => bal >= 1000, $apply(bal => bal * 1.05)],
  [bal => bal < 100, $apply(bal => bal - 10)]
], state);
```

Even if you've never seen this before, hopefully you have a rough idea of what's going on. Instead of an only accepting an array of strings for a path, `qim`'s `update` function accepts an array of navigators. Using different types of navigators together creates a rich query path for updating a nested object. We'll look closer at this particular query in a bit, but first let's try the same thing with vanilla JS.

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

Yuck. That is ugly. Lots of references to things we don't really care about. Okay, hopefully nobody writes code like that. Let's use lodash-fp to clean that up.

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

Let's stretch out the previous example to take a closer look at some of the navigators used.

```js
const newState = update([
  // A string navigates to that key in the object.
  'entity', 'account',
  // $eachValue is like a wildcard that matches each value of an object or array.
  $eachValue,
  // Functions act like predicates and navigate only if it matches.
  account => account.type === 'savings',
  // Another key navigator.
  'balance',
  // Arrays are just nested queries and will descend...
  [
    // Another predicate to test for a high balance.
    bal => bal >= 1000,
    // $apply is used to transform that part of the object.
    $apply(bal => bal * 1.05)
  ],
  // ...and then return
  [
    // Another predicate to test for a low balance.
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

### `get(query, object)`

Like `select`, but only returns a single result. If many results would be returned from a `select`, it will return the first result.

```js
get(
  [$eachValue, value => value % 2 === 0],
  [1, 2, 3, 4, 5, 6]
)
// 2
```

Generally, this will perform much better than taking the first item of the array returned by a `select`.

### `has(query, object)`

Returns true if an object has a matching result.

```js
has(
  [$eachValue, value => value % 2 === 0],
  [1, 2, 3]
)
// true
```

```js
has(
  [$eachValue, value => value % 2 === 0],
  [1, 3, 5]
)
// false
```

### `select(query, object)`

Returns an array of selected results from an object.

```js
select(
  ['numbers', $eachValue, value => value % 2 === 0],
  {numbers: [1, 2, 3, 4, 5, 6]}
)
// [2, 4, 6]
```

### `set(query, value, object)`

Just a convenience method to set a query path to a constant value.

```js
set(
  ['users', 'joe', 'name'],
  'Joseph',
  {users: {joe: {name: 'Joe'}}}
)
// {users: {joe: {name: 'Joseph'}}}
```

```js
set(
  ['numbers', $eachValue, value => value % 2 === 0],
  0,
  {numbers: [1, 2, 3, 4, 5, 6]}
)
// {numbers: [1, 0, 3, 0, 5, 0]}
```

### `update(query, object)`

Returns a mutation of an object without changing the original object.

```js
update(
  ['users', 'joe', 'name', $apply(name => name.toUpperCase())],
  {users: {joe: {name: 'Joe'}}}
)
// {users: {joe: {name: 'JOE'}}}
```

```js
update(
  ['numbers', $eachValue, value => value % 2 === 0, $apply(value => value * 2)],
  {numbers: [1, 2, 3, 4, 5, 6]}
)
// {'numbers': [1, 4, 3, 8, 5, 12]}
```

## Navigators

### Built-in, type-based navigators

#### Key (string/integer)

Navigates to that key of an object/array.

```js
select(
  ['users', 'name', 'joe'],
  {users: {name: {joe: 'Joe'}}}
)
// [Joe]
```

```js
select(
  ['0', '0'],
  [['a', 'b'], ['c', 'd']]
)
// ['a']
```

```js
update(
  ['users', 'name', 'joe', $set('Joseph')],
  {users: {name: {joe: 'Joseph'}}}
)
// {"users": {"name": {"joe": "Joseph"}}}
```

```js
update(
  ['0', '0', $apply(letter => letter.toUpperCase())],
  [['a', 'b'], ['c', 'd']]
)
// [['A', 'b'], ['c', 'd']]
```

#### Predicate (function)

Passes the currently navigated value to the function and continues navigating if the function returns true.

```js
select(
  [$eachValue, value => value > 0],
  [-2, -1, 0, 1, 2, 3]
)
// [1, 2, 3]
```

```js
update(
  [$eachValue, value => value > 0, $set(0)],
  [-2, -1, 0, 1, 2, 3]
)
// [-2, -1, 0, 0, 0, 0]
```

#### Nested (array)

Branches and performs a sub-query. Mainly useful for `update`, since you may want to update different branches of an object in different ways. You can branch with  `select`, but this is less useful since you typically want to select homogenous value types.

```js
update(
  [$eachValue,
    ['x', $apply(x => x + 1)],
    ['y', $apply(y => y * 10)]
  ],
  [{x: 1, y: 1}, {x: 2, y: 2}]
)
// [{x: 2, y: 10}, {x: 3, y: 20}]
```

### Named navigators

By convention, all navigators are prefixed with a `$`. This is mainly intended to visually distinguish them in a query path. But it also is meant to distinguish them from normal functions. Navigators are declarative, meaning they represent a navigation to be performed, rather than actually doing an operation.

#### `$apply(fn)`

Transforms the currently navigated value using the provided function. Typically used for `update`, but can be used for `select` to transform the values selected.

```js
select(
  ['numbers', $eachValue, $apply(value => value * 2)],
  {numbers: [0, 1, 2, 3]}
)
// [0, 2, 4, 6]
```

```js
update(
  [$eachValue, $apply(value => value * 2)],
  {numbers: [0, 1, 2, 3]}
)
// {numbers: [0, 2, 4, 6]}
```

#### `$begin`

Navigates to an empty list at the beginning of an array. Useful for adding things to the beginning of a list.

```js
update(
  [$begin, $set([-2, -1, 0])],
  [1, 2, 3]
)
// [-2, -1, 0, 1, 2, 3]
```

#### `$eachKey`

Navigates to each key of an array or object.

```js
update(
  [$eachKey, $apply(key => key.toUpperCase())],
  {x: 1, y: 2, z: 3}
)
// {X: 1, Y: 2, Z: 3}
```

```js
select(
  [$eachKey],
  {x: 1, y: 2, z: 3}
)
// ['x', 'y', 'x']
```

#### `$eachPair`

Navigates to each key/value pair of an array or object. A key/value pair is just an array of `[key, value]`.

```js
update(
  [$eachPair, $apply(([key, value]) => [key.toUpperCase(), value * 2])],
  {x: 1, y: 2, z: 3}
)
// {X: 2, Y: 4, Z: 6}
```

```js
update(
  [$eachPair,
    [0, $apply(key => key.toUpperCase())],
    [1, $apply(value => value * 2)]
  ],
  {x: 1, y: 2, z: 3}
)
// {X: 2, Y: 4, Z: 6}
```

```js
select(
  [$eachPair],
  {x: 1, y: 2, z: 3}
)
// [['x', 1], ['y', 2], ['z', 3]]
```

#### `$eachValue`

Navigates to each value of an array or object.

```js
update(
  [$eachValue, $apply(num => num * 2)],
  [1, 2, 3]
)
// [2, 4, 6]
```

```js
update(
  [$eachValue, $apply(num => num * 2)],
  {x: 1, y: 2, z: 3}
)
// {x: 2, y: 4, z: 6}
```

```js
select(
  [$eachValue],
  [1, 2, 3]
)
// [1, 2, 3]
```

```js
select(
  [$eachValue],
  {x: 1, y: 2, z: 3}
)
// [1, 2, 3]
```

#### `$end`

Navigates to an empty list at the end of an array. Useful for adding things to the end of a list.

```js
update(
  [$end, $set([4, 5, 6])],
  [1, 2, 3]
)
// [1, 2, 3, 4, 5, 6]
```

#### `$nav(query)`

Given a query path, navigates as if that query was a single selector. This is useful for using queries as navigators (instead of nested queries). This has the same affect as spreading (`...`) a query into another query.

```js
const eachUser = $nav(['users', $eachValue]);

select(
  [eachUser, 'name'],
  {
    users: {
      joe: {
        name: 'Joe'
      },
      mary: {
        name: 'Mary'
      }
    }
  }
)
// ['Joe', 'Mary']
```

```js
const eachUser = $nav(['users', $eachValue]);

update(
  [eachUser, 'name', $apply(name => name.toUpperCase())],
  {
    users: {
      joe: {
        name: 'Joe'
      },
      mary: {
        name: 'Mary'
      }
    }
  }
)
// {users: {joe: {name: 'JOE'}, mary: {name: 'MARY'}}}
```

#### `$set(value)`

Just a convenience for setting a value, rather than using `$apply(() => value)`. (Also a teensy bit more performant.)

```js
update(
  [$eachValue, $set(0)],
  [1, 2, 3]
)
// [0, 0, 0]
```

#### `$slice(begin, end)`

Navigates to a slice of an array from `begin` to `end` index.

```js
select(
  [$slice(0, 3), $eachValue],
  [1, 2, 3, 4, 5, 6]
)
// [1, 2, 3]
```

```js
update(
  [$slice(0, 3), $eachValue, $set(0)],
  [1, 2, 3, 4, 5, 6]
)
// [0, 0, 0, 4, 5, 6]
```

```js
update(
  [$slice(2, 4), $set([])],
  ['a', 'b', 'c', 'd', 'e', 'f']
)
// ['a', 'b', 'e', 'f']
```

## Thanks

As mentioned above, the navigator concept borrows heavily from [Specter](https://github.com/nathanmarz/specter), a Clojure library written by Nathan Marz.
