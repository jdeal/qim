import objectAssign from 'object-assign';

import {transformKey} from '../createSelector';

const identity = (value) => value;

const transformProperty = (key, object, next) => {
  if (!object || typeof object !== 'object') {
    return object;
  }
  const value = object[key];
  const newValue = next(object[key]);
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

export const createCachedTransform = (path) => {
  const reversedPath = path.slice(0).reverse();
  const transformFn = reversedPath.reduce((next, selector) => {
    const transformThis = findTransform(selector);
    return (subObject) => transformThis(selector, subObject, next);
  }, identity);
  return transformFn;
};

const transform = (path, object) => {
  const reversedPath = path.slice(0).reverse();
  const transformFn = reversedPath.reduce((next, selector) => {
    const transformThis = findTransform(selector);
    return (subObject) => transformThis(selector, subObject, next);
  }, identity);
  return transformFn(object);
};

export default transform;
