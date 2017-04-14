import updateHelper from 'immutability-helper';

import {update, $slice, $set} from '../src';

const input = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

const simpleSplice = (array, begin, count, ...items) => {
  const newArray = array.slice(0);
  newArray.splice(begin, count, ...items);
  return newArray;
};

export default [
  {
    name: 'simple splice',
    test: () => {
      return simpleSplice(input, 0, 2, 'x', 'y');
    },
    key: 'splice'
  },
  {
    name: 'immutability-helper',
    test: () => (
      updateHelper(input, {$splice: [[0, 2, 'x', 'y']]})
    )
  },
  {
    name: 'qim slice',
    test: () => (
      update([$slice(0, 2), $set(['x', 'y'])], input)
    ),
    compare: {
      splice: .50
    }
  }
];
