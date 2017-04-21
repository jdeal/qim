import fp from 'lodash/fp';
import updateHelper from 'immutability-helper';

import {set} from '../src';

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
    name: 'lodash fp set',
    test: () => (
      fp.set(['users', 'joe', 'name', 'first'], 'Joseph', state)
    ),
    key: 'lodashFpSet'
  },
  {
    name: 'immutability-helper',
    test: () => (
      updateHelper(state, {
        users: {
          joe: {
            name: {
              first: {$set: 'Joseph'}
            }
          }
        }
      })
    ),
    key: 'immutabilityHelper'
  },
  {
    name: 'qim set',
    test: () => set(['users', 'joe', 'name', 'first'], 'Joseph', state),
    compare: {
      lodashFpSet: 3
    }
  }
];
