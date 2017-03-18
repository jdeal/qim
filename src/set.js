import {curry3} from './utils/curry';
import mutateMarker from './utils/mutateMarker';

const set = (key, value, obj, sourceObj, marker) => {
  if (obj == null || typeof obj !== 'object') {
    return obj;
  }

  if (obj[key] === value) {
    return obj;
  }

  if (marker !== mutateMarker || sourceObj === obj) {
    if (Array.isArray(obj)) {
      obj = obj.slice(0);
    } else {
      obj = {...obj};
    }
  }

  obj[key] = value;

  return obj;
};

set['@@qim/canMutate'] = true;

export default curry3(set);
