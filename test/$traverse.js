import test from 'ava';

import 'babel-core/register';

import {
  $traverse,
  select,
  set
} from 'qim/src';

test('unparameterized navigator', t => {
  const $length = $traverse({
    select: (object, next) => {
      if (Array.isArray(object)) {
        return next(object.length);
      }
      throw new Error('$length only works on arrays');
    },
    update: (object, next) => {
      if (Array.isArray(object)) {
        const newLength = next(object.length);
        if (newLength < object.length) {
          return object.slice(0, newLength);
        }
        if (newLength > object.length) {
          object = object.slice(0);
          for (let i = 0; i < newLength - object.length; i++) {
            object.push(undefined);
          }
          return object;
        }
        return object;
      }
      throw new Error('$length only works on arrays');
    }
  });
  t.deepEqual(
    select([$length], [1, 1, 1]),
    [3]
  );
  t.deepEqual(
    set([$length], 3, [1, 1, 1]),
    [1, 1, 1]
  );
  t.deepEqual(
    set([$length], 2, [1, 1, 1]),
    [1, 1]
  );
  t.deepEqual(
    set([$length], 4, [1, 1, 1]),
    [1, 1, 1, undefined]
  );
});

test('parameterized navigator', t => {
  const $take = (count) => $traverse({
    hasParams: true,
    select: (object, next) => {
      if (Array.isArray(object)) {
        return next(object.slice(0, count));
      }
      throw new Error('$length only works on arrays');
    },
    update: (object, next) => {
      if (Array.isArray(object)) {
        const result = next(object.slice(0, count));
        const newArray = object.slice(0);
        newArray.splice(0, count, ...result);
        return newArray;
      }
      throw new Error('$length only works on arrays');
    }
  });
  t.deepEqual(
    select([$take(2)], ['a', 'b', 'c']),
    [['a', 'b']]
  );
  t.deepEqual(
    set([$take(2)], ['x'], ['a', 'b', 'c']),
    ['x', 'c']
  );
});
