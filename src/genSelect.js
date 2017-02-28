import {selectKey, navigatorRef} from './createNavigator';
import none from './none';
import reduced, {Reduced, unreduced} from './reduced';

// const selectEach = (state, resultFn, path, object, pathIndex) => {
//   if (pathIndex >= path.length) {
//     return resultFn(state, object);
//   }
//   const nav = path[pathIndex];
//   if (!nav || typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
//     if (object && typeof object === 'object') {
//       return selectEach(state, resultFn, path, object[nav], pathIndex + 1);
//     } else {
//       return resultFn(state, undefined);
//     }
//   }
//   if (typeof nav === 'function') {
//     if (nav(object)) {
//       return selectEach(state, resultFn, path, object, pathIndex + 1);
//     } else {
//       return none;
//     }
//   }
//   let selectFn;
//   if (nav[selectKey]) {
//     selectFn = nav[selectKey];
//   } else {
//     if (nav[0] === navigatorRef) {
//       const childSelector = nav[1];
//       if (childSelector && childSelector[selectKey]) {
//         selectFn = childSelector[selectKey];
//       }
//     }
//   }
//   if (!selectFn) {
//     throw new Error(`invalid navigator at path index ${pathIndex}`);
//   }
//   return selectFn(nav, object, (nextObject) => selectEach(state, resultFn, path, nextObject, pathIndex + 1));
// };
//
// const selectResultFn = (state, result) => {
//   state.push(result);
//   return state;
// };
//
// const select = function (path, object) {
//   if (!path || typeof path !== 'object' || typeof path.length !== 'number') {
//     path = [path];
//   }
//   if (arguments.length > 1) {
//     return selectEach([], selectResultFn, path, object, 0);
//   } else if (arguments.length === 1) {
//     return (_object) => {
//       return selectEach([], selectResultFn, path, _object, 0);
//     };
//   }
//   return select;
// };
//
// const selectOneResultFn = (state, result) => {
//   return result;
// };
//
// export const selectOne = function (path, object) {
//   if (!path || typeof path !== 'object' || typeof path.length !== 'number') {
//     path = [path];
//   }
//   if (arguments.length > 1) {
//     return selectEach([], selectOneResultFn, path, object, 0);
//   } else if (arguments.length === 1) {
//     return (_object) => {
//       return selectEach([], selectOneResultFn, path, _object, 0);
//     };
//   }
//   return select;
// };
//
//
//

let doSelectFn;

const selectEach = (state, resultFn, path, object, pathIndex) => {
  if (pathIndex >= path.length) {
    return resultFn(state, object);
  }
  const nav = path[pathIndex];
  if (!nav || typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
    if (object && typeof object === 'object') {
      return selectEach(state, resultFn, path, object[nav], pathIndex + 1);
    } else {
      return resultFn(state, undefined);
    }
  }
  if (typeof nav === 'function') {
    if (nav(object)) {
      return selectEach(state, resultFn, path, object, pathIndex + 1);
    } else {
      return none;
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
  return doSelectFn(state, resultFn, selectFn, nav, object, path, pathIndex);
  //return selectFn(nav, object, (subObject) => selectEach(path, subObject, pathIndex + 1));
};

doSelectFn = (state, resultFn, selectFn, nav, object, path, pathIndex) =>
  selectFn(nav, object, (subObject) => selectEach(state, resultFn, path, subObject, pathIndex + 1));

const selectResultFn = (state, result) => {
  if (state.length === 0) {
    return [result];
  }
  state.push(result);
  return state;
};

const select = function (path, object) {
  if (!path || typeof path !== 'object' || typeof path.length !== 'number') {
    path = [path];
  }
  if (arguments.length > 1) {
    return selectEach([], selectResultFn, path, object, 0);
  } else if (arguments.length === 1) {
    return (_object) => {
      return selectEach([], selectResultFn, path, _object, 0);
    };
  }
  return select;
};

export const getInWithSelect = (path, obj) => {
  var pathIndex = 0, key;

  if (path == null || typeof path !== 'object' || typeof path.length !== 'number') {
    throw new TypeError('getIn requires array-like object for path');
  }

  while (pathIndex < path.length && obj !== null) {
    key = path[pathIndex];
    const isPrimitive = !key || typeof key === 'string' || typeof key === 'number' || typeof key === 'boolean';
    if (!isPrimitive) {
      return selectEach([], selectResultFn, path, obj, pathIndex)[0];
    }
    obj = obj[key];
    pathIndex++;
  }

  // if (typeof obj === 'undefined') {
  //   return defaultValue;
  // }

  return obj;
};

export default select;
