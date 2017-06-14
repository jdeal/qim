import fp from 'lodash/fp';
import R from 'ramda';

import {update, $each, $apply} from '../src';

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

export default [
  {
    name: 'native',
    test: () => (
      {
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
      }
    ),
    key: 'native'
  },
  {
    name: 'lodash/fp update',
    test: () => (
      fp.update('users', fp.mapValues(
        fp.update(['name', 'first'], firstName => firstName.toUpperCase())
      ), state)
    )
  },
  {
    name: 'Ramda update',
    test: () => (
      R.over(R.lensProp('users'), R.map(
        R.over(R.lensPath(['name', 'first']), firstName => firstName.toUpperCase())
      ), state)
    )
  },
  {
    name: 'qim update',
    test: () => update(['users', $each, 'name', 'first', $apply(firstName => firstName.toUpperCase())], state),
    compare: {
      native: .5
    }
  }
];
