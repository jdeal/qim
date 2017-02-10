import objectAssign from 'object-assign';

import select from './select';

const isObject = object => object && typeof object === 'object';

const defaultTo = curry2(
  (defaultValue, data) => data == null ? defaultValue : data
);

export const getOr = (key, defaultValue, data) =>
  defaultTo(
    isObject(data) ? data[key] : undefined,
    defaultValue
  );

export const get = (key, data) =>
  isObject(data) ? data[key] : undefined

export const set = (key, value) => object => {
  if (!isObject(object)) {
    return object;
  }
  if (object[key] === value) {
    return object;
  }
  const newObject = objectAssign({}, object);
  newObject[key] = value;
  return newObject;
};

export selectOne = path => object => {
  const items = select(path, object);
};

export const getIn = (path, defaultValue) => object =>
  select(path, )
