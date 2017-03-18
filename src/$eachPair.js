import objectAssign from 'object-assign';

import createNavigator from './createNavigator';
import reduceSequence from './utils/reduceSequence';

const $eachPair = createNavigator({
  select: (nav, object, next) => {
    return reduceSequence((result, key) => {
      return next([key, object[key]]);
    }, undefined, object);
  },
  update: (nav, object, next) => {
    const isArray = Array.isArray(object);
    return reduceSequence((result, key) => {
      const value = object[key];
      const pair = [key, value];
      const newPair = next(pair);
      if (!newPair) {
        return result;
      }
      if (newPair.length !== 2) {
        throw new Error('pair to update does not look like a pair');
      }
      const newKey = newPair[0];
      const newValue = newPair[1];
      if (newKey !== key || newValue !== value) {
        if (object === result) {
          if (isArray) {
            result = result.slice(0);
          } else {
            result = objectAssign({}, result);
          }
        }
        if (newKey !== key) {
          delete result[key];
        }
        result[newKey] = newValue;
      }
      return result;
    }, object, object);
  }
});

export default $eachPair;
