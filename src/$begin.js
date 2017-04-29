import createNavigator from './createNavigator';
import getTypeErrorMessage from './utils/getTypeErrorMessage';

const $begin = createNavigator({
  select: (object, next) => {
    if (Array.isArray(object)) {
      return next([]);
    }
    throw new Error(getTypeErrorMessage('$begin', 'array', object));
  },
  update: (object, next) => {
    if (Array.isArray(object)) {
      const beginArray = next([]);
      if (beginArray && beginArray.length === 0) {
        return object;
      }
      if (!beginArray || typeof beginArray === 'string' || typeof beginArray.concat !== 'function') {
        return [beginArray].concat(object);
      }
      return beginArray.concat(object);
    }
    throw new Error(getTypeErrorMessage('$begin', 'array', object));
  }
});

export default $begin;
