class EagerWrapper {
  constructor(source) {
    this._source = source;
  }
  value() {
    return this._source;
  }
}

const createEagerWrapper = (source) => {
  if (Array.isArray(source)) {
    return new EagerWrapper(source);
  }
  return new EagerWrapper(source);
};

class EagerAllWrapper {
  constructor(source) {
    this._source = source;
  }
  value() {
    return this._source;
  }
}

const createEagerAllWrapper = (source) => {
  if (Array.isArray(source)) {
    return new EagerAllWrapper(source);
  }
  if (typeof source === 'string') {
    return new EagerAllWrapper(source);
  }
  if (source == null || typeof source !== 'object') {
    throw new Error('not a sequence');
  }
  if (source[Symbol.iterator]) {
    return new EagerAllWrapper(source);
  }
  return new EagerAllWrapper(source);
};

class LazyWrapper {
  constructor(source) {
    this._source = source;
  }
  value() {
    return this._source;
  }
}

const createLazyWrapper = (source) => new LazyWrapper(source);

const object = {};

export default [
  {
    name: 'check really eager',
    test: () => (
      createEagerAllWrapper(object).value()
    )
  },
  {
    name: 'check eager',
    test: () => (
      createEagerWrapper(object).value()
    )
  },
  {
    name: 'check lazy',
    test: () => (
      createLazyWrapper(object).value()
    )
  }
];
