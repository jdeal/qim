import {traverseEach} from './traverse';
import {selectKey} from './$traverse';
import reduced, {unreduced} from './utils/reduced';
import {curry2} from './utils/curry';
import {isNone} from './utils/data';

// has uses the same reduced envelope as find.
const selectFirstResultFn = (state, result) => {
  return reduced(result);
};

const has = (path, obj) => {

  let pathIndex = 0;
  let key;
  let parentObj;

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
      let selectResult = traverseEach(selectKey, null, selectFirstResultFn, path, obj, pathIndex);
      if (typeof selectResult === 'undefined') {
        return false;
      }
      selectResult = unreduced(selectResult);
      return isNone(selectResult) ? false : true;
    }
    if (obj == null) {
      return false;
    }
    parentObj = obj;
    obj = obj[key];
    pathIndex++;
  }

  if (typeof obj === 'undefined') {
    if (path.length === 0) {
      return true;
    }
    if (!parentObj || typeof parentObj !== 'object' || !(key in parentObj)) {
      return false;
    }
  }

  return true;
};

export default curry2(has);
