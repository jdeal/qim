import copy from './utils/copy';
import $traverse from './$traverse';
import reduceSequence from './utils/reduceSequence';
import {isNone} from './$none';
import removed, {isNotRemoved} from './utils/removed';

const $eachKey = $traverse({
  select: (object, next) => {
    // Pass each key along to the next navigator.
    return reduceSequence((result, key) => {
      return next(key);
    }, undefined, object);
  },
  update: (object, next) => {
    const isArray = Array.isArray(object);
    // Marker for if we removed keys from an array. Since we filter out
    // removed keys, we don't want to do that iteration if we don't have to.
    // Maybe there's a better way to do this, but removing array values in place
    // is kind of ugly, since positions change.
    let didRemoveKeys = false;
    const newObject = reduceSequence((result, key) => {
      const newKey = next(key);
      // Undefined/null key doesn't make much sense, so treat it as $none.
      const isKeyNone = isNone(newKey) || newKey == null;
      // Marker for if we removed values from an array. Since we filter out
      // removed values, we don't want to do that iteration if we don't have to.
      // Maybe there's a better way to do this, but removing array values in place
      // is kind of ugly, since positions change.
      didRemoveKeys = didRemoveKeys || isKeyNone;
      // This is a no-op unless we actually have a different key.
      if (newKey !== key) {
        // Create a new object if we haven't done that yet.
        if (object === result) {
          result = copy(result);
        }
        // For arrays, we'll store a removed value so indexes don't get wonky.
        if (isArray) {
          result[key] = removed;
          didRemoveKeys = true;
        // Otherwise, we'll just delete it now.
        } else {
          delete result[key];
        }
        // If we have a new key, point the new key to the value of the old key.
        if (!isKeyNone) {
          result[newKey] = object[key];
        }
      }
      return result;
    }, object, object);
    // Filter our removed values from arrays.
    if (isArray && didRemoveKeys) {
      return newObject.filter(isNotRemoved);
    }
    return newObject;
  }
});

export default $eachKey;
