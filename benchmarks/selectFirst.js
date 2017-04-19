import _ from 'lodash';

import {selectFirst} from '../src';

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
    name: 'qim selectFirst',
    test: () => selectFirst(['users', 'joe', 'name', 'first'], state),
    compare: {
      lodashGet: .80
    }
  }
];
