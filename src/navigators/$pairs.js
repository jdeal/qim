import objectAssign from 'object-assign';

import createNavigator from '../createNavigator';

const $pairs = createNavigator({
  transform: (nav, object, path, pathIndex, next) => {
    if (!object || typeof object !== 'object') {
      object = [object];
    }
    const isArray = Array.isArray(object);
    return Object.keys(object).reduce((result, key) => {
      const value = object[key];
      const pair = [key, value];
      const maybeNewPair = next(path, pair, pathIndex + 1);
      const newPair = (!maybeNewPair || typeof maybeNewPair !== 'object') ?
        [] :
        maybeNewPair;
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
    }, object);
  }
});

export default $pairs;
