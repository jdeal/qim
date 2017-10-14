import $traverse from './$traverse';
import {wrap} from './utils/data';
import {isNone} from './$none';
import removed, {isNotRemoved} from './utils/removed';

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
    const newWrapped = wrapped.cloneEmpty();
    let hasMutated = false;
    let hasRemoved = false;
    const canAppend = wrapped.canAppend();
    wrapped.forEach((value, oldKey) => {
      const newKey = next(oldKey);
      if (!hasMutated) {
        if (oldKey !== newKey || isNone(newKey)) {
          hasMutated = true;
        }
      }
      if (canAppend) {
        if (isNone(newKey)) {
          hasRemoved = true;
          newWrapped.set(oldKey, removed);
        } else {
          if (newKey !== oldKey) {
            hasRemoved = true;
            newWrapped.set(oldKey, removed);
          }
          newWrapped.set(newKey, value);
        }
      } else {
        newWrapped.set(newKey, value);
      }
    });
    if (!hasMutated) {
      return object;
    }
    if (canAppend && hasRemoved) {
      const newWrappedWithoutRemoved = newWrapped.cloneEmpty();
      newWrapped.forEach((value) => {
        if (isNotRemoved(value)) {
          newWrappedWithoutRemoved.append(value);
        }
      });
      return newWrappedWithoutRemoved.value();
    }
    return newWrapped.value();
  }
});

export default $eachKey;
