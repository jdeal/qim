import selectIn from './src/selectIn';
import getIn from './src/getIn';
import updateIn from './src/updateIn';
import setIn from './src/setIn';
import update from './src/update';
import $eachValue from './src/navigators/$eachValue';
import push from './src/push';
import pushIn from './src/pushIn';
import hasIn from './src/hasIn';

//const state = {name: {first: 'Joe'}};

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

//console.log(getIn(['name', 'first', first => first.length > 5], state));

//console.log(updateIn(['a',() => false,'b'], () => 5, {}));


//console.log(setIn(['users', 'joe', 'name', 'first'], 'Joseph', state));

//console.log(updateIn(['users', 'joe', 'name', 'first'], () => 'Joseph', state))
//


//const same = updateIn(['users', 'joe', 'name', 'first'], () => 'Joe', state)


//console.log(setIn(['users', 'joe', 'name', 'first'], 'Joseph')(state))

//console.log(same === state);

//const isEven = value => value % 2 === 0;

//console.log(selectIn([isEven], 2))
//

const isBalanceLow = (balance) => balance < 100;
const isBalanceHigh = (balance) => balance > 1000;
const punishBalance = (balance) => balance - 10;

console.log(
  JSON.stringify(
    updateIn(['users', $eachValue], [
      updateIn(['name', 'first'], toUpperCase),
      updateIn([hasIn(['balance', isBalanceHigh]), 'prizes'], push('bear')),
      updateIn(['balance', isBalanceLow], punishBalance)
    ], state)
  , null, 2)
);

updateIn(['users', $eachValue], [
  updateIn(['name', 'first'], toUpperCase),
  updateIn([hasIn(['balance', isBalanceHigh]), 'prizes'], push('bear')),
  updateIn(['balance', isBalanceLow], punishBalance)
], state)

update(state, {
  users: $apply(map(user => {
    if (isBalanceHigh(user.balance)) {
      return update(user, {
        prizes: {$push: ['bear']}
      });
    } else if (isBalanceLow(user.balance)){
      return update(user, {
        balance: {$apply: punishBalance}
      });
    }
    return user;
  }))
})

//console.log(push(3, [1,2]))

// console.log(pushIn(['users'], 'bob', {users: ['joe']}))
//
// console.log(updateIn(['users'], push('bob'), {users: ['joe']}))

//console.log(hasIn(['users', 'joe', 'balance', balance => balance > 1000], state))
