import _ from 'lodash';

import {get} from '../src';

const state = {
  users: {
    joe: {
      name: {
        first: 'Joe'
      }
    }
  }
};

export default [
  {
    name: 'lodash get',
    test: () => _.get(state, ['users', 'joe', 'name', 'first']),
    key: 'lodashGet'
  },
  {
    name: 'qim get',
    test: () => get(['users', 'joe', 'name', 'first'], state),
    compare: {
      lodashGet: .85
    }
  }
];
