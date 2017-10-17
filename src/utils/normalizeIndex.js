const normalizeIndex = (index, count, defaultIndex) => {
  if (index === undefined) {
    return defaultIndex;
  }
  if (index < 0) {
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

export const normalizeIndexIfValid = (index, count) => {
  if (index === undefined || count === 0) {
    return undefined;
  }
  if (index >= 0) {
    if (count > index) {
      return index;
    }
  } else if (count >= -index) {
    return count + index;
  }
  return undefined;
};

export default normalizeIndex;
