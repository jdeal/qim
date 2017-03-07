import {updateEach} from './updateIn';

function isInt(value) {
  var x;
  return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x); // eslint-disable-line no-return-assign
}

const setIn = (path, value, obj) => {
  let newObj = obj;
  let isModified;
  let subObj = obj;
  let length = path.length;

  if (path == null || typeof path !== 'object' || typeof length !== 'number') {
    throw new TypeError('setIn requires array-like object for path');
  }

  if (length === 0) {
    return value;
  }

  // If our object isn't actually an object, let's just bail now, because we
  // can't actually set any properties on a non-object.
  if (obj == null || typeof obj !== 'object') {
    return obj;
  }

  let nextKey = path[0];

  if (nextKey && typeof nextKey !== 'string' && typeof nextKey !== 'number' && typeof nextKey !== 'boolean') {
    return updateEach(() => value, path, obj, 0);
  }

  for (let pathIndex = 0; pathIndex < length; pathIndex++) {
    const key = nextKey;
    let nextObj = subObj[key];
    let isLast;
    if (pathIndex === length - 1) {
      if (nextObj === value && key in subObj) {
        return newObj;
      }
      isLast = true;
    } else {
      isLast = false;
      nextKey = path[pathIndex + 1];
      if (nextKey && typeof nextKey !== 'string' && typeof nextKey !== 'number' && typeof nextKey !== 'boolean') {
        value = updateEach(() => value, path, nextObj, pathIndex + 1);
        length = pathIndex + 1;
        pathIndex--;
        nextKey = key;
        continue;
      }
    }
    if (isLast || nextObj == null || typeof nextObj !== 'object') {
      // If we haven't yet modified this object, we need to clone all objects
      // up to this point.
      if (!isModified) {
        // Point newObj to a clone of the root.
        if (Array.isArray(obj)) {
          newObj = obj.slice(0);
        } else {
          newObj = {
            ...obj
          };
        }
        subObj = newObj;
        // Walk through all keys up to this point.
        for (let pathSetIndex = 0; pathSetIndex < pathIndex; pathSetIndex++) {
          const setKey = path[pathSetIndex];
          // Clone this child object.
          if (Array.isArray(subObj[setKey])) {
            subObj[setKey] = subObj[setKey].slice(0);
          } else {
            subObj[setKey] = {
              ...subObj[setKey]
            };
          }
          // Point ot the next object.
          subObj = subObj[setKey];
        }
        // Flag as being modified now.
        isModified = true;
      }
      if (isLast) {
        subObj[key] = value;
        return newObj;
      }
      // Make a new child object. Try to be smart about whether it should be an
      // array or object.
      if (isInt(nextKey)) {
        subObj[key] = [];
      } else {
        subObj[key] = {};
      }

      // The next object is the new child object.
      nextObj = subObj[key];
    }
    // Point to the next object.
    subObj = nextObj;
  }

  // Shouldn't actually be reached, just to make the linter happy.
  return newObj;
};

export default setIn;
