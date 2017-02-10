/*
import invariant from 'invariant';
import objectAssign from 'object-assign';
import isStringPath from './isStringPath';
import setIn from './methods/setIn';

const transform = (object, path, update) => {
  invariant(Array.isArray(path), 'Path to transform must be an array.');
  if (isStringPath) {
    if (typeof update !== 'function') {
      return setIn(object, path);
    }
  }
  if (path.length === 0) {
    if (typeof update === 'function') {
      return update(object);
    }
    return update;
  }
  const selector = path[0];
  const remaining = path.slice(1);
  // transform property
  if (typeof selector === 'string' || typeof selector === 'number') {
    if (!object || typeof object !== 'object') {
      return object;
    }
    const value = object[selector];
    const newValue = transform(object[selector], remaining, update);
    if (value === newValue) {
      return object;
    }
    return objectAssign({}, object, {[selector]: newValue});
  // transform predicate
  } else if (typeof selector === 'function') {
    if (selector(object)) {
      return transform(object, remaining, update);
    }
    return object;
  // transform custom
  } else if (selector && typeof selector.select === 'function') {
    return selector.transform(object, remaining, update, transform);
  }
  throw new Error('invalid selector');
};

export default transform;
*/
