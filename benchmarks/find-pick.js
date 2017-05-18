import _ from 'lodash';

import {find, $pick} from '../src';

const object = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('')
  .reduce((result, char) => {
    result[char] = true;
    return result;
  }, {});

export default [
  {
    name: 'lodash pick',
    test: () => _.pick(object, 'a', ['b', 'c']),
    key: 'lodashPick'
  },
  {
    name: 'qim pick',
    test: () => (
      find([$pick('a', ['b', 'c'])], object)
    ),
    compare: {
      lodashPick: 1.0
    }
  }
];
