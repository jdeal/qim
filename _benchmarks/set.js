import Benchmark from 'benchmark';
import fp from 'lodash/fp';

const suite = new Benchmark.Suite();

import set from '../src/set';
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

const name = {
  first: 'Joe',
  last: 'Foo',

};

suite
  .add('flow with set', () => {
    let newName = set('first', 'Joseph', name);
    set('last', 'Foozle', newName);
    set('last', 'Foozle', newName);
    set('last', 'Foozle', newName);
  })
  .add('flow with set', () => {
    let newName = set('first', 'Joseph', name);
    set('last', 'Foozle', newName, true);
    set('last', 'Foozle', newName, true);
    set('last', 'Foozle', newName, true);
  })
/*
  .add('lodash set', () =>
    fp.set(['users', 'joe', 'name', 'first'], 'Joe', state)
  )
  .add('setIn', () =>
    setIn(['users', 'joe', 'name', 'first'], 'Joe', state)
  )
  .add('updateIn', () =>
    updateIn(['users', 'joe', 'name', 'first'], () => 'Joe', state)
  )
*/
  .on('complete', function() {
    //console.log(this);
    console.log(this.map(bench => {
      return bench.name + '\n' + Number(Math.round(bench.hz)).toLocaleString();
    }).join('\n\n'));
  })
  // run async
  .run({ 'async': true });
