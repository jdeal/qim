import {updateEach} from './updateIn';
import {curry3} from './utils/curry';
import push from './push';

const pushIn = (path, value, obj) => updateEach(push(value), path, obj, 0);

export default curry3(pushIn);
