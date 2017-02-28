import objectAssign from 'object-assign';

import isArrayLike from './utils/isArrayLike';
import isInteger from './utils/isInteger';
import {selectKey, transformKey, navigatorRef} from './createNavigator';
import none from './none';

const createTraverse = (key, createState, wrapResult) => {

  createState = typeof createState === 'function' ? createState : () => createState;

  const traverseEach = (state, path, update, object, pathIndex) => {
    if (pathIndex >= path.length) {
      return wrapResult ? wrapResult(object, state) : update(object);
    }
    const nav = path[pathIndex];
    if (!nav || typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
      if (key === selectKey) {
        if (object && typeof object === 'object') {
          return traverseEach(state, path, update, object[nav], pathIndex + 1);
        } else {
          return wrapResult ? wrapResult(undefined, state) : update(undefined);
        }
      } else if (key === transformKey) {
        if (object && typeof object === 'object') {
          const value = object[nav];
          const newValue = traverseEach(state, path, update, value, pathIndex + 1);
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
          const newValue = traverseEach(state, path, update, value, pathIndex + 1);
          object[nav] = newValue;
          return object;
        }
      } else {
        throw new Error('unknown key for property access');
      }
    }
    if (typeof nav === 'function') {
      if (nav(object)) {
        return traverseEach(state, path, update, object, pathIndex + 1);
      } else {
        return none;
      }
    }
    let navFn;
    if (nav[key]) {
      navFn = nav[key];
    } else {
      if (nav[0] === navigatorRef) {
        const childSelector = nav[1];
        if (childSelector && childSelector[key]) {
          navFn = childSelector[key];
        }
      }
    }
    if (!navFn) {
      throw new Error(`invalid navigator at path index ${pathIndex}`);
    }
    return navFn(nav, object, () => traverseEach(state, path, update, object, pathIndex + 1));
  };

  if (wrapResult) {
    const select = function (path, object) {
      if (!isArrayLike(path)) {
        path = [path];
      }

      if (arguments.length < 2) {
        return (_object) => {
          return traverseEach(createState(), path, null, _object, 0);
        };
      }

      return traverseEach(createState(), path, null, object, 0);
    };

    return select;
  } else {
    const transform = function (path, update, object) {
      if (!isArrayLike(path)) {
        path = [path];
      }

      if (arguments.length < 2) {
        return (_update, _object) => {
          return transform(path, _update, _object);
        };
      }

      if (typeof update !== 'function') {
        throw new Error('function required for update');
      }

      if (arguments.length < 3) {
        return (_object) => {
          return traverseEach(createState(), path, update, _object, 0);
        };
      }

      return traverseEach(createState(), path, update, object, 0);
    };

    return transform;
  }
};

export const selectIn = createTraverse(selectKey, () => [], (value, state) => {
  state.push(value);
  return state;
});

export const updateIn = createTraverse(transformKey);
