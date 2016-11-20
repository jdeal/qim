import get from './get';

const exists = (thing, ...rest) => {

  if (rest.length > 0) {
    thing = get(thing, ...rest);
    return exists(thing);
  }

  return typeof thing !== 'undefined' && thing !== null;
};

export default exists;
