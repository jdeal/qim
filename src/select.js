import invariant from 'invariant';

import getIn from './methods/getIn';
import isStringPath from './isStringPath';

let _nextSelectorId = 0;
const getNextSelectorId = () => _nextSelectorId++;

const cacheSelectorId = getNextSelectorId();

export const selectInline = (path, object) => {
  // if (isStringPath(path)) {
  //   return getIn(object, path);
  // }
  //invariant(Array.isArray(path), 'Path to select must be an array.');
  if (path.length === 0) {
    return [object];
  }
  const selector = path[0];
  const remaining = path.slice(1);
  // select property
  if (typeof selector === 'string' || typeof selector === 'number') {
    if (object == null) {
      return [undefined];
    }
    const child = object[selector];
    if (child == null) {
      return [child];
    }
    return selectInline(remaining, child);
  // select predicate
  } else if (typeof selector === 'function') {
    if (selector(object)) {
      return selectInline(remaining, object);
    }
    return [];
  // select custom
  } else if (selector && typeof selector.select === 'function') {
    return selector.select(object, remaining, selectInline);
  }
  throw new Error('invalid selector');
};

//import invariant from 'invariant';
import objectAssign from 'object-assign';

const wrapInArray = (object) => [object];

const selectProperty = (key, object, next, path) => {
  return next(object ? object[key] : undefined, path);
};

const transformProperty = (key, object, next, path) => {
  if (!object || typeof object !== 'object') {
    return object;
  }
  const value = object[key];
  const newValue = next(object[key], path);
  if (value === newValue) {
    return object;
  }
  return objectAssign({}, object, {[key]: newValue});
};

const selectPredicate = (predicate, object, next, path) => {
  if (predicate(object)) {
    return next(object, path);
  }
  return [];
};

const transformPredicate = (predicate, object, next, path) => {
  if (predicate(object)) {
    return next(object, path);
  }
  return object;
};

const propertySelectorId = getNextSelectorId();
const predicateSelectorId = getNextSelectorId();

const $values = {
  select: (_, object, next, path) => {
    const values = Object.keys(object).map(key => object[key]);
    const results = values.map(item => next(item, path));
    return results.reduce((a, b) => a.concat(b), []);
  },
  transform: (_, object, next, path) => {
    if (!object || typeof object !== 'object') {
      object = [object];
    }
    const isArray = Array.isArray(object);
    return Object.keys(object).reduce((result, key) => {
      const newValue = next(object[key], path);
      if (newValue !== object[key]) {
        if (object === result) {
          if (isArray) {
            result = result.slice(0);
          } else {
            result = objectAssign({}, result);
          }
        }
        result[key] = newValue;
      }
      return result;
    }, object);
  },
  id: getNextSelectorId()
};

const $begin = {
  transform: (_, array, next, path) => {
    if (!Array.isArray(array)) {
      return array;
    }
    const result = next(undefined, path);
    const arrayResult = Array.isArray(result) ? result : [result];
    return arrayResult.length === 0 ? array : arrayResult.concat(array);
  },
  id: getNextSelectorId()
};

const $end = {
  transform: (_, array, next, path) => {
    if (!Array.isArray(array)) {
      return array;
    }
    const result = next(undefined, path);
    const arrayResult = Array.isArray(result) ? result : [result];
    return arrayResult.length === 0 ? array : array.concat(arrayResult);
  },
  id: getNextSelectorId()
};

const findSelect = (selector) => {
  if (typeof selector === 'function') {
    return selectPredicate;
  }
  if (typeof selector.select === 'function') {
    return selector.select;
  }
  return selectProperty;
};

const findSelectId = (selector) => {
  if (typeof selector === 'function') {
    return predicateSelectorId;
  }
  if (typeof selector.select === 'function') {
    return selector.id;
  }
  return propertySelectorId;
};

const findTransform = (selector) => {
  if (typeof selector === 'function') {
    return transformPredicate;
  }
  if (typeof selector.transform === 'function') {
    return selector.transform;
  }
  return transformProperty;
};

// export const createSelectFn = (path) => {
//   if (typeof path === 'string') {
//     path = [path];
//   }
//   invariant(Array.isArray(path), 'Path to select must be array or string.');
//   const reversedPath = path.slice(0).reverse();
//   return reversedPath.reduce((next, selector) => {
//     const selectThis = findSelect(selector);
//     return (subObject) => selectThis(selector, subObject, next);
//   }, wrapInArray);
// };

const selectFnCache = [];

const emptyPath = [];

const ensureArrayPath = (path) => {
  if (path == null) {
    return emptyPath;
  }
  if (typeof path !== 'object' || typeof path.length !== 'number') {
    return [path];
  }
  return path;
};

const createCachedSelectFn = (path) => {
  // if (typeof path === 'string') {
  //   path = [path];
  // }
  //invariant(Array.isArray(path), 'Path to select must be array or string.');
  //
  //path = ensureArrayPath(path);
  if (path == null) {
    path = emptyPath;
  }
  if (typeof path !== 'object' || typeof path.length !== 'number') {
    path = [path];
  }
  const length = path.length;
  var pathIndex;
  var cache = selectFnCache;
  var nextCache, selectorId;
  for (pathIndex = 0; pathIndex < length; pathIndex++) {
    selectorId = findSelectId(path[pathIndex]);
    nextCache = cache[selectorId];
    if (!nextCache) {
      nextCache = [];
      cache[selectorId] = nextCache;
    }
    cache = nextCache;
  }

  if (cache[cacheSelectorId]) {
    return cache[cacheSelectorId];
  }

  const reversedPath = path.slice(0).reverse();
  const selectFn = reversedPath.reduce((next, selector, i) => {
    const selectThis = findSelect(selector);
    //return (subObject, _path) => console.log(selector, _path, _path[length - 1 - i]) || selectThis(_path[i], subObject, (nextSubObject) => next(nextSubObject, _path));
    //return (subObject, _path) => selectThis(selector, subObject, next);
    return (subObject, _path) => selectThis(_path[length - 1 - i], subObject, next, _path);
  }, wrapInArray);
  cache[cacheSelectorId] = selectFn;
  return selectFn;
};

export const createSelectFn = (path) => {
  const selectFn = createCachedSelectFn(path);
  return (object) => selectFn(object, path);
};

const select = (path, object) => {
  const selectFn = createCachedSelectFn(path);
  return selectFn(object, path);
};

const transform = (path, modifyOrValue, object) => {
  if (typeof path === 'string') {
    path = [path];
  }
  const modify = typeof modifyOrValue === 'function' ? modifyOrValue : () => modifyOrValue;
  invariant(Array.isArray(path), 'Path to select must be array or string.');
  const reversedPath = path.slice(0).reverse();
  const transformFn = reversedPath.reduce((next, selector) => {
    const transformThis = findTransform(selector);
    return (subObject) => transformThis(selector, subObject, next);
  }, modify);
  return transformFn(object);
};

export default select;
