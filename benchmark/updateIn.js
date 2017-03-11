import Benchmark from 'benchmark';

const suite = new Benchmark.Suite();

import updateIn from '../src/updateIn';
import hasIn from '../src/hasIn';
import push from '../src/push';
import set from '../src/set';
import $eachValue from '../src/navigators/$eachValue';
const toUpperCase = s => s.toUpperCase();

const state = {
  users: {
    joe: {
      name: {
        first: 'Joe'
      },
      balance: 50,
      prizes: []
    },
    mary: {
      name: {
        first: 'Mary'
      },
      balance: 2000,
      prizes: []
    }
  }
};

const name = {
  first: 'Joe',
  last: 'Foo',

};

const isBalanceLow = (balance) => balance < 100;
const isBalanceHigh = (balance) => balance > 1000;
const punishBalance = (balance) => balance - 10;

// console.log(
//   JSON.stringify(
//     updateIn(['users', $eachValue], [
//       updateIn(['name', 'first'], toUpperCase),
//       updateIn([hasIn(['balance', isBalanceHigh]), 'prizes'], push('bear')),
//       updateIn(['balance', isBalanceLow], punishBalance)
//     ], state)
//   , null, 2)
// );
//
// process.exit();

// 98,342
//
// 172,437

suite
  .add('updateIn', () =>
    updateIn(['users', $eachValue], [
      set('balance', 0),
      set('prizes', [])
      // updateIn(['name', 'first'], toUpperCase),
      // updateIn([hasIn(['balance', isBalanceHigh]), 'prizes'], push('bear')),
      // updateIn(['balance', isBalanceLow], punishBalance)
    ], state)
  )
  .on('complete', function() {
    //console.log(this);
    console.log(this.map(bench => {
      return bench.name + '\n' + Number(Math.round(bench.hz)).toLocaleString();
    }).join('\n\n'));
  })
  // run async
  .run({ 'async': true });
