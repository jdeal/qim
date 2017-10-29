import $traverse from './$traverse';
import {wrap, wrapSlice, unwrap} from './utils/data';

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

    return unwrap(wrap(object).replaceSlice(this.begin, this.end, result));
  }
});

const $slice = (begin, end) => new Slice(begin, end);

export default $slice;
