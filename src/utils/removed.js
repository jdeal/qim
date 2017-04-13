const removed = {
  '@@qim/removed': true
};

export default removed;

export const isRemoved = (value) =>
  value && value['@@qim/removed'];

export const isNotRemoved = (value) =>
  !value || !value['@@qim/removed'];
