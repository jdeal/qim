import $nav from './$nav';
import getTypeErrorMessage from './utils/getTypeErrorMessage';

const $first = $nav(seq => {
  if (!seq || typeof seq !== 'object') {
    throw new Error(getTypeErrorMessage('$first', 'object', seq));
  }
  if (Array.isArray(seq)) {
    return [0];
  }
  for (let key in seq) {
    if (seq.hasOwnProperty(key)) {
      return [key];
    }
  }
  return undefined;
});

export default $first;
