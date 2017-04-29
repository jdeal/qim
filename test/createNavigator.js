import test from 'ava';

import 'babel-core/register';

import {
  select,
  set,
  createNavigator,
  createNavigatorCall
} from 'qim/src';

test('unparameterized navigator', t => {
  const $length = createNavigator({
    select: (nav, object, next) => {
      if (Array.isArray(object)) {
        return next(object.length);
      }
      throw new Error('$length only works on arrays');
    },
    update: (nav, object, next) => {
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
  const $take = createNavigator({
    select: (nav, object, next) => {
      if (Array.isArray(object)) {
        return next(object.slice(0, nav.count));
      }
      throw new Error('$length only works on arrays');
    },
    update: (nav, object, next) => {
      if (Array.isArray(object)) {
        const result = next(object.slice(0, nav.count));
        const newArray = object.slice(0);
        newArray.splice(0, nav.count, ...result);
        return newArray;
      }
      throw new Error('$length only works on arrays');
    }
  }, navigator => (count) => createNavigatorCall(navigator, {count}));
  t.deepEqual(
    select([$take(2)], ['a', 'b', 'c']),
    [['a', 'b']]
  );
  t.deepEqual(
    set([$take(2)], ['x'], ['a', 'b', 'c']),
    ['x', 'c']
  );
});
