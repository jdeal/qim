import createNavigator from './createNavigator';
import isNextNavigatorConstant from './utils/isNextNavigatorConstant';
import getTypeErrorMessage from './utils/getTypeErrorMessage';

const $slice = createNavigator({
  hasParams: true,
  select: (args, object, next) => {
    if (object && typeof object.slice === 'function') {
      return next(object.slice(args[0], args[1]));
    }
    throw new Error(getTypeErrorMessage('$slice', 'array', object));
  },
  update: (args, object, next, path, index) => {
    // Is it worth avoiding cloning if nothing changes?
    if (object && typeof object.slice === 'function') {
      const newArray = object.slice(0);
      const spliceBegin = typeof args[0] === 'undefined' ? 0 : args[0];
      // We cheat a little and look ahead to see if `next` is going to return
      // a constant. If it is, then there's no reason to get a proper slice of
      // the array, because we know it won't be used anyway.
      if (isNextNavigatorConstant(path, index)) {
        // Call `next` with no args, because it's a constant.
        const newSlice = next();
        // Splice in the new array.
        newArray.splice(spliceBegin, args[1] - args[0], ...newSlice);
      // Otherwise, we do have to slice the array so it can be passed to `next`.
      } else {
        // Create a slice.
        const slice = object.slice(args[0], args[1]);
        // And pass it to `next`.
        const newSlice = next(slice);
        // Splice in the new array.
        newArray.splice(spliceBegin, slice.length, ...newSlice);
      }
      return newArray;
    }
    throw new Error(getTypeErrorMessage('$slice', 'array', object));
  }
});

export default $slice;
