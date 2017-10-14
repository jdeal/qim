const input = [];

input[1000000] = 'x';

const arraySize = input.length;

const spliceBegin = Math.floor(arraySize / 2);

const normalizeIndex = (index, count, defaultIndex) => {
  index = parseInt(index);
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

const simpleSplice = (array, begin, count, ...items) => {
  const newArray = array.slice(0);
  newArray.splice(begin, count, ...items);
  return newArray;
};

const customSplice = (array, begin, count, ...items) => {
  const newArray = [];
  begin = normalizeIndex(begin, array.length, 0);
  for (let i = 0; i < begin; i++) {
    const value = array[i];
    if (value === undefined) {
      if (i in array) {
        newArray.push(value);
        continue;
      }
      newArray.length = newArray.length + 1;
      continue;
    }
    newArray.push(value);
  }
  for (let i = 0; i < items.length; i++) {
    newArray.push(items[i]);
  }
  for (let i = begin + count; i < array.length; i++) {
    const value = array[i];
    if (value === undefined) {
      if (i in array) {
        newArray.push(value);
        continue;
      }
      newArray.length = newArray.length + 1;
      continue;
    }
    newArray.push(value);
  }
  return newArray;
};

export default [
  {
    name: 'splice',
    test: () => (
      simpleSplice(input, spliceBegin, 1)
    )
  },
  {
    name: 'custom splice',
    test: () => (
      customSplice(input, spliceBegin, 1)
    )
  }
];
