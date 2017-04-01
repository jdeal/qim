import _ from 'lodash';

import {update, $eachValue, $if} from '../src';

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
      _.update(state, 'users', users => _.mapValues(users,
        user => {
          if (user.balance < 500) {
            return user;
          }
          return {
            ...user,
            balance: user.balance + 10
          };
        }
      ))
    ),
    key: 'lodashMapValues'
  },
  {
    name: 'qim _update',
    test: () => update(['users', $eachValue, 'balance', $if(bal => bal >= 500), bal => bal + 10], state),
    compare: {
      lodashMapValues: .5
    }
  }
];
