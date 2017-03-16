import {selectIn, setIn, updateIn, hasIn, push, $eachValue} from './src';

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

const print = (obj) => console.log(JSON.stringify(obj, null, 2));

// print(
//   setIn(['users', 'joe', 'name', 'first'], 'Joseph', state)
// );
//
// print(
//   updateIn(['users', 'joe', 'name', 'first'], toUpperCase, state)
// );

// const isBalanceLow = (balance) => balance < 100;
// const isBalanceHigh = (balance) => balance > 1000;
// const punishBalance = (balance) => balance - 10;

// print(
//   updateIn(['users', $eachValue], [
//     updateIn(['name', 'first'], toUpperCase),
//     updateIn([hasIn(['balance', isBalanceHigh]), 'prizes'], push('bear')),
//     updateIn(['balance', isBalanceLow], punishBalance)
//   ], state)
// );
