import selectIn from './src/selectIn';
import getIn from './src/getIn';
import updateIn from './src/updateIn';
import setIn from './src/setIn';

//const state = {name: {first: 'Joe'}};

const state = {
  users: {
    joe: {
      name: {
        first: 'Joe'
      }
    }
  }
};

//console.log(getIn(['name', 'first', first => first.length > 5], state));

//console.log(updateIn(['a',() => false,'b'], () => 5, {}));


//console.log(setIn(['users', 'joe', 'name', 'first'], 'Joseph', state));

//console.log(updateIn(['users', 'joe', 'name', 'first'], () => 'Joseph', state))
//


const same = updateIn(['users', 'joe', 'name', 'first'], () => 'Joe', state)

console.log(same === state);
