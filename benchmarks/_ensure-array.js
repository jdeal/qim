const array = ['x'];

export default [
  {
    name: 'check and wrap',
    test: () => (
      Array.isArray(array) ? array : [array]
    )
  },
  {
    name: 'concat',
    test: () => (
      [].concat(array)
    )
  }
];
