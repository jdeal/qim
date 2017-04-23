import createNavigator from './createNavigator';
import getTypeErrorMessage from './utils/getTypeErrorMessage';

const $end = createNavigator({
  select: (nav, object, next) => {
    if (Array.isArray(object)) {
      return next([]);
    }
    throw new Error(getTypeErrorMessage('$end', 'array', object));
  },
  update: (nav, object, next) => {
    if (Array.isArray(object)) {
      const endArray = next([]);
      if (endArray && endArray.length === 0) {
        return object;
      }
      return object.concat(endArray);
    }
    throw new Error(getTypeErrorMessage('$end', 'array', object));
  }
});

export default $end;
