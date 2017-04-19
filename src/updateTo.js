import {updateEach} from './update';
import {curry3} from './utils/curry';
import {undefinedIfNone} from './$none';

const updateTo = (path, value, obj) => {

  if (!path || typeof path !== 'object') {
    if (obj == null || typeof obj !== 'object') {
      return obj;
    }

    if (obj[path] === value) {
      return obj;
    }

    if (Array.isArray(obj)) {
      obj = obj.slice(0);
    } else {
      obj = {...obj};
    }

    obj[path] = value;

    return obj;
  }

  path = Array.isArray(path) ? path : [path];

  return undefinedIfNone(updateEach(path, obj, 0, () => value));
};

export default curry3(updateTo);
