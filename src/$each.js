import $traverse from './$traverse';
import {wrap} from './utils/data';
import {isNone} from './$none';

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
    const newWrapped = wrapped.cloneEmpty();
    let hasMutated = false;
    const canAppend = wrapped.canAppend();
    wrapped.forEach((oldValue, key) => {
      const newValue = next(oldValue);
      if (!hasMutated) {
        if (oldValue !== newValue || isNone(newValue)) {
          hasMutated = true;
        }
      }
      if (canAppend) {
        if (newValue === undefined && oldValue === undefined) {
          if (!wrapped.has(key)) {
            newWrapped.appendHole();
            return;
          }
        }
        newWrapped.append(newValue);
      } else {
        newWrapped.set(key, newValue);
      }
    });
    if (!hasMutated) {
      return object;
    }
    return newWrapped.value();
  }
});

export default $each;
