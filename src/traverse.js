import none from './none';
import createNavigator, {selectKey, navigatorRef} from './createNavigator';

export const $values = createNavigator({
  select: (nav, object, next) => {
    const values = Object.keys(object).map(key => object[key]);
    const results = values.map(item => next(item));
    return results.reduce((a, b) => a.concat(b), []);
  },
});

const traverseEach = (path, resultFn, object, pathIndex) => {
  if (pathIndex >= path.length) {
    return resultFn(object);
  }
  const nav = path[pathIndex];
  if (!nav || typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
    if (object && typeof object === 'object') {
      return traverseEach(path, resultFn, object[nav], pathIndex + 1);
    } else {
      return resultFn(undefined);
    }
  }
  if (typeof nav === 'function') {
    if (nav(object)) {
      return traverseEach(path, resultFn, object, pathIndex + 1);
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
  return selectFn(nav, object, (nextObject) => traverseEach(path, 2, nextObject, pathIndex + 1));
};

const traverse = (path, resultFn, object) => {
  if (!path || typeof path !== 'object' || typeof path.length !== 'number') {
    path = [path];
  }
  if (arguments.length > 1) {
    return traverseEach(path, resultFn, object, 0);
  } else if (arguments.length === 1) {
    return (_object) => {
      return traverseEach(path, resultFn, _object, 0);
    };
  }
  return traverse;
};

export default traverse;
