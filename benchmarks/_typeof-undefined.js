const foo = undefined;

export default [
  {
    name: "typeof foo !== 'undefined'",
    test: () => (
      typeof foo !== 'undefined'
    )
  },
  {
    name: 'foo !== undefined',
    test: () => (
      foo !== undefined
    )
  }
];
