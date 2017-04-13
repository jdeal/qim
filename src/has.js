import {selectEach} from './select';
import reduced, {unreduced} from './utils/reduced';
import {curry2} from './utils/curry';
import {isNone} from './$none';

const selectOneResultFn = (state, result) => {
  return reduced(result);
};

const has = (path, obj) => {

  let pathIndex = 0;
  let key;
  let parentObj;

  if (path == null || typeof path !== 'object' || typeof path.length !== 'number') {
    throw new TypeError('hasIn requires array-like object for path');
  }

  while (pathIndex < path.length) {
    key = path[pathIndex];
    if (key && typeof key !== 'string' && typeof key !== 'number' && typeof key !== 'boolean') {
      let selectResult = selectEach(null, selectOneResultFn, path, obj, pathIndex);
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
