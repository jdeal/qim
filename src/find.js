import {traverseEach} from './traverse';
import {selectKey} from './$traverse';
import reduced, {unreduced} from './utils/reduced';
import {curry2} from './utils/curry';
import {isNone} from './$none';
import {getSpec} from './utils/data';

// find is a select that returns a "reduced" envelope as soon as it selects
// anything.
const selectFirstResultFn = (state, result) => {
  return reduced(result);
};

const find = (path, obj) => {

  let pathIndex = 0;
  let key;

  if (!Array.isArray(path)) {
    path = [path];
  }

  // We'll just use an optimized while loop as long as we have simple primitive
  // navigators.
  while (pathIndex < path.length) {
    key = path[pathIndex];
    // If we have a non-primitive navigator, we'll switch over to a generic
    // traverse.
    if (key && typeof key !== 'string' && typeof key !== 'number' && typeof key !== 'boolean') {
      const selectResult = unreduced(traverseEach(selectKey, null, selectFirstResultFn, path, obj, pathIndex));
      return isNone(selectResult) ? undefined : selectResult;
    }
    const spec = getSpec(obj);
    const _get = spec.get;
    if (spec.isNil) {
      obj = undefined;
      break;
    }
    obj = _get(key, obj);
    pathIndex++;
  }

  return obj;
};

export default curry2(find);
