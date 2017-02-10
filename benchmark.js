import Benchmark from 'benchmark';
import _ from 'lodash';
import fp from 'lodash/fp';

import update from './external/update';
import createMutable from './src/createMutable';
import setIn from './src/methods/setIn';
import fpSetIn from './src/fp-methods/setIn';
import transform from './src/transform';

const suite = new Benchmark.Suite();

import select, {selectInline, createSelectFn} from './src/select';

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

const stateCopy = _.cloneDeep(state);
const stateCopyForLodash = _.cloneDeep(state);

const wrappedSetIn = (path, value, data) => {
  return setIn(data, path, value);
};

suite
  .add('native mutation', () => {
    stateCopy.users.joe.name.first = 'Joseph';
  })
  // .add('spread', () => {
  //   const newState = {
  //     ...state,
  //     users: {
  //       ...state.users,
  //       joe: {
  //         ...state.users.joe,
  //         name: {
  //           ...state.users.joe.name,
  //           first: 'Joseph'
  //         }
  //       }
  //     }
  //   }
  // })
  // .add('update', () => {
  //   const newState = update(state, {
  //     users: {
  //       joe: {
  //         name: {
  //           first: 'Joseph'
  //         }
  //       }
  //     }
  //   });
  // })
  // .add('lodash mutating set', () => {
  //   _.set(stateCopyForLodash, ['users', 'joe', 'name', 'first'], 'Joseph');
  // })
  .add('lodash set', () => {
    const newState = fp.set(['users', 'joe', 'name', 'first'], 'Joseph', state);
  })
  .add('mutable', () => {
    const m = createMutable(state);
    //m.get('users').get('joe').get('name').set('first', 'Joseph');
    m.setIn(['users', 'joe', 'name', 'first'], 'Joseph');
    m.setIn(['users', 'joe', 'name', 'first'], 'JoeBob');
    m.setIn(['users', 'joe', 'name', 'first'], 'Joseph');
    const newState = m.value();
  })
  .add('setIn', () => {
    const newState = setIn(state, ['users', 'joe', 'name', 'first'], 'Joseph');
    const newerState = setIn(newState, ['users', 'joe', 'name', 'first'], 'JoeBob');
    const evenNewerState = setIn(newerState, ['users', 'joe', 'name', 'first'], 'Joseph');
  })
  // .add('setIn', () => {
  //   const newState = wrappedSetIn(['users', 'joe', 'name', 'first'], 'Joseph', state);
  // })
  // .add('fpSetIn', () => {
  //   const newState = fpSetIn(['users', 'joe', 'name', 'first'], 'Joseph', state);
  // })
  // .add('transform', () => {
  //   const newState = transform(state, ['users', 'joe', 'name', 'first'], 'Joseph');
  // })
  // .add('native', () => {
  //   const result = state.users.joe.name.first;
  // })
  // .add('safe', () => {
  //   const result = safeGet(state, o => o.users.joe.name.first);
  // })
  // .add('lodash array', () => {
  //   const result = _.get(state, ['users', 'joe', 'name', 'first']);
  // })
  // .add('lodash string', () => {
  //   const result = _.get(state, 'users.joe.name.first');
  // })
  // .add('lodash manual split', () => {
  //   const path = 'users.joe.name.first'.split('.');
  //   const result = _.get(state, path);
  // })
  // .add('select inline', () => {
  //   const result = selectInline(['users', 'joe', 'name', 'first'], state);
  // })
  // .add('select', () => {
  //   const result = select(['users', 'joe', 'name', 'first'], state);
  // })
  // .add('select cached', () => {
  //   const result = selectFirstName(state);
  // })
  .on('complete', function() {
    //console.log(this);
    console.log(this.map(bench => {
      return bench.name + '\n' + Math.round(bench.hz)
    }).join('\n\n'));
  })
  // run async
  .run({ 'async': true });
