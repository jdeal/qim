import fp from 'lodash/fp';
import Immutable from 'immutable';

import {update, $each, $apply} from '../src';

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

const immutableState = Immutable.fromJS(state);

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
    name: 'Immutable',
    test: () => (
      immutableState.update('users', users => users.map(
        user => {
          if (user.get('balance') < 500) {
            return user;
          }
          return user.update('balance', bal => bal + 10);
        }
      ))
    ),
    coerce: value => value.toJS()
  },
  {
    name: 'qim update',
    test: () => update(['users', $each, user => user.balance >= 500, 'balance', $apply(bal => bal + 10)], state),
    compare: {
      lodashMapValues: 2.5
    }
  }
];
