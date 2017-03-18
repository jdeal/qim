import Benchmark from 'benchmark';
import _ from 'lodash';

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
// console.log(
//   updateIn(['users', $eachValue], [
//     set('balance', 0),
//     set('prizes', [])
//     // updateIn(['name', 'first'], toUpperCase),
//     // updateIn([hasIn(['balance', isBalanceHigh]), 'prizes'], push('bear')),
//     // updateIn(['balance', isBalanceLow], punishBalance)
//   ], state)
// );
//
// process.exit();

// 98,342
//
// 172,437
//

const value = {x: 1, y: 2};

_.range(100).forEach((key) => {
  //value[`_${key}`] = key;
  Object.keys(state.users).forEach(key => {
    state.users[key][key] = key;
  });
});

//console.log(value)



// const mutator = createMutator(value);
//
// //mutator.set('x', 2);
// //mutator.set('y', 3);
//
// set('x', 2, mutator);
// set('y', 3, mutator);
//
// console.log(mutator.value());
// //console.log(value);
//
// process.exit();
//


//console.log(set['@@qim/canMutate']);

    // updateIn(['users', $eachValue], [
    //   set('balance', 0),
    //   set('prizes', []),
    //   // set('balance', 1),
    //   // set('prizes', ['foo'])
    //   // updateIn(['name', 'first'], toUpperCase),
    //   // updateIn([hasIn(['balance', isBalanceHigh]), 'prizes'], push('bear')),
    //   // updateIn(['balance', isBalanceLow], punishBalance)
    // ], state)
    //
    // process.exit();

suite
  // .add('mutable', () => {
  //   const mutator = createMutator(value);
  //
  //   set('x', 2, mutator);
  //   set('y', 3, mutator);
  //   //set('z', 3, mutator);
  //   const newValue = mutator.value();
  // })
  // .add('immutable', () => {
  //   let newValue = value;
  //   newValue = set('x', 2, newValue);
  //   newValue = set('y', 3, newValue);
  //   //newValue = set('z', 4, newValue);
  // })
  .add('updateIn', () =>
    updateIn(['users', $eachValue], [
      set('balance', 0),
      set('prizes', []),
      // set('balance', 1),
      // set('prizes', ['foo'])
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
