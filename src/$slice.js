import createNavigator from './createNavigator';
import isNextNavigatorConstant from './utils/isNextNavigatorConstant';

const $slice = createNavigator({
  select: (nav, object, next) => {
    if (object && typeof object.slice === 'function') {
      return next(object.slice(nav.begin, nav.end));
    }
    throw new Error('$slice only works on array.');
  },
  update: (nav, object, next, path, index) => {
    if (object && typeof object.slice === 'function') {
      const newArray = object.slice(0);
      const spliceBegin = typeof nav.begin === 'undefined' ? 0 : nav.begin;
      if (isNextNavigatorConstant(path, index)) {
        const newSlice = next();
        newArray.splice(spliceBegin, nav.end - nav.begin, ...newSlice);
      } else {
        const slice = object.slice(nav.begin, nav.end);
        const newSlice = next(slice);
        newArray.splice(spliceBegin, slice.length, ...newSlice);
      }
      return newArray;
    }
    throw new Error('$slice only works on array.');
  }
},
  (nav) => (begin, end) => ({'@@qim/nav': nav, begin, end})
);

export default $slice;
