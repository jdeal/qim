# qim

[![travis](https://travis-ci.org/jdeal/qim.svg?branch=master)](https://travis-ci.org/jdeal/qim)

WARNING: `qim` is already useful, but it's still considered experimental. It might have some rough edges, and the API might change!

`qim` makes it simple to reach in and modify complex nested JS objects. This is possible with a query path that is just a simple JS array, much like you might use with `set` and `update` from `lodash`, but with a more powerful concept of "navigators" (borrowed from [Specter](https://github.com/nathanmarz/specter), a Clojure library). Instead of just string keys, `qim`'s navigators can act as predicates, wildcards, slices, and other tools. Those same navigators allow you to reach in and select parts of JS objects as well.

`qim`'s updates are immutable, returning new objects, but those objects share any unchanged parts with the original object.

`qim`'s API is curried and data last, so it should fit well with other functional libraries like `lodash/fp` and `ramda`.

And `qim` does its best to stay performant!

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Contents**

- [A simple (kind-of-contrived) example](#a-simple-kind-of-contrived-example)
- [A more complex (not-too-contrived) example](#a-more-complex-not-too-contrived-example)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [`apply(query, transform, object)`](#applyquery-transform-object)
  - [`find(query, object)`](#findquery-object)
  - [`has(query, object)`](#hasquery-object)
  - [`select(query, object)`](#selectquery-object)
  - [`set(query, value, object)`](#setquery-value-object)
  - [`update(query, object)`](#updatequery-object)
- [Navigators](#navigators)
  - [Built-in, type-based navigators](#built-in-type-based-navigators)
    - [Key (string/integer)](#key-stringinteger)
    - [Predicate (function)](#predicate-function)
    - [Nested (array)](#nested-array)
    - [Stop (undefined/null)](#stop-undefinednull)
  - [Named navigators](#named-navigators)
    - [`$apply(fn)`](#applyfn)
    - [`$begin`](#begin)
    - [`$default(value)`](#defaultvalue)
    - [`$each`](#each)
    - [`$eachKey`](#eachkey)
    - [`$eachPair`](#eachpair)
    - [`$end`](#end)
    - [`$first`](#first)
    - [`$last`](#last)
    - [`$lens(fn, fromFn)`](#lensfn-fromfn)
    - [`$merge(spec)`](#mergespec)
    - [`$mergeDeep(spec)`](#mergedeepspec)
    - [`$nav(path)`](#navpath)
    - [`$none`](#none)
    - [`$pick(keys, ...keys)`](#pickkeys-keys)
    - [`$pushContext(key, (obj, context) => contextValue)`](#pushcontextkey-obj-context--contextvalue)
    - [`$set(value)`](#setvalue)
    - [`$setContext(key, (value, context) => contextValue)`](#setcontextkey-value-context--contextvalue)
    - [`$slice(begin, end)`](#slicebegin-end)
    - [`$traverse({select, update})`](#traverseselect-update)
- [Custom navigators](#custom-navigators)
  - [Path navigators](#path-navigators)
  - [Parameterized path navigators](#parameterized-path-navigators)
  - [Lens navigators](#lens-navigators)
  - [Parameterized lens navigators](#parameterized-lens-navigators)
  - [Core navigators](#core-navigators)
  - [Parameterized core navigators](#parameterized-core-navigators)
- [Performance](#performance)
- [TODO](#todo)
- [Contributing](#contributing)
- [Thanks](#thanks)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## A simple (kind-of-contrived) example

Let's start with some data like this:

```js
const state = {
  users: {
    joe: {
      name: {
        first: 'Joe',
        last: 'Foo'
      },
      other: 'stuff'
    },
    mary: {
      name: {
        first: 'Mary',
        last: 'Bar'
      },
      other: 'stuff'
    }
  },
  other: 'stuff'
};
```

Let's import a couple things from `qim`:

```js
import {select, $each} from 'qim';
```

Now let's grab all the first names:

```js
const firstNames = select(['users', $each, 'name', 'first'], state);
```

(We'll explain `$each` a little more later, but you can probably guess: it's like a wildcard.)

`firstNames` now looks like:

```js
['Joe', 'Mary']
```

Let's import a couple more things:

```js
import {update, $apply} from 'qim';
```

And now we can upper-case all our first names.

```js
const newState = update(['users', $each, 'name', 'first',
  $apply(firstName => firstName.toUpperCase())
], state);
```

Notice we used the same path from our `select` but added an `$apply` to do a transformation. (Again, we'll explain `$apply` better in the next section.)

After that, `newState` looks like:

```js
const state = {
  users: {
    joe: {
      name: {
        first: 'JOE',
        last: 'Foo'
      },
      other: 'stuff'
    },
    mary: {
      name: {
        first: 'MARY',
        last: 'Bar'
      },
      other: 'stuff'
    }
  },
  other: 'stuff'
};
```

Just for comparison, let's grab the first names with plain JS:

```js
const firstNames = Object.keys(state.users)
  .map(username => state.users[username].name.first);
```

That's not too bad, but this is a very simple example. The `$each` from `qim` makes things a lot more expressive. Let's look at `lodash/fp` too:

```js
const {map, get} from 'lodash/fp';

const firstName = flow(
  get('users'),
  map(get(['name', 'first']))
)(state);
```

Okay, that's nice and expressive, but it costs a lot in terms of performance.

| Test           |   Ops/Sec |
| :------------- | --------: |
| native         | 2,111,043 |
| lodash/fp flow |    16,484 |
| qim select     | 1,197,764 |

`qim` is slower than native, but it's doing more than the native equivalent, because it's accounting for things like missing keys. And as you'll see later, it has a _lot_ more expressive power. The `lodash/fp` version is two orders of magnitude slower and arguably less readable than the `qim` version.

That update in plain JS is a _lot_ more verbose, even for this really simple example:

```js
const newState = {
  ...state,
  users: Object.keys(state.users)
    .reduce((users, username) => {
      const user = state.users[username];
      users[username] = {
        ...user,
        name: {
          ...user.name,
          first: user.name.first.toUpperCase()
        }
      };
      return users;
    }, {})
};
```

So we go with something like `lodash/fp`:

```js
const newState = fp.update('users', fp.mapValues(
  fp.update(['name', 'first'], firstName => firstName.toUpperCase())
), state)
```

But again, performance is going to take a hit:

| Test       | Ops/Sec |
| :--------- | ------: |
| native     | 283,439 |
| lodash/fp  |  16,844 |
| qim update | 161,499 |

Again, native is the fastest, but at a cost of being awfully unreadable. `lodash/fp` lags behind, but `qim`'s main goal isn't to be performant but rather to be expressive. `lodash/fp` looks pretty nice, but remember how closely the `update` resembled the `select` with `qim`? With `lodash/fp`, an update is a different animal. And as we'll see with a more complex example, `qim` will retain its simple, expressive query power for updates while lodash is going to get more complicated.

## A more complex (not-too-contrived) example

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
import {update, $each, $apply} from 'qim';

const newState = update(['entity', 'account', $each,
  account => account.type === 'savings', 'balance',
  [bal => bal >= 1000, $apply(bal => bal * 1.05)],
  [bal => bal < 100, $apply(bal => bal - 10)]
], state);
```

Even without any explanation, hopefully you have a rough idea of what's going on. Like we saw in the simple example with `$each` and `$apply`, instead of only accepting an array of strings for a path, `qim`'s `update` function accepts an array of navigators. Using different types of navigators together creates a rich query path for updating a nested object. We'll look closer at this particular query in a bit, but first let's try the same thing with vanilla JS.

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

Yuck. That is ugly. Lots of references to things we don't really care about. Okay, hopefully nobody writes code like that. Let's use `lodash/fp` to clean that up.

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
2. Similarly, we have to return the balance even if it's not a low or high balance that we want to change.
3. If we nest deeper _and_ break out of point-free style, it gets pretty awkward to write or read the code. We could clean that up by splitting this into multiple functions, but remember how concise the requirement is vs the resulting code complexity.
4. If none of our accounts actually match these criteria, we'll still end up with a new state object.

`qim` boils this down to the essential declarative parts, using an expressive query path, and it avoids unnecessary mutations.

Let's stretch out the previous example to take a closer look at some of the navigators used.

```js
const newState = update([
  // A string navigates to that key in the object.
  'entity', 'account',
  // $each is like a wildcard that matches each value of an object or array.
  $each,
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

Because navigators are only ever working on the part of the object that you've navigated to, you don't ever have to worry about the parts of the object that you don't touch. Those parts remain intact.

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

And of course these navigators are useful for selecting data too. Instead of modifying an object, the `select` method navigates to each matching part of the query and returns all the matching parts in an array.

```js
import {select} from 'qim';

const names = select(['entity', 'account', $each, 'owner'], state);
// ['joe', 'mary', 'bob']
```

Let's get a little more fancy. Let's grab all the usernames of people that have high balances.

```js
import {has} from 'qim';

// All functions are curried, so you can leave off the data to get a function.
const hasHighBalance = has(['balance', bal => bal >= 1000]);

const usernames = select(['entity', 'account', $each, hasHighBalance, 'owner'], state);
// ['mary']
```

`has` checks if a selection returns anything. We use currying to create a function for checking if an account balance
is high, and we use that as a predicate to select the owners with a high balance.

Cool, huh?

## Installation

```bash
npm install qim --save
```

## Usage

All functions and navigators are available as named exports:

```js
import {select, update, $each, $apply} from 'qim';
```

Or of course you can just import everything:

```js
import * as qim from 'qim';
```

You can also import individual functions. If you import from `qim`, then don't do this! `qim` points to a bundle that includes all the individual modules, so importing individual modules will import them again.

```js
import select from 'qim/select';
import update from 'qim/select';
import $each from 'qim/$each';
import $apply from 'qim/$apply';
```

## API

### `apply(query, transform, object)`

Just a convenience method for updating with a single transform ($apply) function.

```js
apply(
  ['users', 'joe', 'name'],
  name => name.toUpperCase(),
  {users: {joe: {name: 'Joe'}}}
)
// {users: {joe: {name: 'JOE'}}}
```

```js
apply(
  ['numbers', $each, value => value % 2 === 0],
  num => num * num,
  {numbers: [1, 2, 3, 4, 5, 6]}
)
// {numbers: [1, 4, 3, 16, 5, 36]}
```

### `find(query, object)`

Like `select`, but only returns a single result. If many results would be returned from a `select`, it will return the first result.

```js
find(
  [$each, value => value % 2 === 0],
  [1, 2, 3, 4, 5, 6]
)
// 2
```

Generally, this will perform much better than taking the first item of the array returned by a `select`.

### `has(query, object)`

Returns true if an object has a matching result.

```js
has(
  [$each, value => value % 2 === 0],
  [1, 2, 3]
)
// true
```

```js
has(
  [$each, value => value % 2 === 0],
  [1, 3, 5]
)
// false
```

### `select(query, object)`

Returns an array of selected results from an object.

```js
select(
  ['numbers', $each, value => value % 2 === 0],
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
  ['numbers', $each, value => value % 2 === 0],
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
  ['numbers', $each, value => value % 2 === 0, $apply(value => value * 2)],
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
  [$each, value => value > 0],
  [-2, -1, 0, 1, 2, 3]
)
// [1, 2, 3]
```

```js
update(
  [$each, value => value > 0, $set(0)],
  [-2, -1, 0, 1, 2, 3]
)
// [-2, -1, 0, 0, 0, 0]
```

#### Nested (array)

Branches and performs a sub-query. Mainly useful for `update`, since you may want to update different branches of an object in different ways. You can branch with  `select`, but this is less useful since you typically want to select homogenous value types.

```js
update(
  [$each,
    ['x', $apply(x => x + 1)],
    ['y', $apply(y => y * 10)]
  ],
  [{x: 1, y: 1}, {x: 2, y: 2}]
)
// [{x: 2, y: 10}, {x: 3, y: 20}]
```

#### Stop (undefined/null)

Stops navigation. This is most useful inside `$nav` or custom path navigators to stop navigation for certain values.

```js
select(['x', undefined, 'y'], {x: {y: 1}})
// []
```

```js
update(['x', undefined, 'y', $apply(value => value + 1)], {x: {y: 1}})
// {x: {y: 1}}
```

For nested queries, `undefined`/`null` only stops the current nested query, not the whole query.

```js
select([
  ['a', undefined, 'x'],
  ['b', 'x']
], {a: {x: 'ax'}, b: {x: 'bx'}})
// ['bx']
```

```js
update([
  ['a', undefined, 'x', $apply(s => s.toUpperCase())],
  ['b', 'x', $apply(s => s.toUpperCase())]
], {a: {x: 'ax'}, b: {x: 'bx'}})
// {a: {x: 'ax'}, b: {x: 'BX'}}
```

### Named navigators

By convention, all navigators are prefixed with a `$`. This is mainly intended to visually distinguish them in a query path. But it also is meant to distinguish them from normal functions. Navigators are declarative, meaning they represent a navigation to be performed, rather than actually doing an operation.

#### `$apply(fn)`

Transforms the currently navigated value using the provided function. Typically used for `update`, but can be used for `select` to transform the values selected.

```js
select(
  ['numbers', $each, $apply(value => value * 2)],
  {numbers: [0, 1, 2, 3]}
)
// [0, 2, 4, 6]
```

```js
update(
  [$each, $apply(value => value * 2)],
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

#### `$default(value)`

By default, `qim` will create missing objects when you try to update a path that doesn't exist. You can use `$default` to change this behavior and provide your own default value.

```js
set(['x', $default([]), 0], 'a', {})
// {x: ['a']}
```

```js
set(['x', $default({a: 0}), 'y'], 0, {})
// {x: {a: 0, y: 0}}
```

```js
set(['names', $default(['a', 'b']), 0], 'joe', {})
// {names: ['joe', 'b']}
```

#### `$each`

Navigates to each value of an array or object.

```js
update(
  [$each, $apply(num => num * 2)],
  [1, 2, 3]
)
// [2, 4, 6]
```

```js
update(
  [$each, $apply(num => num * 2)],
  {x: 1, y: 2, z: 3}
)
// {x: 2, y: 4, z: 6}
```

```js
select(
  [$each],
  [1, 2, 3]
)
// [1, 2, 3]
```

```js
select(
  [$each],
  {x: 1, y: 2, z: 3}
)
// [1, 2, 3]
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

#### `$end`

Navigates to an empty list at the end of an array. Useful for adding things to the end of a list.

```js
update(
  [$end, $set([4, 5, 6])],
  [1, 2, 3]
)
// [1, 2, 3, 4, 5, 6]
```

#### `$first`

Navigates to the first value of an array or object.

```js
select([$first], [0, 1, 2])
// [0]

select([$first], {x: 0, y: 1, z: 2})
// [0]

update([$first, $set('first')], [0, 1, 2])
// ['first', 1, 2]

update([$first, $set('first')], {x: 0, y: 1, z: 2})
// {x: 'first', y: 1, z: 2}
```

#### `$last`

Navigates to the last value of an array or object.

```js
select([$last], [0, 1, 2])
// [2]

select([$last], {x: 0, y: 1, z: 2})
// [2]

update([$last, $set('last')], [0, 1, 2])
// [0, 1, 'last']

update([$last, $set('last')], {x: 0, y: 1, z: 2})
// {x: 0, y: 1, z: 'last'}
```

#### `$lens(fn, fromFn)`

Lens is like `$apply`, and the first function behaves identically, in that it transforms the current value using the provided function. But it also takes a second function that can be used to apply the result of a transformation to the current object during an update.

```js
const $pct = $lens(
  // The first function transforms the result, just like $apply.
  // This simple example transforms a decimal value to its percentage equivalent.
  n => n * 100,
  // The second function inverts the transformation on the way back.
  // This simple example transforms a percentage value to its decimal equivalent.
  pct => pct / 100
);

update(
  ['x', $pct, pct => pct > 50, $apply(pct => pct + 5)],
  {x: .75}
)
// {x: .80}
```

See [custom navigators](#custom-navigators) for more about `$lens`.

#### `$merge(spec)`

Similar to `$apply(object => ({...object, ...spec}))` except:

- Does not create a new object if `object` already has the same keys/values as `spec`.
- Will create a new array if `object` is an array so can be used to merge arrays.

```js
update([$merge({y: 2})], {x: 1})
// {x: 1, y: 2}
```

```js
update([$merge(['a'])], ['x', 'y', 'z'])
// ['a', 'y', 'z']
```

#### `$mergeDeep(spec)`

Deep merging version of `$merge`. Typically, deep merging is better handled with nested queries. But if you must...

```js
update([$mergeDeep({a: {ab: 2}})], {a: {aa: 1}, b: 2})
// {a: {aa: 1, ab: 2}, b: 2}
```

#### `$nav(path)`

Given a query path, `$nav` navigates as if that query was a single selector. This is useful for using queries as navigators (instead of nested queries). This has the same affect as spreading (`...`) a query into another query.

```js
const $eachUser = $nav(['users', $each]);

select(
  [$eachUser, 'name'],
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
const $eachUser = $nav(['users', $each]);

update(
  [$eachUser, 'name', $apply(name => name.toUpperCase())],
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

If `path` is a function, it will be passed the current object, and it can return a dynamic query. This can be used to inline a custom navigator or just to get the current value in scope.

```js
update(
  [
    $each, $nav(
      obj => ['isEqual', $set(obj.x === obj.y)]
    )
  ],
  [{x: 1, y: 1}, {x: 1, y: 2}]
)
// [
//   {x: 1, y: 1, isEqual: true},
//   {x: 1, y: 2, isEqual: false}
// ]
```

See [custom navigators](#custom-navigators) for more about `$lens`.

#### `$none`

Navigates to nothing so you can delete properties from objects and items from arrays. It would be great to use `undefined` for this, but technically `undefined` is a value in JS, so `$none` exists to allow for the edge case of being able to set a property or item to `undefined`.

```js
update(
  ['x', $none],
  {x: 1, y: 2}
)
// {y: 2}
```

```js
update(
  [0, $none],
  ['a', 'b']
)
// ['b']
```

```js
update(
  [$each, value => value % 2 === 0, $none],
  [1, 2, 3, 4, 5, 6]
)
// [1, 3, 5]
```

#### `$pick(keys, ...keys)`

Navigates to a subset of an object, using the provided keys (or arrays of keys).

```js
select(
  [$pick('joe', 'mary'), $each, 'name'],
  {joe: {name: 'Joe'}, mary: {name: 'Mary'}, bob: {name: 'Bob'}}
)
// ['Joe', 'Mary']
```

```js
update(
  [$pick('x', 'y'), $set({a: 1})],
  {x: 1, y: 1, z: 1}
)
// {a: 1, z: 1}
```

```js
update(
  [$pick('x', 'y'), $each, $apply(val => val + 1)],
  {x: 1, y: 1, z: 1}
)
{x: 2, y: 2, z: 1}
```

#### `$pushContext(key, (obj, context) => contextValue)`

This is a convenient form of `$setContext` where the current value for the key is assumed to be an array and the new value is pushed onto that array. This is especially useful for recursive queries where you want to retain parent context values.

```js
select(
  [
    $eachPair, $pushContext('path', find(0)), 1,
    $eachPair, $pushContext('path', find(0)), 1,
    $apply((message, ctx) => ({path: ctx.path, message}))
  ],
  {error: {foo: 'a', bar: 'b'}, warning: {baz: 'c', qux: 'd'}}
)
// [
//   {path: ['error', 'foo'], message: 'a'},
//   {path: ['error', 'bar'], message: 'b'},
//   {path: ['warning', 'baz'], message: 'c'},
//   {path: ['warning', 'qux'], message: 'd'}
// ]
```

#### `$set(value)`

Just a convenience for setting a value, rather than using `$apply(() => value)`. (Also a teensy bit more performant.)

```js
update(
  [$each, $set(0)],
  [1, 2, 3]
)
// [0, 0, 0]
```

#### `$setContext(key, (value, context) => contextValue)`

Sets a context value for later retrieval in an `$apply`.

Context is a way to grab a piece of data at one point in a query and use it at a later point in a query. A good example is grabbing a key from a key/value pair and retrieving that key along with a descendant value so that it can be returned in a selection or used in an update. You could use a `$nav` function to pull that key into scope, but for multiple levels of nesting, this can get unwieldy. And for recursive queries, this is impossible without creating some kind of complex enveloping mechanism.

`$setContext` takes a key and a function as arguments. The key is just a way of keeping that piece of context separate from other pieces of context. The function takes the current value and context and returns a value to store for that piece of context. Note that context is never mutated, so the new context only applies to the rest of the query.

```js
select(
  [$setContext('first', find($first)), $each, $apply((letter, ctx) => `${ctx.first}${letter}`)],
  ['a', 'b', 'c']
)
// ['aa', 'ab', 'ac']
```

```js
select(
  [
    $eachPair, $setContext('level', find(0)), 1,
    $eachPair, $setContext('key', find(0)), 1,
    $apply((message, ctx) => ({level: ctx.level, key: ctx.key, message}))
  ],
  {error: {foo: 'a', bar: 'b'}, warning: {baz: 'c', qux: 'd'}}
)
// [
//   {level: 'error', key: 'foo', message: 'a'},
//   {level: 'error', key: 'bar', message: 'b'},
//   {level: 'warning', key: 'baz', message: 'c'},
//   {level: 'warning', key: 'qux', message: 'd'}
// ]
```

#### `$slice(begin, end)`

Navigates to a slice of an array from `begin` to `end` index.

```js
select(
  [$slice(0, 3), $each],
  [1, 2, 3, 4, 5, 6]
)
// [1, 2, 3]
```

```js
update(
  [$slice(0, 3), $each, $set(0)],
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

#### `$traverse({select, update})`

See [custom navigators](#custom-navigators).

## Custom navigators

Custom navigators are simply composed of other navigators. For example, you could create a `$toggle` navigator that flips boolean values like this:

```js
const $toggle = $apply(val => !Boolean(val));

update(['isOn', $toggle], {isOn: false})
// {isOn: true}
```

In particular though, the important navigators for building other navigators are `$nav`, `$lens`, and `$traverse`.

`$nav` lets you build "path" navigators. A path navigator is the highest level option. If you want to abstract away multiple other navigators, or you want to dynamically choose a navigator based on the current object being navigated to, or you want to do a recursive query, you probably want a path navigator.

`$lens` lets you build "lens" navigators. A lens navigator is generally going to be simpler than a core navigator and will be almost as performant, but doesn't offer quite as much control. Think of a lens navigator as a two-way `$apply`. You transform the current object for the rest of the query, and for an update, you define a transformation to be applied to the object. If you _always_ want to call the rest of the query, and you only want to call the rest of the query _once_, then a lens navigator is a good fit.

`$traverse` lets you build, for lack of a better term, "core" navigators. It's the lowest-level option and gives you complete control of data selection and updates. Generally, core navigators are going to be the most performant, but they're also going to require the most code. If you need to _maybe_ call the rest of the query, or you want to call the rest of the query _many_ times, you probably need a core navigator.


### Path navigators

The simplest path navigator just points to a query path. This is useful for using queries as navigators (instead of nested queries). This has the same affect as spreading (`...`) a query into another query.

```js
const $eachUser = $nav(['users', $each]);

select(
  [$eachUser, 'name'],
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

update(
  [$eachUser, 'name', $apply(name => name.toUpperCase())],
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

The `path` passed to `$nav` can also be a function, which allows it to provide a different path based on the current value.

```js
const $fileNames = $nav(
  path: (obj) => {
    if (obj.type === 'folder') {
      return ['files', $each, 'name'];
    }
    if (obj.type === 'file') {
      return ['name'];
    }
    // Returns `undefined` which stops navigation.
  }
);

select(
  [$each, $fileNames],
  [{type: 'file', name: 'foo'}, {type: 'folder', files: [{name: 'bar'}]}, {type: 'other', name: 'thing'}]
)
['foo', 'bar']
```

You can also create recursive queries using the `$self` parameter. You can also just refer to your own navigator by its variable name, but `$self` allows you to create recursive anonymous/inline navigators.

```js
const $walk = $nav(
  (item, $self) =>
    Array.isArray(item) ? [$each, $self] : []
);

select(
  [$walk, val => val % 2 === 0],
  [0, 1, 2, [3, 4, 5, [6, 7, 8]]]
)
// [0, 2, 4, 6, 8]

update(
  [$walk, val => val % 2 === 0, $apply(val => val * 10)],
  [0, 1, 2, [3, 4, 5, [6, 7, 8]]]
)
// [0, 1, 20, [3, 40, 5, [60, 7, 80]]]
```

### Parameterized path navigators

To parameterize a path navigator, just create a function that returns a path navigator.

```js
const $take = (count) => $nav(
  (obj) => {
    if (!Array.isArray(obj)) {
      throw new Error('$take only works on arrays');
    }
    return [$slice(0, count)];
  }
);

select(
  [$take(3), $each],
  [0, 1, 2, 3, 4, 5]
)
// [0, 1, 2]

update(
  [$take(3), $each, $apply(val => val * 10)],
  [0, 1, 2, 3, 4, 5]
)
// [0, 10, 20, 3, 4]
```

### Lens navigators

Lens navigators are built by using `$lens`, which takes two functions. The first function applies a transformation for either a select or update. The second function is only invoked for an update and allows you to apply that transformation to the current object.

```js
// Create a navigator that selects or modifies the length of an array.
const $length = $lens(
  (object) => {
    if (Array.isArray(object)) {
      return object.length;
    }
    throw new Error('$length only works on arrays');
  },
  (newLength, object) => {    
    const newLength = next(object.length);
    if (newLength < object.length) {
      return object.slice(0, newLength);
    }
    if (newLength > object.length) {
      object = object.slice(0);
      for (let i = 0; i < newLength - object.length; i++) {
        object.push(undefined);
      }
      return object;
    }
    return object;
  }
);

select([$length], [1, 1, 1])
// [3]

set([$length], 3, [1, 1, 1])
// [1, 1, 1]

set([$length], 2, [1, 1, 1])
// [1, 1]

set([$length], 4, [1, 1, 1])
// [1, 1, 1, undefined]
```

### Parameterized lens navigators

To parameterize a lens navigator, just create a function that returns a lens navigator.

```js
const $split = (char) => $lens(
  (string) => string.split(char),
  (splitString) => splitString.join(char)
);

update(
  [$split('@'), 0, $apply(name => name.toUpperCase())],
  'joe.foo@example.com'
)
// JOE.FOO@example.com
```

### Core navigators

Core navigators are built by using `$traverse`, which takes an object with a `select` and `update` function.

```js
// Create a navigator that selects or modifies the length of an array.
const $length = $traverse({
  select: (object, next) => {
    if (Array.isArray(object)) {
      return next(object.length);
    }
    throw new Error('$length only works on arrays');
  },
  update: (object, next) => {
    if (Array.isArray(object)) {
      const newLength = next(object.length);
      if (newLength < object.length) {
        return object.slice(0, newLength);
      }
      if (newLength > object.length) {
        object = object.slice(0);
        for (let i = 0; i < newLength - object.length; i++) {
          object.push(undefined);
        }
        return object;
      }
      return object;
    }
    throw new Error('$length only works on arrays');
  }
});

select([$length], [1, 1, 1])
// [3]

set([$length], 3, [1, 1, 1])
// [1, 1, 1]

set([$length], 2, [1, 1, 1])
// [1, 1]

set([$length], 4, [1, 1, 1])
// [1, 1, 1, undefined]
```

### Parameterized core navigators

To parameterize a core navigator, just create a function that returns a core navigator.

```js
// Create a navigator that selects or updates the first n items of an array.
const $take = (count) => $traverse({
  select: (object, next) => {
    if (Array.isArray(object)) {
      return next(object.slice(0, count));
    }
    throw new Error('$take only works on arrays');
  },
  update: (object, next) => {
    if (Array.isArray(object)) {
      const result = next(object.slice(0, count));
      const newArray = object.slice(0);
      newArray.splice(0, count, ...result);
      return newArray;
    }
    throw new Error('$take only works on arrays');
  }
});

select([$take(2)], ['a', 'b', 'c'])
// [['a', 'b']]

set([$take(2)], ['x'], ['a', 'b', 'c'])
// ['x', 'c']
```

## Performance

`qim` aims to be _performant enough_.

For `lodash` operations that are immutable (like `get` and `set`), `qim` should have similar performance. Many `lodash` functions mutate (like `update`), and in most cases, `qim` will be faster than `lodash/fp`'s immutable functions. Likewise, `qim` will typically be faster than React's immutability helper (now an [external package](https://github.com/kolodny/immutability-helper)).

In some cases, a custom native helper function using `Object.assign` or `slice` along with a mutation may be faster for simple operations, but `qim` aims to be as close as possible, while still allowing for a flexible querying API.

Comparing to Immutable.js is difficult in that it heavily depends on your particular use case. The sweet spot for Immutable.js is lots of transformations of _large_ objects or arrays (thousands of items). And even then, you need to avoid marshalling data back and forth between Immutable and plain JS. If you marshal the data back and forth, you'll lose most of the benefit, and if you work with smaller objects and arrays, you're unlikely to see much benefit.

If you want flexible select and update of plain JS objects, `qim` is likely to be a good fit. You can check out the [current benchmarks](docs/benchmark-results.md) to get an idea how `qim` stacks up. As with all benchmarks, be careful reading into them too much. Also, `qim` is new and performance tradeoffs could change in favor of simplifying the code or API.

## TODO

- Work with iterables (like Map).
- More tests.
- Better error messages.
- Expose ES6 modules.
- Static typing? `qim` might be diametrically opposed to static types, but worth seeing how good/bad they would fit.

## Contributing

- Do the usual fork and PR thing.
- Make sure tests pass with `npm test` and preferaby add additional tests.
- Make sure to run `npm run benchmark` to make sure the benchmarks pass. Currently, the benchmarks are running against Node 6.2.2 on a late 2013 MacBook Pro. The benchmarks are by no means perfect, and small regressions may be allowed in exchange for significant improvements, but for the most part, performance needs to remain consistent or improve.
- Thanks!

## Thanks

As mentioned above, the navigator concept borrows heavily from [Specter](https://github.com/nathanmarz/specter), a Clojure library written by Nathan Marz.
