import {update, $set} from '../src';

const state = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('')
  .reduce((result, key) => {
    result[key] = 0;
    return result;
  }, {});

export default [
  {
    name: 'Object.assign',
    test: () => (
      Object.assign({}, state, {
        x: 1,
        y: 2,
        z: 3
      })
    ),
    key: 'assign'
  },
  // This is comparable because of the mutable wrapper.
  {
    name: 'qim update',
    test: () => (
      update([
        ['x', $set(1)],
        ['y', $set(2)],
        ['z', $set(3)]
      ], state)
    ),
    compare: {
      assign: .70
    }
  }
];
