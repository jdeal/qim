import {updateEach} from './updateIn';
import {curry3} from './utils/curry';

const setIn = (path, value, obj) => {

  if (!path || typeof path !== 'object') {
    if (obj == null || typeof obj !== 'object') {
      return obj;
    }

    if (obj[path] === value) {
      return obj;
    }

    //if (marker !== mutateMarker || sourceObj === obj) {
    if (Array.isArray(obj)) {
      obj = obj.slice(0);
    } else {
      obj = {...obj};
    }
    //}

    obj[path] = value;

    return obj;
  }

  return updateEach(() => value, path, obj, 0);
};

export default curry3(setIn);
