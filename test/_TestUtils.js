import util from 'util';

import {isNone} from 'qim/src';

export const getType = (object) => {
  if (isNone(object)) {
    return '$none';
  }
  if (Array.isArray(object)) {
    return 'array';
  }
  if (object === null) {
    return 'null';
  }
  return typeof object;
};

export const valueToString = (object) => {
  if (isNone(object)) {
    return '$none';
  }
  return util.inspect(object);
};
