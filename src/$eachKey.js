import $traverse from './$traverse';
import {wrap} from './utils/data';

const $eachKey = $traverse({
  select: (object, next) => {
    // Pass each key along to the next navigator.
    const wrapped = wrap(object);
    return wrapped.reduce((result, value, key) => {
      return next(key);
    }, undefined, object);
  },
  update: (object, next) => {
    const wrapped = wrap(object);
    return wrapped.mapPairs((pair) => {
      return [next(pair[0]), pair[1]];
    }).value();
  }
});

export default $eachKey;
