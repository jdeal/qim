const isArrayLike = (object) => {
  return object && typeof object === 'object' && typeof object.length === 'number';
};

export default isArrayLike;
