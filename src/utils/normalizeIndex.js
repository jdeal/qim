const isNegativeZero = Object.is ?
  num => Object.is(num, -0) :
  num => (1 / num) === -Infinity;

const normalizeIndex = (index, count, defaultIndex) => {
  if (index === undefined) {
    return defaultIndex;
  }
  if (index < 0 || isNegativeZero(index)) {
    if (count === Infinity) {
      return count;
    }
    return Math.max(0, count + index) | 0;
  }
  if (count === undefined || count === index) {
    return index;
  }
  return Math.min(count, index) | 0;
};

export const normalizeEnd = (index, count) =>
  isNegativeZero(index) ? count : index;

export default normalizeIndex;
