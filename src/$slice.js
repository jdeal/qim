import $traverse from './$traverse';
import {wrapSlice, unwrap, replaceSlice} from './utils/data';

function Slice(begin, end) {
  this.begin = begin;
  this.end = end;
}

Slice.prototype = $traverse({
  select(object, next) {
    return next(wrapSlice(object, this.begin, this.end));
  },
  update(object, next) {
    const slice = wrapSlice(object, this.begin, this.end);
    const result = next(slice);

    return unwrap(replaceSlice(this.begin, this.end, result, object));
  }
});

const $slice = (begin, end) => new Slice(begin, end);

export default $slice;
