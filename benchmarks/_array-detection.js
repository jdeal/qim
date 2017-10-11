const array = [];

export default [
  {
    name: 'Array.isArray',
    test: () => (
      Array.isArray(array)
    )
  },
  {
    name: '.length + Array.isArray',
    test: () => (
      array != null && typeof array.length === 'number' && Array.isArray(array)
    )
  },
  {
    name: 'instanceof Array',
    test: () => (
      array instanceof Array
    )
  },
  {
    name: 'has length',
    test: () => (
      array != null && typeof array.length === 'number'
    )
  },
  {
    name: 'has length + has splice',
    test: () => (
      array !== null && typeof array === 'object' && typeof array.length === 'number' && typeof array.splice === 'function'
    )
  },
  {
    name: 'crockford check',
    test: () => (
      array &&
      typeof array === 'object' &&
      typeof array.length === 'number' &&
      typeof array.splice === 'function' &&
      !(array.propertyIsEnumerable('length'))
    )
  },
  {
    name: 'prototype toString check',
    test: () => (
      Object.prototype.toString.call(array) === '[object Array]'
    )
  }
];
