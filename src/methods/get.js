const get = (obj, key, defaultValue) => {
  if (obj == null || typeof obj !== 'object') {
    return defaultValue;
  }

  obj = obj[key];

  if (typeof obj === 'undefined') {
    return defaultValue;
  }

  return obj;
};

export default get;
