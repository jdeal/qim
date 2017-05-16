import copy from './utils/copy';
import createNavigator from './createNavigator';
import reduceSequence from './utils/reduceSequence';
import {isNone} from './$none';
import removed, {isNotRemoved} from './utils/removed';

const $eachPair = createNavigator({
  select: (object, next) => {
    // Pass each pair along to the next navigator.
    return reduceSequence((result, key) => {
      return next([key, object[key]]);
    }, undefined, object);
  },
  update: (object, next) => {
    const isArray = Array.isArray(object);
    // Marker for if we removed pairs from an array. Since we filter out
    // removed pairs, we don't want to do that iteration if we don't have to.
    // Maybe there's a better way to do this, but removing array values in place
    // is kind of ugly, since positions change.
    let didRemovePairs = false;
    const newObject = reduceSequence((result, key) => {
      const value = object[key];
      const pair = [key, value];
      const newPair = next(pair);
      let newKey;
      let newValue;
      // Undefined/null pair will result in undefined key, which will be
      // treated as $none.
      if (newPair != null) {
        newKey = newPair[0];
        newValue = newPair[1];
      }
      const isPairNone = (
        // Undefined/null key doesn't make much sense, so treat it as $none.
        newKey == null ||
        isNone(newPair) ||
        // isNone(newValue) covers a goofy edge where you might have the value
        // $none stored in an object/array. In that case, it would match, but we
        // still want to remove it.
        isNone(newValue)
      );
      // This is a no-op unless we actually have a different value or key.
      if (newKey !== key || newValue !== value || isPairNone) {
        // Create a new object if we haven't done that yet.
        if (object === result) {
          result = copy(result);
        }
        if (newKey !== key) {
          // For arrays, we'll store a removed value so indexes don't get wonky.
          if (isArray) {
            result[key] = removed;
            didRemovePairs = true;
          // Otherwise, we'll just delete it now.
          } else {
            delete result[key];
          }
        }
        // If we haven't removed the key or value, then set the new key to the
        // new value.
        if (!isPairNone) {
          result[newKey] = newValue;
        }
      }
      return result;
    }, object, object);
    // Filter our removed values from arrays.
    if (isArray && didRemovePairs) {
      return newObject.filter(isNotRemoved);
    }
    return newObject;
  }
});

export default $eachPair;
