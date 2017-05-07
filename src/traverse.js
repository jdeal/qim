import objectAssign from 'object-assign';

import {selectKey, pathKey} from './createNavigator';
import arrayify from './utils/arrayify';
import {$setKey} from './$set';
import {$defaultKey} from './$default';
import {$applyKey} from './$apply';
import {$setContextKey} from './$setContext';
import $none, {$noneKey, undefinedIfNone, isNone} from './$none';

const isInteger = (value) => {
  if (isNaN(value)) {
    return false;
  }
  const x = parseFloat(value);
  return (x | 0) === x;
};

export const traverseEach = (navKey, state, resultFn, path, object, pathIndex, returnFn, context, mutationMarker) => {

  if (pathIndex >= path.length) {
    if (returnFn) {
      return returnFn(object, context);
    }
    return resultFn ? resultFn(state, object) : object;
  }

  const nav = path[pathIndex];

  if (nav == null) {
    return navKey === selectKey ? $none : object;
  }

  if (typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
    if (navKey === selectKey) {
      if (object && typeof object === 'object') {
        const subObject = object[nav];
        // Special case so `has` can differentiate between missing keys and keys
        // pointing to undefined values. Maybe a better way? Maybe just don't
        // worry about `has(['x'], {x: undefined}) === false`?
        if (typeof subObject === 'undefined' && !(nav in object) && pathIndex === path.length - 1) {
          return $none;
        }
        return traverseEach(navKey, state, resultFn, path, subObject, pathIndex + 1, returnFn, context);
      } else {
        return $none;
      }
    }
    if (object && typeof object === 'object') {
      const value = object[nav];
      const newValue = traverseEach(navKey, state, resultFn, path, value, pathIndex + 1, returnFn, context);
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
      const newValue = traverseEach(navKey, state, resultFn, path, undefined, pathIndex + 1, returnFn, context);
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
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    } else {
      return navKey === selectKey ? $none : object;
    }
  }
  switch (nav['@@qim/nav']) {
    case $applyKey: {
      return traverseEach(navKey, state, resultFn, path, nav.data(object, context), pathIndex + 1, returnFn, context);
    }
    case $setKey:
      return traverseEach(navKey, state, resultFn, path, nav.data, pathIndex + 1, returnFn, context);
    case $defaultKey: {
      if (typeof object === 'undefined') {
        return traverseEach(navKey, state, resultFn, path, nav.data, pathIndex + 1, returnFn, context);
      }
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    }
    case $noneKey:
      return $none;
    case $setContextKey: {
      context = nav.setContext(nav, nav.fn(object, context || {}), context);
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    }
  }

  let navPath = nav[pathKey];

  if (navPath) {
    if (typeof navPath === 'function') {
      navPath = nav.hasParams ? navPath(nav.params, object, nav.self) : navPath(object, nav);
      navPath = arrayify(navPath);
    }
    if (navPath.length === 0) {
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    }
    return traverseEach(navKey,
      state, resultFn, navPath, object, 0,
      (_object, _context) => traverseEach(navKey, state, resultFn, path, _object, pathIndex + 1, returnFn, _context),
      context
    );
  }

  if (nav[navKey]) {
    if (nav.hasParams) {
      return nav[navKey](nav.params, object, (subObject) => traverseEach(navKey, state, resultFn, path, subObject, pathIndex + 1, returnFn, context), path, pathIndex);
    }
    return nav[navKey](object, (subObject) => traverseEach(navKey, state, resultFn, path, subObject, pathIndex + 1, returnFn, context));
  }

  if (Array.isArray(nav)) {
    if (navKey === selectKey) {
      const subResult = traverseEach(navKey, state, resultFn, nav, object, 0, returnFn, context);
      if (pathIndex + 1 === path.length) {
        return subResult;
      }
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    }

    mutationMarker = mutationMarker || {
      hasMutated: false
    };
    const nestedResult = undefinedIfNone(traverseEach(navKey, state, resultFn, nav, object, 0, undefined, context, mutationMarker));
    return traverseEach(navKey, state, resultFn, path, nestedResult, pathIndex + 1, returnFn, context, mutationMarker);
  }

  throw new Error(`Invalid navigator ${nav} at path index ${pathIndex}.`);
};
