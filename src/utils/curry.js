// Yes, we could make a smple universal curry with `.reduce`, but this is
// faster.

export const curry2 = fn => function (a, b, sourceObj) {
  switch (arguments.length) {
    case 2:
      return fn(a, b, sourceObj);
    case 1:
      return function (_b, _sourceObj) {
        return fn(a, _b, _sourceObj);
      };
    default:
      return fn;
  }
};

export const curry3 = fn => function (a, b, c, sourceObj) {
  switch (arguments.length) {
    case 3:
      return fn(a, b, c, sourceObj);
    case 2:
      return function (_c, _sourceObj) {
        return fn(a, b, _c, _sourceObj);
      };
    case 1:
      return curry2(function (_b, _c, _sourceObj) {
        return fn(a, _b, _c, _sourceObj);
      });
    default:
      return fn;
  }
};
