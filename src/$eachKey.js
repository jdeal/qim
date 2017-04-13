import objectAssign from 'object-assign';

import createNavigator from './createNavigator';
import reduceSequence from './utils/reduceSequence';
import {isNone} from './$none';
import removed, {isNotRemoved} from './utils/removed';

const $eachKey = createNavigator({
  select: (nav, object, next) => {
    return reduceSequence((result, key) => {
      return next(key);
    }, undefined, object);
  },
  update: (nav, object, next) => {
    const isArray = Array.isArray(object);
    let didRemoveKeys = false;
    const newObject = reduceSequence((result, key) => {
      const newKey = next(key);
      const isKeyNone = isNone(newKey);
      didRemoveKeys = didRemoveKeys || isKeyNone;
      if (newKey !== key || isKeyNone) {
        if (object === result) {
          if (isArray) {
            result = result.slice(0);
          } else {
            result = objectAssign({}, result);
          }
        }
        if (isArray) {
          result[key] = removed;
          didRemoveKeys = true;
        } else {
          delete result[key];
        }
        if (!isKeyNone) {
          result[newKey] = object[key];
        }
      }
      return result;
    }, object, object);
    if (isArray && didRemoveKeys) {
      return newObject.filter(isNotRemoved);
    }
    return newObject;
  }
});

export default $eachKey;
