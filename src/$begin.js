import createNavigator from './createNavigator';

const $begin = createNavigator({
  select: (nav, object, next) => {
    if (Array.isArray(object)) {
      return next([]);
    }
    throw new Error('$begin only works on array.');
  },
  update: (nav, object, next) => {
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
    throw new Error('$begin only works on array.');
  }
});

export default $begin;
