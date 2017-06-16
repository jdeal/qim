import test from 'ava';

import 'babel-core/register';

import {
  $each,
  $eachPair,
  $apply,
  $traverse,
  $nav,
  $lens,
  select,
  update,
  set,
  has
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

test('recursive path navigator', t => {
  const $walk = $nav((item) =>
    Array.isArray(item) ? [$each, $walk] : []
  );

  t.deepEqual(
    select([$walk, val => val % 2 === 0], [0, 1, 2, [4, 5, 6, [7, 8, 9]]]),
    [0, 2, 4, 6, 8]
  );
});

test('parameterized path navigator', t => {
  const $eachIfKeyStartsWith = (prefix) => $nav(
    [
      $eachPair,
      has([0, key => key.substring(0, prefix.length) === prefix]),
      1
    ]
  );

  t.deepEqual(
    update(
      [$eachIfKeyStartsWith('a'), $apply(value => value * 10)],
      {a: 1, aa: 2, b: 3, bb: 4}
    ),
    {a: 10, aa: 20, b: 3, bb: 4}
  );
});

test('lens navigator', t => {
  const $pct = $lens(
    n => n * 100,
    pct => pct / 100
  );

  t.deepEqual(
    update(
      ['x', $pct, pct => pct > 50, $apply(pct => pct + 5)],
      {x: .75}
    ),
    {x: .80}
  );
});
