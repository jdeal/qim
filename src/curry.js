export const curry2 = fn => function (a, b) {
  switch (arguments.length) {
  case 1:
    return function (_b) {
      return fn(a, _b);
    };
  default:
    return fn(a, b);
  }
};

export const curry3 = fn => function (a, b, c) {
  switch (arguments.length) {
  case 2:
    return function (_c) {
      return fn(a, b, _c);
    };
  case 1:
    return curry2(function (_b, _c) {
      return fn(a, _b, _c);
    });
  case 0:
    return fn;
  default:
    return fn(a, b, c);
  }
};
