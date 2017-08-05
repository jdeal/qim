import _ from 'lodash';

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const object = _.fromPairs(_.flatten(
  letters.map(letter1 => letters.map(
    letter2 => [`${letter1}${letter2}`, `${letter1}${letter2}`]
  ))
));

const copyAndDelete = (key, obj) => {
  const newObject = Object.assign({}, obj);
  delete newObject[key];
  return newObject;
};

const copyWithout = (key, obj) => {
  const newObject = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    if (key !== currentKey) {
      newObject[currentKey] = object[currentKey];
    }
  }
  return newObject;
};

export default [
  {
    name: 'copyAndDelete',
    test: () => (
      copyAndDelete('aa', object)
    )
  },
  {
    name: 'copyWithout',
    test: () => (
      copyWithout('aa', object)
    )
  }
];
