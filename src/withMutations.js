import createMutable from './createMutable';

export const withMutations = (mutate, obj) => {
  if (typeof obj === 'undefined') {
    return otherObj => withMutations(mutate, otherObj);
  }
  const mutableObject = createMutable(obj);
  mutate(mutableObject);
  return mutableObject.value();
};
