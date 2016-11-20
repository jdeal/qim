import invariant from 'invariant';

const select = (path, object) => {
  invariant(Array.isArray(path), 'Path to select must be an array.');
  if (path.length === 0) {
    return [object];
  }
  const selector = path[0];
  const remaining = path.slice(1);
  // select property
  if (typeof selector === 'string') {
    if (object == null) {
      return [undefined];
    }
    const child = object[selector];
    if (child == null) {
      return [child];
    }
    return select(remaining, child);
  // select predicate
  } else if (typeof selector === 'function') {
    if (selector(object)) {
      return select(remaining, object);
    }
    return [];
  // select custom
  } else if (selector && typeof selector.select === 'function') {
    return selector.select(object, remaining, select);
  }
  throw new Error('invalid selector');
};

export default select;
