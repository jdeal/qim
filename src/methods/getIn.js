const getIn = (obj, path, defaultValue) => {
  var pathIndex = 0, key;

  if (path == null || typeof path !== 'object' || typeof path.length !== 'number') {
    throw new TypeError('getIn requires array-like object for path');
  }

  while (pathIndex < path.length && obj !== null) {
    key = path[pathIndex];
    obj = obj[key];
    pathIndex++;
  }

  if (typeof obj === 'undefined') {
    return defaultValue;
  }

  return obj;
};

export default getIn;
