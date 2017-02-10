import createSelector from './createSelector';

// export const $value = (value) => {
//   return createSelector({
//     transform: (key, object, next, path) => {
//       return value;
//     }
//   });
// };

const __$value = createSelector({
  transform: (selector, object, next, path) => {
    return selector[1];
  }
});

export const $value = (value) => {
  return [__$value, value];
};

/*
import objectAssign from 'object-assign';

export const $values = {
  select: (object, remaining, select) => {
    const values = Object.keys(object).map(key => object[key]);
    const results = values.map(item => select(remaining, item));
    return results.reduce((a, b) => a.concat(b), []);
  },
  transform: (object, remaining, update, transform) => {
    if (!object || typeof object !== 'object') {
      object = [object];
    }
    const isArray = Array.isArray(object);
    return Object.keys(object).reduce((result, key) => {
      const newValue = transform(remaining, update, object[key]);
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
};
*/
