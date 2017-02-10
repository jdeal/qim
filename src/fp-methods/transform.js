import objectAssign from 'object-assign';

import {transformKey, idKey, getNextSelectorId} from '../createSelector';

const emptyPath = [];

const selectFnCache = [];

const cacheSelectorId = getNextSelectorId();
const propertySelectorId = getNextSelectorId();

const findSelectorId = (selector) => {
  if (selector && typeof selector === 'object') {
    if (selector[transformKey]) {
      return selector[idKey];
    }
    const childSelector = selector[0];
    if (childSelector && childSelector[transformKey]) {
      return childSelector[idKey];
    }
  }
  return propertySelectorId;
};

const identity = (value) => value;

const transformProperty = (key, object, next, path) => {
  if (!object || typeof object !== 'object') {
    return object;
  }
  const value = object[key];
  const newValue = next(path, object[key]);
  if (value === newValue) {
    return object;
  }
  return objectAssign({}, object, {[key]: newValue});
};

const findTransform = (selector) => {
  // if (typeof selector === 'function') {
  //   return selectPredicate;
  // }
  if (selector && typeof selector === 'object') {
    if (selector[transformKey]) {
      return selector[transformKey];
    }
    const childSelector = selector[0];
    if (childSelector && childSelector[transformKey]) {
      return childSelector[transformKey];
    }
  }
  return transformProperty;
};

const createCachedTransformFn = (path) => {
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
    var selector = path[pathIndex];

    if (typeof selector === 'string') {
      selectorId = propertySelectorId;
    } else if (selector) {
      if (selector[transformKey]) {
        selectorId = selector[idKey];
      } else {
        var childSelector = selector[0];
        if (childSelector && childSelector[transformKey]) {
          selectorId = childSelector[idKey];
        } else {
          throw new Error('selector not supported');
        }
      }
    } else {
      throw new Error('selector not supported');
    }

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
  const transformFn = reversedPath.reduce((next, _selector, i) => {
    const transformThis = findTransform(_selector);
    //return (subObject, _path) => console.log(selector, _path, _path[length - 1 - i]) || selectThis(_path[i], subObject, (nextSubObject) => next(nextSubObject, _path));
    //return (subObject, _path) => selectThis(selector, subObject, next);
    return (_path, subObject) => transformThis(_path[length - 1 - i], subObject, next, _path);
  }, identity);
  cache[cacheSelectorId] = transformFn;
  return transformFn;
};

const transform = (path, object) => {
  const transformFn = createCachedTransformFn(path);
  return transformFn(path, object);
};

export const createCachedTransform = (path) => {
  const transformFn = createCachedTransformFn(path);
  return (object) => transformFn(path, object);
};

export default transform;
