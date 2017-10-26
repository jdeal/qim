import fp from 'lodash/fp';
import R from 'ramda';
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
    name: 'lodash update',
    test: () => (
      fp.update('users', fp.mapValues(
        user => {
          if (user.balance < 500) {
            return user;
          }
          return {
            ...user,
            balance: user.balance + 10
          };
        }
      ), state)
    )
  },
  {
    name: 'Ramda update',
    test: () => (
      R.over(R.lensProp('users'), R.map(
        user => {
          if (user.balance < 500) {
            return user;
          }
          return {
            ...user,
            balance: user.balance + 10
          };
        }
      ), state)
    ),
    key: 'ramdaUpdate'
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
      ramdaUpdate: 1.3
    }
  }
];
