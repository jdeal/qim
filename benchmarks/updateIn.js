import _ from 'lodash';

import {updateIn, $eachValue} from '../src';

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

export default [
  {
    name: 'lodash mapValues',
    test: () => (
      _.mapValues(users,
        user => {
          if (user.balance < 500) {
            return user;
          }
          return {
            ...user,
            balance: user.balance + 10
          };
        }
      )
    ),
    key: 'lodashMapValues'
  },
  {
    name: 'qim updateIn',
    test: () => updateIn([$eachValue, 'balance', bal => bal >= 500], bal => bal + 10, users),
    compare: {
      lodashMapValues: .5
    }
  }
];
