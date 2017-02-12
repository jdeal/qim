import objectAssign from 'object-assign';

import createNavigator from '../createNavigator';

const $keys = createNavigator({
  transform: (nav, object, path, pathIndex, next) => {
    if (!object || typeof object !== 'object') {
      object = [object];
    }
    const isArray = Array.isArray(object);
    return Object.keys(object).reduce((result, key) => {
      const newKey = next(path, key, pathIndex + 1);
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
    }, object);
  }
});

export default $keys;
