const forwardCanMutate = (parentFn, childFn) => {
  if (parentFn['@@qim/canMutate'] === true) {
    childFn['@@qim/canMutate'] = true;
  }
  return childFn;
};

export const curry2 = fn => forwardCanMutate(fn, function (a, b, sourceObj, mutateMarker) {
  switch (arguments.length) {
  case 2:
    return fn(a, b, sourceObj, mutateMarker);
  case 1:
    return forwardCanMutate(fn, function (_b, _sourceObj, _mutateMarker) {
      return fn(a, _b, _sourceObj, _mutateMarker);
    });
  default:
    return fn;
  }
});

export const curry3 = fn => forwardCanMutate(fn, function (a, b, c, sourceObj, mutateMarker) {
  switch (arguments.length) {
  case 3:
    return fn(a, b, c, sourceObj, mutateMarker);
  case 2:
    return forwardCanMutate(fn, function (_c, _sourceObj, _mutateMarker) {
      return fn(a, b, _c, _sourceObj, _mutateMarker);
    });
  case 1:
    return forwardCanMutate(fn, curry2(function (_b, _c, _sourceObj, _mutateMarker) {
      return fn(a, _b, _c, _sourceObj, _mutateMarker);
    }));
  default:
    return fn;
  }
});
