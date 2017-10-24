export const selectKey = '@@qim/navSelect';
export const updateKey = '@@qim/navUpdate';

const $traverse = (spec) => {
  if (typeof spec === 'function') {
    return {
      [selectKey](object, next, path, index) {
        return spec.call(this, 'select', object, next, path, index);
      },
      [updateKey](object, next, path, index) {
        return spec.call(this, 'update', object, next, path, index);
      }
    };
  }
  return {
    [selectKey]: spec.select,
    [updateKey]: spec.update
  };
};

export default $traverse;
