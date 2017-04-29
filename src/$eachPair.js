import objectAssign from 'object-assign';

import createNavigator from './createNavigator';
import reduceSequence from './utils/reduceSequence';
import {isNone} from './$none';
import removed, {isNotRemoved} from './utils/removed';

const $eachPair = createNavigator({
  select: (object, next) => {
    return reduceSequence((result, key) => {
      return next([key, object[key]]);
    }, undefined, object);
  },
  update: (object, next) => {
    const isArray = Array.isArray(object);
    let didRemovePairs = false;
    const newObject = reduceSequence((result, key) => {
      const value = object[key];
      const pair = [key, value];
      const newPair = next(pair);
      if (!newPair) {
        return result;
      }
      const newKey = newPair[0];
      const newValue = newPair[1];
      const isPairNone = isNone(newPair) || isNone(newKey) || isNone(newValue);
      if (newKey !== key || newValue !== value || isPairNone) {
        if (object === result) {
          if (isArray) {
            result = result.slice(0);
          } else {
            result = objectAssign({}, result);
          }
        }
        if (newKey !== key) {
          if (isArray) {
            result[key] = removed;
            didRemovePairs = true;
          }
          delete result[key];
        }
        if (!isPairNone) {
          result[newKey] = newValue;
        }
      }
      return result;
    }, object, object);
    if (isArray && didRemovePairs) {
      return newObject.filter(isNotRemoved);
    }
    return newObject;
  }
});

export default $eachPair;
