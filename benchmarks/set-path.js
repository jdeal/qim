import fp from 'lodash/fp';
import R from 'ramda';
import updateHelper from 'immutability-helper';
import Immutable from 'immutable';

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

const immutableState = Immutable.fromJS(state);

export default [
  {
    name: 'lodash fp set',
    test: () => (
      fp.set(['users', 'joe', 'name', 'first'], 'Joseph', state)
    )
  },
  {
    name: 'Ramda set',
    test: () => (
      R.assocPath(['users', 'joe', 'name', 'first'], 'Joseph', state)
    ),
    key: 'ramdaSet'
  },
  {
    name: 'Immutable set',
    test: () => (
      immutableState.setIn(['users', 'joe', 'name', 'first'], 'Joseph')
    ),
    coerce: value => value.toJS()
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
      ramdaSet: .35
    }
  }
];
