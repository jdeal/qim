import objectAssign from 'object-assign';

import createNavigator from '../createNavigator';

const $values = createNavigator({
  select: (nav, object, path, pathIndex, next) => {
    const values = Object.keys(object).map(key => object[key]);
    const results = values.map(item => next(path, item, pathIndex + 1));
    return results.reduce((a, b) => a.concat(b), []);
  },
  transform: (nav, object, path, pathIndex, next) => {
    if (!object || typeof object !== 'object') {
      return next(path, object, pathIndex + 1);
    }
    const isArray = Array.isArray(object);
    return Object.keys(object).reduce((result, key) => {
      const newValue = next(path, object[key], pathIndex + 1);
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
    }, object);
  }
});

export default $values;
