const copy = (object) => Array.isArray(object) ?
  object.slice(0) :
  Object.assign({}, object);

const stack = [];
const copyStack = [];

const setPathWithIteration = (path, index, value, object) => {
  // const stack = [];
  // const copyStack = [];
  let currentObject = object;
  while (index < path.length) {
    const key = path[index];
    if (currentObject == null) {
      currentObject = {};
      copyStack[index] = false;
    } else {
      copyStack[index] = true;
    }
    stack[index] = currentObject;
    currentObject = currentObject[key];
    index++;
  }
  if (currentObject === value) {
    return object;
  }

  for (let i = path.length - 1; i >= 0; i--) {
    const key = path[i];
    const parent = copyStack[i] ? copy(stack[i]) : stack[i];
    parent[key] = value;
    value = parent;
  }

  return value;
};

const setPathWithRecursion = (path, index, value, object) => {
  if (index === path.length) {
    return value;
  }
  const key = path[index];
  const subObject = object != null ? object[key] : {};
  const newSubObject = setPathWithRecursion(path, index + 1, value, subObject);
  if (newSubObject !== subObject) {
    object = copy(object);
    object[key] = newSubObject;
  }
  return object;
};

export default [
  {
    name: 'iteration',
    test: () => (
      setPathWithIteration(['x', 'y'], 0, 1, {})
    )
  },
  {
    name: 'recursion',
    test: () => (
      setPathWithRecursion(['x', 'y'], 0, 1, {})
    )
  }
];
