import {curry2} from '../curry';

const defaultTo = (defaultValue, obj) => {
  if (typeof obj === 'undefined') {
    return defaultValue;
  }

  return obj;
};

export default curry2(defaultTo);
