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

const getTrue = () => true;

// The truth-returning predicate forces `qim` to leave the optimized primitive
// path loop and use `traverse`. Added the same predicate to the beginning of
// the other benchmarks just to remove the cost of the predicate itself.

export default [
  {
    name: 'lodash get',
    test: () => getTrue() && _.get(state, ['users', 'joe', 'name', 'first']),
    key: 'lodashGet'
  },
  {
    name: 'lodash-fp get',
    test: () => getTrue() && fp.get(['users', 'joe', 'name', 'first'], state)
  },
  {
    name: 'Immutable get',
    test: () => getTrue() && immutableState.getIn(['users', 'joe', 'name', 'first'])
  },
  {
    name: 'qim find',
    test: () => find([getTrue, 'users', 'joe', 'name', 'first'], state),
    compare: {
      lodashGet: .20
    }
  }
];
