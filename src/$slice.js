import $traverse from './$traverse';
import isNextNavigatorConstant from './utils/isNextNavigatorConstant';
import getTypeErrorMessage from './utils/getTypeErrorMessage';
import normalizeIndex from './utils/normalizeIndex';

const $slice = (begin, end) => $traverse({
  select: (object, next) => {
    if (object && typeof object.slice === 'function') {
      const spliceBegin = normalizeIndex(begin, object.length, 0);
      const spliceEnd = normalizeIndex(end, object.length, object.length);
      return next(object.slice(spliceBegin, spliceEnd));
    }
    throw new Error(getTypeErrorMessage('$slice', 'array', object));
  },
  update: (object, next, path, index) => {
    // Is it worth avoiding cloning if nothing changes?
    if (object && typeof object.slice === 'function') {
      const newArray = object.slice(0);
      const spliceBegin = normalizeIndex(begin, object.length, 0);
      const spliceEnd = normalizeIndex(end, object.length, object.length);
      // We cheat a little and look ahead to see if `next` is going to return
      // a constant. If it is, then there's no reason to get a proper slice of
      // the array, because we know it won't be used anyway.
      // CONSIDER THIS AN EXPERIMENT. DON'T USE IT IN YOUR NAVIGATORS.
      // It actually doesn't seem to help that much unless the slice is huge.
      if (isNextNavigatorConstant(path, index)) {
        // Call `next` with no args, because it's a constant.
        const newSlice = next();
        // Splice in the new array.
        newArray.splice(spliceBegin, spliceEnd - spliceBegin, ...newSlice);
      // Otherwise, we do have to slice the array so it can be passed to `next`.
      } else {
        // Create a slice.
        const slice = object.slice(spliceBegin, spliceEnd);
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
