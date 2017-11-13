import _ from 'lodash';

import {wrap} from '../src/utils/data';

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const data = _.fromPairs(_.flatten(
  letters.map(letter1 => letters.map(
    letter2 => [`${letter1}${letter2}`, `${letter1}${letter2}`]
  ))
));

const getProperty = (key, object) => object[key];

const recycledWrapper = wrap({});
recycledWrapper.set('x', 1);

const getPropertyWithRecyle = (key, object) => {
  recycledWrapper._source = object;
  return recycledWrapper.get(key);
};

export default [
  {
    name: 'baseline',
    test: () => (
      getProperty('az', data)
    )
  },
  {
    name: 'wrapper',
    test: () => (
      wrap(data).get('az')
    )
  },
  {
    name: 'recycle wrapper',
    test: () => (
      getPropertyWithRecyle('az', data)
    )
  }
];
