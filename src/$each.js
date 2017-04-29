import objectAssign from 'object-assign';

import createNavigator from './createNavigator';
import reduceSequence from './utils/reduceSequence';
import {isNone} from './$none';
import removed, {isNotRemoved} from './utils/removed';

const $each = createNavigator({
  select: (object, next) => {
    return reduceSequence((result, key) => {
      return next(object[key]);
    }, undefined, object);
  },
  update: (object, next) => {
    const isArray = Array.isArray(object);
    let didRemoveValues = false;
    const newObject = reduceSequence((result, key) => {
      const newValue = next(object[key]);
      const isNewValueNone = isNone(newValue);
      if (newValue !== object[key] || isNewValueNone) {
        if (object === result) {
          if (isArray) {
            result = result.slice(0);
          } else {
            result = objectAssign({}, result);
          }
        }

        if (isNewValueNone) {
          if (isArray) {
            result[key] = removed;
            didRemoveValues = true;
          } else {
            delete result[key];
          }
        } else {
          result[key] = newValue;
        }
      }
      return result;
    }, object, object);
    if (isArray && didRemoveValues) {
      return newObject.filter(isNotRemoved);
    }
    return newObject;
  }
});

export default $each;
