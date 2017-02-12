import objectAssign from 'object-assign';

import isInteger from './utils/isInteger';
import {transformKey, navigatorRef} from './createNavigator';

const transformEach = (path, object, pathIndex) => {
  if (pathIndex >= path.length) {
    return object;
  }
  const nav = path[pathIndex];
  if (!nav || typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
    if (object && typeof object === 'object') {
      const value = object[nav];
      const newValue = transformEach(path, value, pathIndex + 1);
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
      const newValue = transformEach(path, value, pathIndex + 1);
      object[nav] = newValue;
      return object;
    }
  }
  if (typeof nav === 'function') {
    if (nav(object)) {
      return transformEach(path, object, pathIndex + 1);
    } else {
      return object;
    }
  }
  let transformFn;
  if (nav[transformKey]) {
    transformFn = nav[transformKey];
  } else {
    if (nav[0] === navigatorRef) {
      const childSelector = nav[1];
      if (childSelector && childSelector[transformKey]) {
        transformFn = childSelector[transformKey];
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
          newObject = transformEach(subPath, newObject, 0);
        }
        return newObject;
      }
    }
  }
  if (!transformFn) {
    throw new Error(`invalid navigator at path index ${pathIndex}`);
  }
  return transformFn(nav, object, path, pathIndex, transformEach);
};

const transform = function (path, object) {
  if (!path || typeof path !== 'object' || typeof path.length !== 'number') {
    path = [path];
  }
  if (arguments.length > 1) {
    return transformEach(path, object, 0);
  } else if (arguments.length === 1) {
    return (_object) => {
      return transformEach(path, _object, 0);
    };
  }
  return transform;
};

export default transform;
