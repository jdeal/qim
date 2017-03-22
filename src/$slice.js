import createNavigator from './createNavigator';
import {navigatorRef} from './createNavigator';

const _$slice = createNavigator({
  select: (nav, object, next) => {
    if (Array.isArray(object)) {
      return next(object.slice(nav[2], nav[3]));
    }
    throw new Error('$slice only works on array.');
  },
  update: (nav, object, next) => {
    if (Array.isArray(object)) {
      const slice = object.slice(nav[2], nav[3]);
      const newSlice = next(slice);
      const newArray = object.slice(0);
      const spliceBegin = typeof nav[2] === 'undefined' ? 0 : nav[2];
      newArray.splice(spliceBegin, slice.length, ...newSlice);
      return newArray;
    }
    throw new Error('$slice only works on array.');
  }
});

const $slice = (begin, end) => [navigatorRef, _$slice, begin, end];

export default $slice;
