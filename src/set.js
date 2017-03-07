const set = (obj, key, value) => {
  if (obj == null || typeof obj !== 'object') {
    return obj;
  }

  if (obj[key] === value) {
    return obj;
  }

  if (Array.isArray(obj)) {
    obj = obj.slice(0);
  } else {
    obj = {...obj};
  }

  obj[key] = value;

  return obj;
};

export default set;
