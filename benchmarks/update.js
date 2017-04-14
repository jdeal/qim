import fp from 'lodash/fp';

import {update, $eachValue, $apply} from '../src';

const state = {
  users: {
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
  }
};

export default [
  {
    name: 'lodash mapValues',
    test: () => (
      fp.update('users', users => fp.mapValues(
        user => {
          if (user.balance < 500) {
            return user;
          }
          return {
            ...user,
            balance: user.balance + 10
          };
        },
        users
      ), state)
    ),
    key: 'lodashMapValues'
  },
  {
    name: 'qim update',
    test: () => update(['users', $eachValue, user => user.balance >= 500, 'balance', $apply(bal => bal + 10)], state),
    compare: {
      lodashMapValues: .5
    }
  }
];
