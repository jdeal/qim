import _ from 'lodash';

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const object = _.fromPairs(_.flatten(
  letters.map(letter1 => letters.map(
    letter2 => [`${letter1}${letter2}`, `${letter1}${letter2}`]
  ))
));

export default [
  {
    name: 'Object.keys().map',
    test: () => (
      Object.keys(object).map(key => object[key])
    )
  },
  {
    name: 'for loop',
    test: () => {
      const values = [];
      for (let key in object) {
        if (object.hasOwnProperty(key)) {
          values.push(object[key]);
        }
      }
      return values;
    }
  }
];
