import $traverse from './$traverse';
import {reduceSequence, wrap} from './utils/data';
import {isNone} from './$none';

const $each = $traverse({
  select: (object, next) => {
    // Pass each value along to the next navigator.
    return reduceSequence((result, key) => {
      return next(object[key]);
    }, undefined, object);
  },
  update: (object, next) => {
    const objectWrapped = wrap(object);
    const newObjectWrapped = objectWrapped.cloneEmpty();
    let hasMutated = false;
    const canAppend = objectWrapped.canAppend();
    objectWrapped.forEach((value, key) => {
      const oldValue = objectWrapped.get(key);
      const newValue = next(oldValue);
      if (!hasMutated) {
        if (oldValue !== newValue || isNone(newValue)) {
          hasMutated = true;
        }
      }
      if (canAppend) {
        newObjectWrapped.append(newValue);
      } else {
        newObjectWrapped.set(key, newValue);
      }
    });
    if (!hasMutated) {
      return object;
    }
    return newObjectWrapped.value();
  }
});

export default $each;
