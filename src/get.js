import invariant from 'invariant';

import exists from './exists';
import parseKeyPath from './parseKeyPath';

export const get = (thing, keys, defaultValue) => {
  let keyIndex = 0;

  if (!exists(keys)) {
    keys = [];
  } else if (typeof keys === 'string') {
    keys = parseKeyPath(keys);
  }

  invariant(Array.isArray(keys), 'get expects array or string for key path');

  while (keyIndex < keys.length && exists(thing)) {
    let key = keys[keyIndex];
    thing = thing[key];
    keyIndex++;
  }

  if (!exists(thing) && exists(defaultValue)) {
    return defaultValue;
  }

  return thing;
};

export default get;
