import objectAssign from 'object-assign';

import createNavigator from './createNavigator';
import reduceSequence from './utils/reduceSequence';

const $eachKey = createNavigator({
  select: (nav, object, next) => {
    return reduceSequence((result, key) => {
      return next(key);
    }, undefined, object);
  },
  update: (nav, object, next) => {
    const isArray = Array.isArray(object);
    return reduceSequence((result, key) => {
      const newKey = next(key);
      if (newKey !== key) {
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
        result[newKey] = object[key];
      }
      return result;
    }, object, object);
  }
});

export default $eachKey;
