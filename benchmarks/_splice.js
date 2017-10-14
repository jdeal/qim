import _ from 'lodash';

const input = _.range(10000)
  .reduce((string) => string.concat('abcdefghijklmnopqrstuvwxyz0123456789'), '')
  .split('');

const arraySize = input.length;

const spliceSize = Math.floor(arraySize / 2);

const spliceBegin = Math.floor(arraySize / 4);

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

const take = (array, count) => array.slice(0, count);

const takeLast = (array, count) => array.slice(array.length - count, array.length);

const customSplice = (array, begin, count, ...items) => {
  const newArray = [];
  begin = normalizeIndex(begin, array.length, 0);
  for (let i = 0; i < begin; i++) {
    newArray.push(array[i]);
  }
  for (let i = 0; i < items.length; i++) {
    newArray.push(items[i]);
  }
  for (let i = begin + count; i < array.length; i++) {
    newArray.push(array[i]);
  }
  return newArray;
};

class SliceIterator {
  constructor(array, begin, end) {
    this.array = array;
    this.index = begin - 1;
    this.end = end;
  }
  next() {
    if (this.end - 1 === this.index) {
      return {
        value: undefined,
        done: true
      };
    }
    this.index++;
    return {
      value: this.array[this.index],
      done: false
    };
  }
}

const customSpliceWithIterator = (array, begin, count, ...items) => {
  const newArray = [];
  begin = normalizeIndex(begin, array.length, 0);
  let iter = new SliceIterator(array, 0, begin);
  let next = iter.next();
  while (!next.done) {
    newArray.push(next.value);
    next = iter.next();
  }
  for (let i = 0; i < items.length; i++) {
    newArray.push(items[i]);
  }
  iter = new SliceIterator(array, begin + count, array.length);
  next = iter.next();
  while (!next.done) {
    newArray.push(next.value);
    next = iter.next();
  }
  return newArray;
};

class Slice {
  constructor(array, begin, end) {
    this.array = array;
    this.begin = begin;
    this.end = end;
  }
  forEach(fn) {
    for (let i = this.begin; i < this.end; i++) {
      fn(this.array[i]);
    }
  }
}

const customSpliceWithEach = (array, begin, count, ...items) => {
  const newArray = [];
  begin = normalizeIndex(begin, array.length, 0);
  const frontSlice = new Slice(array, 0, begin);
  frontSlice.forEach((value) => {
    newArray.push(value);
  });
  for (let i = 0; i < items.length; i++) {
    newArray.push(items[i]);
  }
  const backSlice = new Slice(array, begin + count, array.length);
  backSlice.forEach((value) => {
    newArray.push(value);
  });
  return newArray;
};

class SliceApply {
  constructor(array, begin, end) {
    this.array = array;
    this.begin = begin;
    this.end = end;
  }
  forEach(fn, thisArg) {
    for (let i = this.begin; i < this.end; i++) {
      fn.call(thisArg, this.array[i]);
    }
  }
}

class ArrayForEachPush {
  constructor(array) {
    this.array = array;
  }
  push(value) {
    this.array.push(value);
  }
}

const customSpliceWithEachThis = (array, begin, count, ...items) => {
  const newArray = [];
  begin = normalizeIndex(begin, array.length, 0);
  const frontSlice = new SliceApply(array, 0, begin);
  const pusher = new ArrayForEachPush(newArray);
  frontSlice.forEach(pusher.push, pusher);
  for (let i = 0; i < items.length; i++) {
    newArray.push(items[i]);
  }
  const backSlice = new SliceApply(array, begin + count, array.length);
  backSlice.forEach(pusher.push, pusher);
  return newArray;
};

class Wrapper {
  constructor(array) {
    this.array = array;
  }
  get(index) {
    return this.array[index];
  }
  count() {
    return this.array.length;
  }
}

const customSpliceWithWrapper = (array, begin, count, ...items) => {
  const newArray = [];
  begin = normalizeIndex(begin, array.length, 0);
  const wrapper = new Wrapper(array);
  for (let i = 0; i < begin; i++) {
    newArray.push(wrapper.get(i));
  }
  for (let i = 0; i < items.length; i++) {
    newArray.push(items[i]);
  }
  for (let i = begin + count; i < array.length; i++) {
    newArray.push(wrapper.get(i));
  }
  return newArray;
};

export default [
  {
    name: 'splice',
    test: () => (
      simpleSplice(input, spliceBegin, spliceSize, 'x', 'y')
    )
  },
  {
    name: 'take with concat',
    test: () => (
      take(input, spliceBegin).concat(['x', 'y']).concat(takeLast(input, input.length - (spliceBegin + spliceSize)))
    )
  },
  {
    name: 'clone and push',
    test: () => (
      customSplice(input, spliceBegin, spliceSize, 'x', 'y')
    )
  },
  {
    name: 'clone and push with iterator',
    test: () => (
      customSpliceWithIterator(input, spliceBegin, spliceSize, 'x', 'y')
    )
  },
  {
    name: 'clone and push with forEach',
    test: () => (
      customSpliceWithEach(input, spliceBegin, spliceSize, 'x', 'y')
    )
  },
  {
    name: 'clone and push with forEach with this',
    test: () => (
      customSpliceWithEachThis(input, spliceBegin, spliceSize, 'x', 'y')
    )
  },
  {
    name: 'clone and push with wrapper',
    test: () => (
      customSpliceWithWrapper(input, spliceBegin, spliceSize, 'x', 'y')
    )
  }
];
