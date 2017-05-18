export const selectKey = '@@qim/navSelect';
export const updateKey = '@@qim/navUpdate';

const $traverse = (spec) => {
  if (typeof spec === 'function') {
    return {
      [selectKey]: (object, next, path, index) =>
        spec('select', object, next, path, index),
      [updateKey]: (object, next, path, index) =>
        spec('update', object, next, path, index)
    };
  }
  return {
    [selectKey]: spec.select,
    [updateKey]: spec.update
  };
};

export default $traverse;
