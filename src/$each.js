import objectAssign from 'object-assign';

import createNavigator from './createNavigator';
import reduceSequence from './utils/reduceSequence';
import {isNone} from './$none';
import removed, {isNotRemoved} from './utils/removed';

const $each = createNavigator({
  select: (object, next) => {
    // Pass each value along to the next navigator.
    return reduceSequence((result, key) => {
      return next(object[key]);
    }, undefined, object);
  },
  update: (object, next) => {
    const isArray = Array.isArray(object);
    // Marker for if we removed values from an array. Since we filter out
    // removed values, we don't want to do that iteration if we don't have to.
    // Maybe there's a better way to do this, but removing array values in place
    // is kind of ugly, since positions change.
    let didRemoveValues = false;
    const newObject = reduceSequence((result, key) => {
      const newValue = next(object[key]);
      const isNewValueNone = isNone(newValue);
      // This is a no-op unless we actually have a different value. The
      // `isNoneValue` covers a goofy edge where you might have the value $none
      // stored in the object/array. In that case, it would match, but we still
      // want to remove it.
      if (newValue !== object[key] || isNewValueNone) {
        // Create a new object if we haven't done that yet.
        if (object === result) {
          if (isArray) {
            result = result.slice(0);
          } else {
            result = objectAssign({}, result);
          }
        }

        if (isNewValueNone) {
          // For arrays, we'll store a removed value so indexes don't get wonky.
          if (isArray) {
            result[key] = removed;
            didRemoveValues = true;
          // Otherwise, we'll just delete it now.
          } else {
            delete result[key];
          }
        } else {
          result[key] = newValue;
        }
      }
      return result;
    }, object, object);
    // Filter our removed values from arrays.
    if (isArray && didRemoveValues) {
      return newObject.filter(isNotRemoved);
    }
    return newObject;
  }
});

export default $each;
