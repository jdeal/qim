import fp from 'lodash/fp';

import {select, $each} from '../src';

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
    test: () => Object.keys(state.users)
      .map(username => state.users[username].name.first),
    key: 'native',
  },
  {
    name: 'lodash/fp flow',
    test: () => fp.flow(
      fp.get('users'),
      fp.map(fp.get(['name', 'first']))
    )(state),
  },
  {
    name: 'qim select',
    test: () => select(['users', $each, 'name', 'first'], state),
    compare: {
      native: .4,
    },
  },
];
