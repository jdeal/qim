const stuff = {
  foo: 'bar'
};

const get = (key, obj) => obj[key];

const key = 'foo';
const missingKey = 'bar';

export default [
  {
    name: 'stuff[key]',
    test: () => {
      const foo = stuff[key];
    }
  },
  {
    name: 'stuff[missingKey]',
    test: () => {
      const bar = stuff[missingKey];
    }
  },
  {
    name: 'get(key, stuff)',
    test: () => {
      const foo = get(key, stuff);
    }
  },
  {
    name: 'get(missingKey, stuff)',
    test: () => {
      const bar = get(missingKey, stuff);
    }
  }
];
