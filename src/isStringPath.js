const isStringPath = (path) => {
  for (var i = 0; i < path.length; i++) {
    if (typeof path[i] !== 'string') {
      return false;
    }
  }
  return true;
};

export default isStringPath;
