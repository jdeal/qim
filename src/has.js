import {traverseEach} from './traverse';
import {selectKey} from './$traverse';
import reduced from './utils/reduced';
import {curry2} from './utils/curry';

// has is like a find, but we mark the result as found, since we need to
// differentiate between undefined and not found.
const selectFirstResultFn = (state, result) => {
  state['@@transducer/value'] = result;
  state.isFound = true;
  return state;
};

const has = (path, object) => {
  if (path == null) {
    return undefined;
  }
  if (typeof path.length !== 'number') {
    path = [path];
  }
  const state = reduced(undefined);
  state.isFound = false;
  traverseEach(selectKey, state, selectFirstResultFn, path, object, 0);
  return state.isFound;
};

export default curry2(has);
