import $nav from './$nav';
import getTypeErrorMessage from './utils/getTypeErrorMessage';

const $last = $nav(seq => {
  if (!seq || typeof seq !== 'object') {
    throw new Error(getTypeErrorMessage('$last', 'object', seq));
  }
  if (Array.isArray(seq)) {
    return [seq.length - 1];
  }
  const keys = Object.keys(seq);
  return keys[keys.length - 1];
});

export default $last;
