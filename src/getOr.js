import get from './get';

const getOr = (defaultValue, key, obj) => {
  obj = get(key, obj);

  if (typeof obj === 'undefined') {
    return defaultValue;
  }

  return obj;
};

export default getOr;
