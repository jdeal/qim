import {updateEach} from './update';
import {curry3} from './utils/curry';
import $nav from './$nav';
import $apply from './$apply';
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

  return undefinedIfNone(updateEach([$nav(path), $apply(() => value)], obj, 0));
};

export default curry3(updateTo);
