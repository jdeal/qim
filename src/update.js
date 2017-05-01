import objectAssign from 'object-assign';

import {updateKey} from './createNavigator';
import {pathKey} from './createNavigator';
import {curry2} from './utils/curry';
import arrayify from './utils/arrayify';
import {$setKey} from './$set';
import {$defaultKey} from './$default';
import {$applyKey} from './$apply';
import $none, {$noneKey, isNone, undefinedIfNone} from './$none';

const isInteger = (value) => {
  var x;
  /*eslint-disable no-return-assign */
  return isNaN(value) ?
    !1 :
    (x = parseFloat(value), (0 | x) === x);
  /*eslint-enable no-return-assign */
};

let continueUpdateEach;

export const updateEach = (path, object, pathIndex, returnFn, mutationMarker) => {
  if (pathIndex >= path.length) {
    if (returnFn) {
      return returnFn(object);
    }
    return object;
  }
  const nav = path[pathIndex];
  if (nav == null) {
    return object;
  }
  if (typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
    if (object && typeof object === 'object') {
      const value = object[nav];
      const newValue = updateEach(path, value, pathIndex + 1, returnFn);
      if (isNone(newValue)) {
        if (!(nav in object)) {
          return object;
        }
        if (Array.isArray(object)) {
          const newObject = object.slice(0);
          // Could have a silly edge here where nav was a property and not an index, which means it disappears.
          // If it's still here, that means it's an index.
          if (nav in object) {
            newObject.splice(nav, 1);
          }
          return newObject;
        }
        const newObject = objectAssign({}, object);
        delete newObject[nav];
        return newObject;
      }
      if (value === newValue) {
        return object;
      }
      if (mutationMarker) {
        if (mutationMarker.hasMutated) {
          object[nav] = newValue;
          return object;
        } else {
          mutationMarker.hasMutated = true;
        }
      }
      if (Array.isArray(object)) {
        const newObject = object.slice(0);
        newObject[nav] = newValue;
        return newObject;
      }
      return objectAssign({}, object, {[nav]: newValue});
    } else if (object == null) {
      const newValue = updateEach(path, undefined, pathIndex + 1, returnFn);
      if (isInteger(nav)) {
        const newArray = [];
        newArray[nav] = newValue;
        return newArray;
      } else {
        const newObject = {};
        newObject[nav] = newValue;
        return newObject;
      }
    } else {
      throw new Error(`Cannot update property ${nav} (at path index ${pathIndex}) for non-object.`);
    }
  }
  if (typeof nav === 'function') {
    if (nav(object)) {
      return updateEach(path, object, pathIndex + 1, returnFn);
    } else {
      return object;
    }
  }
  switch (nav['@@qim/nav']) {
    case $applyKey: {
      return updateEach(path, nav.data(object), pathIndex + 1, returnFn);
    }
    case $setKey:
      return updateEach(path, nav.data, pathIndex + 1, returnFn);
    case $defaultKey: {
      if (typeof object === 'undefined') {
        return updateEach(path, nav.data, pathIndex + 1, returnFn);
      }
      return updateEach(path, object, pathIndex + 1, returnFn);
    }
    case $noneKey:
      return $none;
  }
  let navPath = nav[pathKey];
  if (navPath) {
    if (typeof navPath === 'function') {
      navPath = nav.hasParams ? navPath(nav.params, object, nav.self) : navPath(object, nav);
      navPath = arrayify(navPath);
    }
    if (navPath.length === 0) {
      return updateEach(path, object, pathIndex + 1, returnFn);
    }
    return updateEach(
      navPath, object, 0,
      (_object) => updateEach(path, _object, pathIndex + 1, returnFn)
    );
  }
  if (nav[updateKey]) {
    return continueUpdateEach(nav[updateKey], nav, object, path, pathIndex, returnFn);
  }
  if (Array.isArray(nav)) {
    mutationMarker = mutationMarker || {
      hasMutated: false
    };
    const nestedResult = undefinedIfNone(updateEach(nav, object, 0, undefined, mutationMarker));
    return updateEach(path, nestedResult, pathIndex + 1, returnFn, mutationMarker);
  }
  throw new Error(`Invalid navigator ${nav} at path index ${pathIndex}.`);
};

continueUpdateEach = (updateFn, nav, object, path, pathIndex, returnFn) => {
  if (nav.hasParams) {
    return updateFn(nav.params, object, (subObject) => updateEach(path, subObject, pathIndex + 1, returnFn), path, pathIndex);
  }
  return updateFn(object, (subObject) => updateEach(path, subObject, pathIndex + 1, returnFn), path, pathIndex);
};

const update = (path, obj) => path == null ?
  obj :
  undefinedIfNone(updateEach(arrayify(path), obj, 0));

export default curry2(update);
