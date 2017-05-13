import {$noneKey} from '../$none';
import {$setKey} from '../$set';

// Special purpose utility to look at the current path and index and determine
// if the next navigator is a constant value. This is so a navigator can
// "cheat" a little and lookahead to determine if its value will actually be
// used. If not, the navigator can avoid calculating its own value.
export default (path, index) => {
  if (index + 1 < path.length) {
    const nextNav = path[index + 1];
    if (nextNav) {
      const navKey = nextNav['@@qim/nav'];
      if (navKey === $noneKey || navKey === $setKey) {
        return true;
      }
    }
  }
  return false;
};
