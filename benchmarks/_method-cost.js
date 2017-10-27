const plainWrapper = {
  _value: 1
};

const getValue = (wrapper) => wrapper._value;

const plainObjectWithMethod = {
  value() {
    return this._value;
  },
  _value: 1
};

const Wrapper = function() {
  this._value = 1;
};

Wrapper.prototype.value = function () {
  return this._value;
};

const wrapperFromClass = new Wrapper();

const spec = {
  value: (wrapper) => wrapper._value
};

const wrapperWithSpec = {
  __spec__: spec,
  _value: 1
};

const WrapperWithSpec = function () {
  this._value = 1;
  this._spec = spec;
};

const getSpec = (wrapper) => wrapper._spec;

WrapperWithSpec.prototype.value = function () {
  const getValueWithSpec = getSpec(this).value;
  return getValueWithSpec(this);
};

const wrapperWithSpecFromClass = new WrapperWithSpec();

const LazyWrapper = function () {
  this._value = 1;
};

const getValueOfThis = function () {
  return this._value;
};

const THING_TYPE = 'thing';

const lookupMethod = {
  [THING_TYPE]: {
    valueAfterLookup: getValueOfThis
  }
};

LazyWrapper.prototype.value = function () {
  this.value = getValueOfThis;
  return this.value();
};

const setMethod = (wrapper, methodKey) => {
  if (wrapper._type === undefined) {
    wrapper._type = THING_TYPE;
  }
  wrapper[methodKey] = lookupMethod[wrapper._type][methodKey];
};

LazyWrapper.prototype.valueAfterLookup = function () {
  setMethod(this, 'valueAfterLookup');
  return this.valueAfterLookup();
};

const lazyWrapper = new LazyWrapper();

const LazyWrapperWithMethodClosure = function () {
  this._value = 1;
};

['valueAfterLookup'].forEach((name) => {
  LazyWrapperWithMethodClosure.prototype[name] = function (a, b, c) {
    setMethod(this, name);
    return this[name](a, b, c);
  };
});

const lazyWrapperWithMethodClosure = new LazyWrapperWithMethodClosure();

const thePrototype = {
  value() {
    return this._value;
  }
};

const LazyPrototypeWrapper = function () {
  this._value = 1;
};

LazyPrototypeWrapper.prototype.value = function () {
  Object.setPrototypeOf(this, thePrototype);
  return this.value();
};

const lazyPrototypeWrapper = new LazyPrototypeWrapper();

export default [
  {
    name: 'wrapper with spec',
    test: () => {
      const getValueWithSpec = wrapperWithSpec.__spec__.value;
      return getValueWithSpec(wrapperWithSpec);
    }
  },
  {
    name: 'wrapper with spec from class',
    test: () => (
      wrapperWithSpecFromClass.value()
    )
  },
  {
    name: 'lazy wrapper with lookup',
    test: () => (
      lazyWrapper.valueAfterLookup()
    )
  },
  {
    name: 'lazy wrapper with lookup, method in closure',
    test: () => (
      lazyWrapperWithMethodClosure.valueAfterLookup()
    )
  }
  /*
  {
    name: 'plain wrapper property',
    test: () => (
      plainWrapper._value
    )
  },
  {
    name: 'plain wrapper',
    test: () => (
      getValue(plainWrapper)
    )
  },
  {
    name: 'plain object with method',
    test: () => (
      plainObjectWithMethod.value()
    )
  },
  {
    name: 'wrapper from class',
    test: () => (
      wrapperFromClass.value()
    )
  },
  {
    name: 'wrapper with spec',
    test: () => (
      wrapperWithSpec.__spec__.value(wrapperWithSpec)
    )
  },
  {
    name: 'wrapper with direct spec',
    test: () => (
      spec.value(plainWrapper)
    )
  },
  {
    name: 'wrapper with direct spec const',
    test: () => {
      const getValueWithSpec = spec.value;
      return getValueWithSpec(plainWrapper);
    }
  },
  {
    name: 'wrapper with spec from class',
    test: () => (
      wrapperWithSpecFromClass.value()
    )
  },
  {
    name: 'lazy wrapper',
    test: () => (
      lazyWrapper.value()
    )
  },
  {
    name: 'lazy wrapper with lookup',
    test: () => (
      lazyWrapper.valueAfterLookup()
    )
  },
  {
    name: 'lazy proto wrapper',
    test: () => (
      lazyPrototypeWrapper.value()
    )
  }
  */
];
