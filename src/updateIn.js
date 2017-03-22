import objectAssign from 'object-assign';

import isInteger from './utils/isInteger';
import {updateKey, navigatorRef} from './createNavigator';
import {curry3} from './utils/curry';
import mutateMarker from './utils/mutateMarker';

let continueUpdateEach;

export const updateEach = (resultFn, path, object, pathIndex) => {
  if (pathIndex >= path.length) {
    if (Array.isArray(resultFn)) {

      const flowLength = resultFn.length;

      if (flowLength === 0) {
        return object;
      }

      let result = resultFn[0](object);

      for (let i = 1; i < flowLength; i++) {
        const update = resultFn[i];
        if (update['@@qim/canMutate'] === true) {
          result = update(result, object, mutateMarker);
        } else {
          result = update(result);
        }
        // if (source) {
        //   if (update['@@qim/canMutate'] === true) {
        //     result = update(result, source);
        //   } else {
        //     result = update(result);
        //   }
        // } else if (result !== object) {
        //   source = new Source(object);
        //   result = update(result, source);
        // } else {
        //   result = update(result);
        // }
      }

      return result;
    }
    return resultFn(object);
  }
  const nav = path[pathIndex];
  if (!nav || typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
    if (object && typeof object === 'object') {
      const value = object[nav];
      const newValue = updateEach(resultFn, path, value, pathIndex + 1);
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
      const newValue = updateEach(resultFn, path, value, pathIndex + 1);
      object[nav] = newValue;
      return object;
    }
  }
  if (typeof nav === 'function') {
    if (nav(object)) {
      return updateEach(resultFn, path, object, pathIndex + 1);
    } else {
      return object;
    }
  }
  let updateFn;
  if (nav[updateKey]) {
    updateFn = nav[updateKey];
  } else {
    if (nav[0] === navigatorRef) {
      const childSelector = nav[1];
      if (childSelector && childSelector[updateKey]) {
        updateFn = childSelector[updateKey];
      }
    } else {
      // Transform multiple sub paths.
      if (isInteger(nav.length)) {
        let newObject = object;
        for (let subPathIndex = 0; subPathIndex < nav.length; subPathIndex++) {
          let subPath = nav[subPathIndex];
          if (!subPath || typeof subPath !== 'object' || typeof subPath.length !== 'number' || subPath[0] === navigatorRef) {
            subPath = [subPath];
          }
          newObject = updateEach(resultFn, subPath, newObject, 0);
        }
        return newObject;
      }
    }
  }
  if (!updateFn) {
    throw new Error(`invalid navigator at path index ${pathIndex}`);
  }
  return continueUpdateEach(resultFn, updateFn, nav, object, path, pathIndex);
};

continueUpdateEach = (resultFn, updateFn, nav, object, path, pathIndex) =>
  updateFn(nav, object, (subObject) => updateEach(resultFn, path, subObject, pathIndex + 1));

const updateIn = function (path, update, obj) {
  if (!path || typeof path !== 'object' || typeof path.length !== 'number') {
    path = [path];
  }
  return updateEach(update, path, obj, 0);
};

export default curry3(updateIn);
