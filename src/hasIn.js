import {selectEach} from './selectIn';
import reduced, {unreduced} from './utils/reduced';
import {curry2} from './utils/curry';
import {isNone} from './utils/none';

const selectOneResultFn = (state, result) => {
  return reduced(result);
};

const hasIn = (path, obj) => {

  let pathIndex = 0;
  let key;
  let parentObj;

  if (path == null || typeof path !== 'object' || typeof path.length !== 'number') {
    throw new TypeError('hasIn requires array-like object for path');
  }

  while (pathIndex < path.length) {
    if (obj == null) {
      return false;
    }
    key = path[pathIndex];
    if (key && typeof key !== 'string' && typeof key !== 'number' && typeof key !== 'boolean') {
      const selectResult = unreduced(selectEach(null, selectOneResultFn, path, obj, pathIndex));
      return isNone(selectResult) ? false : true;
    }
    parentObj = obj;
    obj = obj[key];
    pathIndex++;
  }

  if (typeof obj === 'undefined') {
    if (path.length === 0) {
      return true;
    }
    if (!(key in parentObj)) {
      return false;
    }
  }

  return true;
};

export default curry2(hasIn);
