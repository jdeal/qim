class ArrayWrapper {
  constructor(source) {
    this._source = source;
  }
  get(i) {
    return this._source[i];
  }
}

const createArrayWrapper = (source) => {
  if (Array.isArray(source)) {
    return new ArrayWrapper(source);
  }
  throw new Error('problem');
};

class Wrapper {
  constructor(source) {
    this._source = source;
    this._get = undefined;
  }
  get(i) {
    if (this._get === undefined) {
      if (Array.isArray(this._source)) {
        this._get = this._getIndex;
      }
    }
    return this._get(i);
  }
  _getIndex(i) {
    return this._source[i];
  }
}

const createWrapper = (source) => new Wrapper(source);

class WrapperRewrite {
  constructor(source) {
    this._source = source;
  }
  get(i) {
    if (Array.isArray(this._source)) {
      this.get = this._getIndex;
    }
    return this.get(i);
  }
  _getIndex(i) {
    return this._source[i];
  }
}

const createWrapperRewrite = (source) => new WrapperRewrite(source);

const array = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default [
  {
    name: 'check first',
    test: () => {
      const wrapper = createArrayWrapper(array);
      for (let i = 0; i < array.length; i++) {
        const value = wrapper.get(i);
      }
    }
  },
  {
    name: 'check each',
    test: () => {
      const wrapper = createWrapper(array);
      for (let i = 0; i < array.length; i++) {
        const value = wrapper.get(i);
      }
    }
  },
  {
    name: 'check each with rewrite',
    test: () => {
      const wrapper = createWrapperRewrite(array);
      for (let i = 0; i < array.length; i++) {
        const value = wrapper.get(i);
      }
    }
  }
];
