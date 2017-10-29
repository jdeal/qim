import $traverse from './$traverse';
import {wrap, isNone} from './utils/data';
import removed, {isNotRemoved} from './utils/removed';

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
    const newWrapped = wrapped.cloneEmpty();
    let hasMutated = false;
    let hasRemoved = false;
    const canAppend = wrapped.canAppend();
    wrapped.forEach((oldValue, oldKey) => {
      const newPair = next([oldKey, oldValue]);
      let newKey;
      let newValue;
      if (newPair != null) {
        newKey = newPair[0];
        newValue = newPair[1];
      }
      if (!hasMutated) {
        if (oldKey !== newKey || oldValue !== newValue || isNone(newPair) || isNone(newKey) || isNone(oldValue)) {
          hasMutated = true;
        }
      }
      if (canAppend) {
        if (isNone(newPair) || isNone(newKey) || isNone(newValue)) {
          hasRemoved = true;
          newWrapped.set(oldKey, removed);
        } else {
          if (newKey !== oldKey) {
            hasRemoved = true;
            newWrapped.set(oldKey, removed);
          }
          newWrapped.set(newKey, newValue);
        }
      } else {
        if (!isNone(newPair)) {
          newWrapped.set(newKey, newValue);
        }
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

export default $eachPair;
