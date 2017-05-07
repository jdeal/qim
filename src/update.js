import {updateKey} from './createNavigator';
import {curry2} from './utils/curry';
import arrayify from './utils/arrayify';
import {undefinedIfNone} from './$none';
import {traverseEach} from './traverse';

const update = (path, obj) => path == null ?
  obj :
  undefinedIfNone(traverseEach(updateKey, undefined, undefined, arrayify(path), obj, 0));

export default curry2(update);
