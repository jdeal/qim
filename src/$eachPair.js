import $traverse from './$traverse';
import {wrap} from './utils/data';

const $eachPair = $traverse({
  select: (object, next) => {
    // Pass each key along to the next navigator.
    const wrapped = wrap(object);
    return wrapped.reduce((result, value, key) => {
      return next([key, value]);
    }, undefined, object);
  },
  update: (object, next) => {
    const wrapped = wrap(object);
    return wrapped.mapPairs((pair) => {
      return next(pair);
    }).value();
  }
});

export default $eachPair;
