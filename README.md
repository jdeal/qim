# qim

WARNING: This is experimental right now. The API could still wildly change!

Functional style immutability for plain JS with special query sauce.

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

`qim` has a bunch of helpers like this that make it easy to reach in and modify an object:

```js
import {setIn, updateIn, pushIn} from 'qim';

const newUsers1 = setIn(['joe', 'name', 'first'], 'Joseph', users);
const newUsers2 = updateIn(['mary', 'balance'], bal => bal + 10, users);
const newUsers3 = pushIn(['joe', 'friends'], 'mary', users);
```

And of course, these modifications are immutable, but they share unmodified branches:

```js
console.log(newUsers1 !== users);
// true
console.log(newUsers1.mary === users.mary);
// true
```

Changing something to its current value is a no-op:

```js
const newUsers = setIn(['mary', 'name', 'first'], 'Mary', users);
console.log(newUsers === users);
// true
```

Okay, now let's make things more interesting. Let's increase everyone's balance by 10.

```js
import {$eachValue} from 'qim';

const newUsers = updateIn([$eachValue, 'balance'], bal => bal + 10);
```

Each part of the path in `qim` functions is actually a "navigator". Strings navigate to keys. `$eachValue` is a
navigator that navigates to each value of an array or object. Kind of like `mapValues` from `lodash`, but navigators in
`qim` are only worried about what they navigate to, never about anything they don't navigate to. Let's see what that
means.

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
const newUsers = updateIn([$eachValue, 'balance', bal => bal >= 500], bal => bal + 10, users);
```

Here we introduce a predicate selector. Any function that appears in a path acts as a filter, and we only continue
navigating if the predicate passes. But we don't have to worry about the unfiltered users. Those remain unchanged. And
we only have to worry about the `balance` property. Other properties are also unchanged.

These navigators are useful for selecting data too.

```js
import {selectIn} from 'qim';

const names = selectIn([$eachValue, 'name', 'first'], users);
// ['Joe', 'Mary']
```

Let's get a little more fancy. Let's grab all the first names of people that have high balances.

```js
import {hasIn} from 'qim';

// All functions are curried, so you can leave off the data to get a function.
const hasHighBalance = hasIn(['balance', bal => bal >= 500]);

const names = selectIn([$eachValue, hasHighBalance, 'name', 'first']);
// ['Mary']
```

`hasIn` checks if a selection returns anything. We use currying to create a function for checking if a user's balance
is high, and we use that as a predicate to select first names of users with a high balance.

Cool, huh?

## Thanks

The whole "navigator" idea is borrowed from https://github.com/nathanmarz/specter.
