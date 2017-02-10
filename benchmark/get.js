import Benchmark from 'benchmark';
import _ from 'lodash';
import fp from 'lodash/fp';

const suite = new Benchmark.Suite();

import select, {selectInline, createSelectFn} from '../src/select';
import getIn from '../src/methods/getIn';

const state = {
  users: {
    joe: {
      name: {
        first: 'Joe'
      }
    }
  }
};

const safeGet = (obj, fn) => {
  try {
    return fn(obj);
  } catch (e) {
    return undefined;
  }
};

const selectFirstName = createSelectFn(['users', 'joe', 'name', 'first']);

suite
  // .add('native', () => {
  //   const result = state.users.joe.name.first;
  // })
  // .add('safe', () => {
  //   const result = safeGet(state, o => o.users.joe.name.first);
  // })
  .add('lodash array', () => {
    const result = _.get(state, ['users', 'joe', 'name', 'first']);
  })
  // .add('lodash string', () => {
  //   const result = _.get(state, 'users.joe.name.first');
  // })
  // .add('lodash manual split', () => {
  //   const path = 'users.joe.name.first'.split('.');
  //   const result = _.get(state, path);
  // })
  .add('getIn', () => {
    const result = getIn(state, ['users', 'joe', 'name', 'first']);
  })
  .add('select inline', () => {
    const result = selectInline(['users', 'joe', 'name', 'first'], state);
  })
  .add('select', () => {
    const result = select(['users', 'joe', 'name', 'first'], state);
  })
  .add('select cached', () => {
    const result = selectFirstName(state);
  })
  .on('complete', function() {
    //console.log(this);
    console.log(this.map(bench => {
      return bench.name + '\n' + Number(Math.round(bench.hz)).toLocaleString();
    }).join('\n\n'));
  })
  // run async
  .run({ 'async': true });
