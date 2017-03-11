import {curry3} from './utils/curry';

const update = (key, modify, obj, hasMutation) => {
  if (obj == null || typeof obj !== 'object') {
    return obj;
  }

  const newValue = modify(obj[key]);

  if (obj[key] === newValue) {
    return obj;
  }

  if (hasMutation !== true) {
    if (Array.isArray(obj)) {
      obj = obj.slice(0);
    } else {
      obj = {...obj};
    }
  }

  obj[key] = newValue;

  return obj;
};

export default curry3(update);
