import {traverseEach} from './traverse';
import {selectKey} from './$traverse';
import reduced from './utils/reduced';
import {curry2} from './utils/curry';

// find is a select that returns a "reduced" envelope as soon as it selects
// anything.
const selectFirstResultFn = (state, result) => {
  state['@@transducer/value'] = result;
  return state;
};

const find = (path, object) => {
  if (path == null) {
    return undefined;
  }
  if (typeof path.length !== 'number') {
    path = [path];
  }
  const state = reduced(undefined);
  traverseEach(selectKey, state, selectFirstResultFn, path, object, 0);
  return state['@@transducer/value'];
};

export default curry2(find);
