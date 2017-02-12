import {selectKey, navigatorRef} from './createNavigator';

const selectEach = (path, object, pathIndex) => {
  if (pathIndex >= path.length) {
    return [object];
  }
  const nav = path[pathIndex];
  if (!nav || typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
    if (object && typeof object === 'object') {
      return selectEach(path, object[nav], pathIndex + 1);
    } else {
      return selectEach(path, undefined, pathIndex + 1);
    }
  }
  if (typeof nav === 'function') {
    if (nav(object)) {
      return selectEach(path, object, pathIndex + 1);
    } else {
      return [];
    }
  }
  let selectFn;
  if (nav[selectKey]) {
    selectFn = nav[selectKey];
  } else {
    if (nav[0] === navigatorRef) {
      const childSelector = nav[1];
      if (childSelector && childSelector[selectKey]) {
        selectFn = childSelector[selectKey];
      }
    }
  }
  if (!selectFn) {
    throw new Error(`invalid navigator at path index ${pathIndex}`);
  }
  return selectFn(nav, object, path, pathIndex, selectEach);
};

const select = function (path, object) {
  if (!path || typeof path !== 'object' || typeof path.length !== 'number') {
    path = [path];
  }
  if (arguments.length > 1) {
    return selectEach(path, object, 0);
  } else if (arguments.length === 1) {
    return (_object) => {
      return selectEach(path, _object, 0);
    };
  }
  return select;
};

export default select;
