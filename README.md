# qim

Functional style immutability for plain JS with special query sauce.

## What?

Think lodash/fp or Ramda but:

- Smaller lib focused only on making it simple to select from and update plain JS objects and arrays.
- Makes sure to share structure whenever possible and avoid cloning an object if it doesn't change.
- Special query sauce makes it easy (and reasonably performant) to select from and update multiple paths.

Think Immutable.js but:

- Just helper functions, no new prototype here. Easy to compose with your own functions.
- Your data remains plain JS, so no cognitive or performance overhead of marshaling data back and forth to compose with other plain JS functions.
- Functions are data last and curried. Again, just to facilitate composition.
- Special query sauce makes it easy (and reasonably performant) to select from and update multiple paths.

Think Facebook's immutability helper but:

- Without the weird `$` properties. More concise path syntax instead.
- Avoids cloning objects that don't change.
- Special query sauce, yada yada.

## Show me

`im` has a bunch of helpers to, uh, help you select or update plain JS objects.

```js
import {set, setIn, pushIn} from 'qim';

const users = {
  mary: {
    name: {
      first: 'Mary',
      last: 'Bar'
    },
    friends: [],
    balance: 1000
  }
};

const users1 = set('joe', {
  name: {
    first: 'Joe',
    last: 'Foo'
  },
  friends: [],
  balance: 100
}, users);

const users2 = setIn(['joe', 'name', 'first'], 'Joseph', users1);

const users3 = pushIn(['joe', 'friends'], 'mary');
```

At this point, you probably know the immutability and structural sharing drill. These are both true:

```js
users1.mary === users3.mary

users1.joe.name !== users3.joe.name
```

If we try to set a value to what it's already set:

```js
const users4 = setIn(['mary', 'name', 'first'], 'Mary', users3);
```

Then nothing changes:

```js
users1.mary === users3.mary
```

This is useful if you have some code that sets default values. You can avoid checking for whether or not the values are set and just go ahead and update them. `im` will check them for you.

## Okay, what about that special sauce?

`im` includes an `updateIn` like you might expect, so you can update a value based on a function, like so:

```js
import {updateIn} from 'qim';

const users5 = updateIn(['joe', 'balance'], bal => bal + 10, users4);

// Joe's balance is now 110.
```

But what if we want to increase everyone's balance by 10? Hmm... traditionally, we'd have to do this instead.

```js
const users5 = Object.keys(users4)
  .map(username => ({
    ...users4[username],
    balance: users4[username].balance + 10
  }))
```

Unfortunately, we have to worry about other properties besides balance. What if we want to boost the balance of only customers with a balance of 1000 or more? Sounds like a filter and a map? Hmm, no, we can't filter, because we'll lose our object. So we have to do something like this:

```js
const users5 = Object.keys(users4)
  .map(username => {
    const user = users4[username];
    if (user.balance < 1000) {
      return user;
    }
    return {
      ...user,
      balance: user.balance + 10
    };
  });
```

Hmm, that's getting kind of ugly. We have to concern ourselves with other properties we don't care about and also other users we don't care about. Let's use `im`'s special query sauce instead.

```js
import {$eachValue} from 'qim';

const users5 = updateIn([$eachValue, 'balance', bal => bal >= 1000], bal => bal + 10, users4);
```

Whoa, what's going on there? Let's spread that out to explain:

```js
const users5 = updateIn([
  $eachValue,          // This is a "navigator", and this one says to apply the rest of this query to each value.
  'balance'            // Navigate into the `'balance'` key.
  bal => bal >= 1000,  // This is a predicate which says to only keep going if balance >= 1000.
],
  bal => bal + 10,     // Update the balance by 10. This only applies to the balances we actually navigated to.
  users4
);
```
