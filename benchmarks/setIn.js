import fp from 'lodash/fp';
import update from 'immutability-helper';

import {setIn, _update, $set} from '../src';

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
      update(state, {
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
    name: 'qim setIn',
    test: () => setIn(['users', 'joe', 'name', 'first'], 'Joseph', state),
    compare: {
      lodashFpSet: 3
    }
  },
  {
    name: 'qim _update',
    test: () => _update(['users', 'joe', 'name', 'first', $set('Joseph')], state),
    compare: {
      lodashFpSet: 3
    }
  }
];
