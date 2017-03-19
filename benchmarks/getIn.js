import _ from 'lodash';

import {getIn} from '../src';

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
    name: 'qim getIn',
    test: () => getIn(['users', 'joe', 'name', 'first'], state),
    compare: {
      lodashGet: .9
    }
  }
];
