import objectAssign from 'object-assign';

import isInteger from './utils/isInteger';
import {updateKey, navigatorRef} from './createNavigator';
import {curry2} from './utils/curry';
import {$applyKey} from './$apply';
import {$setKey} from './$set';
import {$ifKey} from './$if';

let continueUpdateEach;
let update;

export const updateEach = (path, object, pathIndex) => {
  if (pathIndex >= path.length) {
    return object;
  }
  const nav = path[pathIndex];
  if (!nav || typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
    if (object && typeof object === 'object') {
      const value = object[nav];
      const newValue = updateEach(path, value, pathIndex + 1);
      if (value === newValue) {
        return object;
      }
      if (Array.isArray(object)) {
        const newObject = object.slice(0);
        newObject[nav] = newValue;
        return newObject;
      }
      return objectAssign({}, object, {[nav]: newValue});
    } else {
      // if (pathIndex === 0) {
      //   return object;
      // }
      object = isInteger(nav) ? [] : {};
      const value = object[nav];
      const newValue = updateEach(path, value, pathIndex + 1);
      object[nav] = newValue;
      return object;
    }
  }
  if (typeof nav === 'function') {
    return updateEach(path, nav(object), pathIndex + 1);
  }
  let updateFn;
  switch (nav[0]) {
    case $ifKey: {
      if (nav[1](object)) {
        return updateEach(path, object, pathIndex + 1);
      } else {
        return object;
      }
    }
    case $setKey:
      return updateEach(path, nav[1], pathIndex + 1);
    case $applyKey:
      return updateEach(path, nav[1](object), pathIndex + 1);
  }
  if (nav[updateKey]) {
    updateFn = nav[updateKey];
  } else {
    if (nav[0] === navigatorRef) {
      const childSelector = nav[1];
      if (childSelector && childSelector[updateKey]) {
        updateFn = childSelector[updateKey];
      }
    } else if (Array.isArray(nav)) {
      return updateEach(path, update(nav, object), pathIndex + 1);
    }
  }
  if (!updateFn) {
    throw new Error(`invalid navigator at path index ${pathIndex}`);
  }
  return continueUpdateEach(updateFn, nav, object, path, pathIndex);
};

continueUpdateEach = (updateFn, nav, object, path, pathIndex) =>
  updateFn(nav, object, (subObject) => updateEach(path, subObject, pathIndex + 1));

update = function (path, obj) {
  if (!Array.isArray(path)) {
    path = [path];
  }
  return updateEach(path, obj, 0);
};

export default curry2(update);
