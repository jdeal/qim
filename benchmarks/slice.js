import _ from 'lodash';
import updateHelper from 'immutability-helper';

import {update, $slice, $set} from '../src';

const input = _.range(10)
  .reduce((string) => string.concat('abcdefghijklmnopqrstuvwxyz0123456789'), '')
  .split('');

const arraySize = input.length;

const spliceSize = Math.floor(arraySize / 2);

const simpleSplice = (array, begin, count, ...items) => {
  const newArray = array.slice(0);
  newArray.splice(begin, count, ...items);
  return newArray;
};

export default [
  {
    name: 'simple splice',
    test: () => {
      return simpleSplice(input, 0, spliceSize, 'x', 'y');
    },
    key: 'splice'
  },
  {
    name: 'immutability-helper',
    test: () => (
      updateHelper(input, {$splice: [[0, spliceSize, 'x', 'y']]})
    )
  },
  {
    name: 'qim slice',
    test: () => (
      update([$slice(0, spliceSize), $set(['x', 'y'])], input)
    ),
    compare: {
      splice: .50
    }
  }
];
