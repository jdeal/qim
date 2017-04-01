import fp from 'lodash/fp';
import updateHelper from 'immutability-helper';

import {set, update, $set} from '../src';

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

const print = obj => JSON.stringify(obj, null, 2);

console.log(print(set(['users', 'joe', 'name', 'first'], 'Joseph', state)))

console.log(print(update(['users', 'joe', 'name', 'first', $set('Joseph')], state)))

export default [
  // {
  //   name: 'lodash fp set',
  //   test: () => (
  //     fp.set(['users', 'joe', 'name', 'first'], 'Joseph', state)
  //   ),
  //   key: 'lodashFpSet'
  // },
  // {
  //   name: 'immutability-helper',
  //   test: () => (
  //     updateHelper(state, {
  //       users: {
  //         joe: {
  //           name: {
  //             first: {$set: 'Joseph'}
  //           }
  //         }
  //       }
  //     })
  //   ),
  //   key: 'immutabilityHelper'
  // },
  // {
  //   name: 'fp set',
  //   test: () => fp.set('users', 'foo', state)
  // },
  // {
  //   name: 'qim set',
  //   test: () => set('users', 'foo', state)
  // },
  // {
  //   name: 'native set',
  //   test: () => ({...state, users: 'foo'})
  // },
  // {
  //   name: 'qim update set',
  //   test: () => update(['users', $set('foo')], state)
  // },
  {
    name: 'qim set',
    test: () => set(['users', 'joe', 'name', 'first'], 'Joseph', state),
    // compare: {
    //   lodashFpSet: 3
    // }
  },
  {
    name: 'qim _update',
    test: () => update(['users', 'joe', 'name', 'first', $set('Joseph')], state),
    // compare: {
    //   lodashFpSet: 3
    // }
  }
];
