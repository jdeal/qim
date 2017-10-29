import {updateKey} from './$traverse';
import {traverseEach} from './traverse';
import {curry3} from './utils/curry';
import {undefinedIfNone} from './utils/data';

const apply = (path, transform, obj) => {
  path = Array.isArray(path) ? path : [path];
  return undefinedIfNone(
    traverseEach(updateKey, undefined, undefined, path, obj, 0, transform)
  );
};

export default curry3(apply);
