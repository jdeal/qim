import {update, $merge} from '../src';

const object = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('')
  .reduce((result, char) => {
    result[char] = true;
    return result;
  }, {});

export default [
  {
    name: 'Object.assign',
    test: () => Object.assign({}, object, {x: 1, y: 1, z: 1}),
    key: 'assign'
  },
  {
    name: 'qim merge',
    test: () => update([$merge({x: 1, y: 1, z: 1})], object),
    compare: {
      assign: .75
    }
  }
];
