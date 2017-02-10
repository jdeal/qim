const toDataFirst = (fn, arity) => {
  switch (typeof arity !== 'undefined' ? arity : fn.length) {
  case 2:
    return (a, b) => fn(b, a);
  case 3:
    return (a, b, c) => fn(c, a, b);
  }
  throw new Error('toDataFirst only supports binary or ternary functions');
};

export default toDataFirst;
