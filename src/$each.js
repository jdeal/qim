import $traverse from './$traverse';
import {wrap} from './utils/data';

const $each = $traverse({
  select: (object, next) => {
    // Pass each value along to the next navigator.
    const wrapped = wrap(object);
    return wrapped.reduce((result, value, key) => {
      return next(wrapped.get(key));
    }, undefined, object);
  },
  update: (object, next) => {
    const wrapped = wrap(object);
    return wrapped.mapPairs((pair) => {
      return [pair[0], next(pair[1])];
    }).value();
  }
});

export default $each;
