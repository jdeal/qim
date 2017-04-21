import _ from 'lodash';

import {find} from '../src';

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
    name: 'qim find',
    test: () => find(['users', 'joe', 'name', 'first'], state),
    compare: {
      lodashGet: .80
    }
  }
];
