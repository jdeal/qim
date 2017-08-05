import $traverse from './$traverse';
import {wrapSlice, unwrap, replaceSlice} from './utils/data';

const $slice = (begin, end) => $traverse({
  select: (object, next) => {
    return next(wrapSlice(object, begin, end));
  },
  update: (object, next) => {
    const slice = wrapSlice(object, begin, end);
    const result = next(slice);

    return unwrap(replaceSlice(begin, end, result, object));
  }
});

export default $slice;
