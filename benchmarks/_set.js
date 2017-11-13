import _ from 'lodash';

import {wrap} from '../src/utils/data';

// const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
//
// const data = _.fromPairs(_.flatten(
//   letters.map(letter1 => letters.map(
//     letter2 => [`${letter1}${letter2}`, `${letter1}${letter2}`]
//   ))
// ));

const data = {a: 1, b: 2, c: 3};

const setProperty = (key, value, object) => {
  if (object[key] === value) {
    return object;
  }
  const newObject = Object.assign({}, object);
  newObject[key] = value;
  return newObject;
};

const recycledWrapper = wrap({});
recycledWrapper.set('x', 1);

const setPropertyWithRecyle = (key, value, object) => {
  recycledWrapper._source = object;
  recycledWrapper._hasMutated = false;
  recycledWrapper.set(key, value);
  return recycledWrapper._source;
};

export default [
  {
    name: 'baseline',
    test: () => (
      setProperty('x', 1, data)
    )
  },
  {
    name: 'wrapper',
    test: () => (
      wrap(data).set('x', 1).value()
    )
  },
  {
    name: 'recycle wrapper',
    test: () => (
      setPropertyWithRecyle('x', 1, data)
    )
  }
];
