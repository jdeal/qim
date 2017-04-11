import createNavigator from './createNavigator';

const _$slice = createNavigator({
  select: (nav, object, next) => {
    if (Array.isArray(object)) {
      return next(object.slice(nav.begin, nav.end));
    }
    throw new Error('$slice only works on array.');
  },
  update: (nav, object, next) => {
    if (Array.isArray(object)) {
      const slice = object.slice(nav.begin, nav.end);
      const newSlice = next(slice);
      const newArray = object.slice(0);
      const spliceBegin = typeof nav.begin === 'undefined' ? 0 : nav.begin;
      newArray.splice(spliceBegin, slice.length, ...newSlice);
      return newArray;
    }
    throw new Error('$slice only works on array.');
  }
});

const $slice = (begin, end) => ({'@@qim/nav': _$slice, begin, end});

export default $slice;
