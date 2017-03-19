import Benchmark from 'benchmark';
import _ from 'lodash';

import {curry3, curryNot3} from '../src/utils/curry';

const suite = new Benchmark.Suite();

const getOr = (defaultValue, key, obj) => {
  if (arguments.length < 3) {
    return curryNot3(getOr, arguments, defaultValue, key);
  }
  const value = obj[key];
  if (typeof value === 'undefined') {
    return defaultValue;
  }
  return value;
};

const fnGet = key => obj => getOr(undefined, key, obj);

const getOr_lc = _.curry(getOr);
const get_lc = getOr_lc(undefined);

const getOr_cc = curry3(getOr);
const get_cc = getOr_cc(undefined);

const getOr_ic = function (defaultValue, key, obj) {
  switch (arguments.length) {
  case 3: {
    const value = obj[key];
    if (typeof value === 'undefined') {
      return defaultValue;
    }
    return value;
  }
  default:
    return curryNot3(getOr_ic, arguments, defaultValue, key);
  }
};

const get_ic = getOr_ic(undefined);

const state = {
  users: {
    joe: {
      name: {
        first: 'Joe'
      }
    }
  }
};

const noCurry = (fn) => fn(undefined, 'first',
  fn(undefined, 'name',
    fn(undefined, 'joe',
      fn(undefined, 'users', state)
    )
  )
);

const withFlow = (fn) => _.flow(
  fn('users'),
  fn('joe'),
  fn('name'),
  fn('first')
)(state);

// const thread = (...calls) => value => _.reduce(calls,
//   (result, call) => call[0](...call.slice(1), result)
// , value);

const thread = function () {
  return value => {
    let result = value;
    for (let i = 0; i < arguments.length; i++) {
      const call = arguments[i];
      result = call[0](...call.slice(1), result);
    }
    return result;
  };
};

// console.log(
//   thread(
//     [getOr, undefined, 'users'],
//     [getOr, undefined, 'joe'],
//     [getOr, undefined, 'name'],
//     [getOr, undefined, 'first'],
//   )(state)
// )

// process.exit();

suite
  .add('no curry', () => noCurry(getOr))
  //.add('lodash no curry', () => noCurry(getOr_lc))
  .add('custom no curry', () => noCurry(getOr_cc))
  .add('inner no curry', () => noCurry(getOr_ic))
  //.add('manual curry', () => withFlow(fnGet))
  //.add('lodash curry', () => withFlow(get_lc))
  // .add('custom curry', () => withFlow(get_cc))
  // .add('inner curry', () => withFlow(get_ic))
  // .add('thread', () => thread(
  //   [getOr, undefined, 'users'],
  //   [getOr, undefined, 'joe'],
  //   [getOr, undefined, 'name'],
  //   [getOr, undefined, 'first']
  // )(state))
  .on('complete', function() {
    //console.log(this);
    console.log(this.map(bench => {
      return bench.name + '\n' + Number(Math.round(bench.hz)).toLocaleString();
    }).join('\n\n'));
  })
  // run async
  .run({ 'async': true });
