import objectAssign from 'object-assign';

export default {
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
