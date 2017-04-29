import createNavigator from './createNavigator';
import isNextNavigatorConstant from './utils/isNextNavigatorConstant';
import getTypeErrorMessage from './utils/getTypeErrorMessage';

const $slice = createNavigator(true, {
  select: (params, object, next) => {
    if (object && typeof object.slice === 'function') {
      return next(object.slice(params[0], params[1]));
    }
    throw new Error(getTypeErrorMessage('$slice', 'array', object));
  },
  update: (params, object, next, path, index) => {
    if (object && typeof object.slice === 'function') {
      const newArray = object.slice(0);
      const spliceBegin = typeof params[0] === 'undefined' ? 0 : params[0];
      if (isNextNavigatorConstant(path, index)) {
        const newSlice = next();
        newArray.splice(spliceBegin, params[1] - params[0], ...newSlice);
      } else {
        const slice = object.slice(params[0], params[1]);
        const newSlice = next(slice);
        newArray.splice(spliceBegin, slice.length, ...newSlice);
      }
      return newArray;
    }
    throw new Error(getTypeErrorMessage('$slice', 'array', object));
  }
},
  (nav) => (begin, end) => ({'@@qim/nav': nav, begin, end})
);

export default $slice;
