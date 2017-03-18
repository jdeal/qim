import objectAssign from 'object-assign';

import createNavigator from './createNavigator';
import reduceSequence from './utils/reduceSequence';

const $eachValue = createNavigator({
  select: (nav, object, next) => {
    return reduceSequence((result, key) => {
      return next(object[key]);
    }, undefined, object);
  },
  update: (nav, object, next) => {
    const isArray = Array.isArray(object);
    return reduceSequence((result, key) => {
      const newValue = next(object[key]);
      if (newValue !== object[key]) {
        if (object === result) {
          if (isArray) {
            result = result.slice(0);
          } else {
            result = objectAssign({}, result);
          }
        }
        result[key] = newValue;
      }
      return result;
    }, object, object);
  }
});

export default $eachValue;
