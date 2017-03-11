import {curry2} from './utils/curry';

const push = (item, array, hasMutation) => {
  if (!Array.isArray(array)) {
    throw new Error('can only push onto array');
  }

  if (hasMutation !== true) {
    array = array.slice(0);
  }

  array.push(item);

  return array;
};

export default curry2(push);
