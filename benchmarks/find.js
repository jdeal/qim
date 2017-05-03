import _ from 'lodash';
import fp from 'lodash/fp';
import Immutable from 'immutable';

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

const immutableState = Immutable.fromJS(state);

const context = {array:[]};

export default [
  {
    name: 'lodash get',
    test: () => _.get(state, ['users', 'joe', 'name', 'first']),
    key: 'lodashGet'
  },
  {
    name: 'lodash-fp get',
    test: () => fp.get(['users', 'joe', 'name', 'first'], state)
  },
  {
    name: 'Immutable get',
    test: () => immutableState.getIn(['users', 'joe', 'name', 'first'])
  },
  {
    name: 'qim find',
    test: () => find(['users', 'joe', 'name', 'first'], state),
    compare: {
      lodashGet: .80
    }
  }
];
