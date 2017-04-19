import {updateEach} from './update';
import {curry3} from './utils/curry';
import $nav from './$nav';
import $apply from './$apply';
import {undefinedIfNone} from './$none';

const updateWith = (path, transform, obj) => {
  return undefinedIfNone(updateEach([$nav(path), $apply(transform)], obj, 0));
};

export default curry3(updateWith);
