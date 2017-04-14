import {$noneKey} from '../$none';
import {$setKey} from '../$set';

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
