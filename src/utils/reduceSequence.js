import {isReduced} from './reduced';

const reduceSequence = (eachFn, initialValue, seq) => {
  let result = initialValue;
  if (Array.isArray(seq)) {
    for (let i = 0; i < seq.length; i++) {
      result = eachFn(result, i);
      if (isReduced(result)) {
        return result;
      }
    }
  } else if (seq !== null && typeof seq === 'object') {
    for (let key in seq) {
      if (seq.hasOwnProperty(key)) {
        result = eachFn(result, key);
        if (isReduced(result)) {
          return result;
        }
      }
    }
  } else {
    throw new Error('iteration not supported for ' + seq);
  }
  return result;
};

export default reduceSequence;
