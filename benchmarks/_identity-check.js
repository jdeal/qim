const fooObject = {'@@qim/foo': true};

const fooSymbol = Symbol.for('@@qim/foo');

const fooObjectPointer = fooObject;

const fooSymbolPointer = fooSymbol;

const getSomethingBaseline = (flag) => {
  if (flag) {
    return 'foo';
  }
  return 'bar';
};

const getSomethingIdentity = (ptr) => {
  if (ptr === fooObject) {
    return 'foo';
  }
  return 'bar';
};

const getSomethingKey = (ptr) => {
  if (ptr && typeof ptr['@@qim/foo'] !== 'undefined') {
    return 'foo';
  }
  return 'bar';
};

const getSomethingSymbol = (ptr) => {
  if (ptr === fooSymbol) {
    return 'foo';
  }
  return 'bar';
};

export default [
  {
    name: 'baseline boolean',
    test: () => getSomethingBaseline(true)
  },
  {
    name: 'identity',
    test: () => getSomethingIdentity(fooObjectPointer)
  },
  {
    name: 'key check',
    test: () => getSomethingKey(fooObjectPointer)
  },
  {
    name: 'symbol identity',
    test: () => getSomethingSymbol(fooSymbolPointer)
  }
];
