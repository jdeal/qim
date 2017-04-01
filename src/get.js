import {selectEach} from './select';
import reduced, {unreduced} from './utils/reduced';
import {curry2} from './utils/curry';
import {isNone} from './utils/none';

const selectOneResultFn = (state, result) => {
  return reduced(result);
};

const get = (path, obj) => {

  let pathIndex = 0;
  let key;

  if (!Array.isArray(path)) {
    path = [path];
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

  return obj;
};

export default curry2(get);
