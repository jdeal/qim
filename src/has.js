import {curry3} from './utils/curry';

const has = (key, obj) => {
  if (obj == null) {
    return false;
  }

  if (key in obj) {
    return true;
  }

  return false;
};

export default curry3(has);
