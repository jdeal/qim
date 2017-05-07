import {selectKey} from './createNavigator';
import {curry2} from './utils/curry';
import arrayify from './utils/arrayify';
import {traverseEach} from './traverse';

const selectResultFn = (state, result) => {
  state.push(result);
  return state;
};

const select = (path, object) => {
  if (path == null) {
    return object;
  }
  path = arrayify(path);
  const result = [];
  traverseEach(selectKey, result, selectResultFn, path, object, 0);
  return result;
};

export default curry2(select);
