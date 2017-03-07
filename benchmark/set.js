import Benchmark from 'benchmark';
import fp from 'lodash/fp';

const suite = new Benchmark.Suite();

import setIn from '../src/setIn';
import updateIn from '../src/updateIn';

const state = {
  users: {
    joe: {
      name: {
        first: 'Joe'
      }
    }
  }
};

//process.exit();

suite
  .add('lodash set', () =>
    fp.set(['users', 'joe', 'name', 'first'], 'Joe', state)
  )
  .add('setIn', () =>
    setIn(['users', 'joe', 'name', 'first'], 'Joe', state)
  )
  .add('updateIn', () =>
    updateIn(['users', 'joe', 'name', 'first'], () => 'Joe', state)
  )
  .on('complete', function() {
    //console.log(this);
    console.log(this.map(bench => {
      return bench.name + '\n' + Number(Math.round(bench.hz)).toLocaleString();
    }).join('\n\n'));
  })
  // run async
  .run({ 'async': true });
