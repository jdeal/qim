function isInt(value) {
  var x;
  return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}

const setIn = (obj, path, modify) => {
  var newObj = obj, pathIndex, pathSetIndex, key, setKey, isModified, nextObj, nextKey;
  var subObj = obj;

  if (path == null || typeof path !== 'object' || typeof path.length !== 'number') {
    throw new TypeError('getIn requires array-like object for path');
  }

  if (obj == null || typeof obj !== 'object') {
    return obj;
  }

  for (pathIndex = 0; pathIndex < path.length - 1; pathIndex++) {
    key = path[pathIndex];
    nextObj = subObj[key];
    if (nextObj == null || typeof nextObj !== 'object') {
      nextKey = path[pathIndex + 1];
      if (!isModified) {
        if (Array.isArray(obj)) {
          newObj = obj.slice(0);
        } else {
          newObj = {
            ...obj
          };
        }
        subObj = newObj;
        for (pathSetIndex = 0; pathSetIndex < pathIndex; pathSetIndex++) {
          setKey = path[pathSetIndex];
          if (Array.isArray(subObj[setKey])) {
            subObj[setKey] = subObj[setKey].slice(0);
          } else {
            subObj[setKey] = {
              ...subObj[setKey]
            };
          }
          subObj = subObj[setKey];
        }
        isModified = true;
      }
      if (isInt(nextKey)) {
        subObj[key] = [];
      } else {
        subObj[key] = {};
      }
      nextObj = subObj[key];
    }
    subObj = nextObj;
  }

  var value, modifyIndex, currentModify;

  if (typeof modify === 'function') {
    value = modify(subObj[path[path.length - 1]]);
  } else if (typeof modify === 'object' && modify && typeof modify.length === 'number') {
    value = subObj[path[path.length - 1]];
    for (modifyIndex = 0; modifyIndex < modify.length; modifyIndex++) {
      currentModify = modify[modifyIndex];
      if (typeof currentModify === 'function') {
        value = currentModify(value);
      }
    }
  }

  if (subObj[path[path.length - 1]] === value) {
    return newObj;
  }

  if (!isModified) {
    if (Array.isArray(obj)) {
      newObj = obj.slice(0);
    } else {
      newObj = {
        ...obj
      };
    }
    subObj = newObj;
    for (pathSetIndex = 0; pathSetIndex < path.length - 1; pathSetIndex++) {
      setKey = path[pathSetIndex];
      if (Array.isArray(subObj[setKey])) {
        subObj[setKey] = subObj[setKey].slice(0);
      } else {
        subObj[setKey] = {
          ...subObj[setKey]
        };
      }
      subObj = subObj[setKey];
    }
    isModified = true;
  }

  subObj[path[path.length - 1]] = value;

  return newObj;
};

export default setIn;
