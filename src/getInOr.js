import {selectEach} from './selectIn';
import reduced, {unreduced} from './utils/reduced';
import {curry3} from './utils/curry';
import {isNone} from './utils/none';

const selectOneResultFn = (state, result) => {
  return reduced(result);
};

const getInOr = (defaultValue, path, obj) => {

  if (!path || typeof path !== 'object') {
    if (obj == null) {
      return defaultValue;
    }

    obj = obj[path];

    if (typeof obj === 'undefined') {
      return defaultValue;
    }

    return obj;
  }

  var pathIndex = 0, key;

  if (path == null || typeof path !== 'object' || typeof path.length !== 'number') {
    throw new TypeError('getIn requires array-like object for path');
  }

  while (pathIndex < path.length) {
    key = path[pathIndex];
    if (key && typeof key !== 'string' && typeof key !== 'number' && typeof key !== 'boolean') {
      const selectResult = unreduced(selectEach(null, selectOneResultFn, path, obj, pathIndex));
      return isNone(selectResult) ? undefined : selectResult;
    }
    if (obj == null) {
      obj = undefined;
      break;
    }
    obj = obj[key];
    pathIndex++;
  }

  if (typeof obj === 'undefined') {
    return defaultValue;
  }

  return obj;
};

export default curry3(getInOr);
