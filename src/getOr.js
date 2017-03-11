import {curry3} from './utils/curry';

const getOr = (defaultValue, key, obj) => {
  if (obj == null) {
    return defaultValue;
  }

  obj = obj[key];

  if (typeof obj === 'undefined') {
    return defaultValue;
  }

  return obj;
};

export default curry3(getOr);
