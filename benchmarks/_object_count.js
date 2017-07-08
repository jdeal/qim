import _ from 'lodash';

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const object = _.fromPairs(_.flatten(
  letters.map(letter1 => letters.map(
    letter2 => [`${letter1}${letter2}`, `${letter1}${letter2}`]
  ))
));

const keys = Object.keys(object);

export default [
  {
    name: 'Object.keys().length',
    test: () => (
      Object.keys(object).length
    )
  },
  {
    name: 'cached keys.length',
    test: () => (
      keys.length
    )
  },
  {
    name: 'for loop',
    test: () => {
      let count = 0;
      for (let key in object) {
        if (object.hasOwnProperty(key)) {
          count++;
        }
      }
      return count;
    }
  }
];
