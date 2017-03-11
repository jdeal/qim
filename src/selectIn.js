import {selectKey, navigatorRef} from './createNavigator';
import none from './utils/none';
import {curry2} from './utils/curry';

let continueSelectEach;

export const selectEach = (state, resultFn, path, object, pathIndex) => {
  if (pathIndex >= path.length) {
    return resultFn(state, object);
  }
  const nav = path[pathIndex];
  if (!nav || typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
    if (object && typeof object === 'object') {
      const subObject = object[nav];
      if (typeof subObject === 'undefined' && !(nav in object)) {
        return none;
      }
      return selectEach(state, resultFn, path, subObject, pathIndex + 1);
    } else {
      return none;
      //return resultFn(state, undefined);
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
  return continueSelectEach(state, resultFn, selectFn, nav, object, path, pathIndex);
};

continueSelectEach = (state, resultFn, selectFn, nav, object, path, pathIndex) =>
  selectFn(nav, object, (subObject) => selectEach(state, resultFn, path, subObject, pathIndex + 1));

const selectInResultFn = (state, result) => {
  state.push(result);
  return state;
};

const selectIn = (path, object) => {
  if (!path || typeof path !== 'object' || typeof path.length !== 'number') {
    path = [path];
  }
  const result = [];
  selectEach(result, selectInResultFn, path, object, 0);
  return result;
};

export default curry2(selectIn);
