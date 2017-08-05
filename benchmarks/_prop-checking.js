const stuff = {
  foo: 'bar'
};

const get = (key, obj) => obj[key];

const key = 'foo';
const missingKey = 'bar';

const hasDefined = (key, obj) => typeof obj[key] !== 'undefined';

const safeGet = (key, obj) => typeof obj[key] === 'undefined' ? undefined : obj[key];

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
  },
  {
    name: 'typeof stuff[missingKey]',
    test: () => {
      const hasMissing = typeof stuff[missingKey] !== 'undefined';
    }
  },
  {
    name: 'hasDefined(missingKey, stuff)',
    test: () => {
      const hasMissing = hasDefined(missingKey, stuff);
    }
  },
  {
    name: 'safeGet(missingKey, stuff)',
    test: () => {
      const bar = safeGet(missingKey, stuff);
    }
  }
];
