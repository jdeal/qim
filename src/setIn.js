import {updateEach} from './updateIn';
import {curry3} from './utils/curry';

const setIn = (path, value, obj) => updateEach(() => value, path, obj, 0);

export default curry3(setIn);
