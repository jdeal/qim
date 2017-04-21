import {updateEach} from './update';
import {curry3} from './utils/curry';
import {undefinedIfNone} from './$none';

const apply = (path, transform, obj) => {
  //return undefinedIfNone(updateEach([$nav(path), $apply(transform)], obj, 0));
  path = Array.isArray(path) ? path : [path];
  return undefinedIfNone(updateEach(path, obj, 0, transform));
};

export default curry3(apply);
