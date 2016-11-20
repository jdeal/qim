import invariant from 'invariant';
import objectAssign from 'object-assign';

const transform = (path, update, object) => {
  invariant(Array.isArray(path), 'Path to transform must be an array.');
  if (path.length === 0) {
    if (typeof update === 'function') {
      return update(object);
    }
    return update;
  }
  const selector = path[0];
  const remaining = path.slice(1);
  // transform property
  if (typeof selector === 'string') {
    if (!object || typeof object !== 'object') {
      return object;
    }
    const value = object[selector];
    const newValue = transform(remaining, update, object[selector]);
    if (value === newValue) {
      return object;
    }
    return objectAssign({}, object, {[selector]: newValue});
  // transform predicate
  } else if (typeof selector === 'function') {
    if (selector(object)) {
      return transform(remaining, update, object);
    }
    return object;
  // transform custom
  } else if (selector && typeof selector.select === 'function') {
    return selector.transform(object, remaining, update, transform);
  }
  throw new Error('invalid selector');
};

export default transform;
