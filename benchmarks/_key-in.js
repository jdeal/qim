const stuff = {
  foo: 'bar'
};

const key = 'foo';

const baselineBoolean = true;

export default [
  {
    name: 'baseline boolean',
    test: () => baselineBoolean ? 1 : 0
  },
  {
    name: 'key in stuff',
    test: () => (
      key in stuff ? 1 : 0
    )
  },
  {
    name: 'short circuit with boolean',
    test: () => (
      baselineBoolean || key in stuff ? 1 : 0
    )
  }
];
