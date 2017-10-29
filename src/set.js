import {updateKey} from './$traverse';
import {traverseEach} from './traverse';
import {curry3} from './utils/curry';
import {undefinedIfNone, unwrap, getSpec} from './utils/data';

const set = (path, value, obj) => {

  // Optimized case for a single primitive key.
  if (!path || typeof path !== 'object') {
    const spec = getSpec(obj);
    const _set = spec.set;
    return _set(path, value, obj);
  }

  path = Array.isArray(path) ? path : [path];

  return undefinedIfNone(unwrap(traverseEach(updateKey, undefined, undefined, path, obj, 0, () => value)));
};

export default curry3(set);
