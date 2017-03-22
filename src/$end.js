import createNavigator from './createNavigator';

const $end = createNavigator({
  select: (nav, object, next) => {
    if (Array.isArray(object)) {
      return next([]);
    }
    throw new Error('$end only works on array.');
  },
  update: (nav, object, next) => {
    if (Array.isArray(object)) {
      const endArray = next([]);
      if (endArray && endArray.length === 0) {
        return object;
      }
      return object.concat(endArray);
    }
    throw new Error('$end only works on array.');
  }
});

export default $end;
