import test from 'ava';

import 'babel-core/register';
import fp from 'lodash/fp';

import transform from 'im-js/src/transform';
import $set from 'im-js/src/navigators/$set';
import $update from 'im-js/src/navigators/$update';
import $values from 'im-js/src/navigators/$values';
import $pairs from 'im-js/src/navigators/$pairs';
import $keys from 'im-js/src/navigators/$keys';

const increment = value => value + 1;
const isEven = value => value % 2 === 0;

test('transform identity', t => {
  t.deepEqual(
    transform([], {x: 1}),
    {x: 1}
  );
});

test('transform set', t => {
  t.deepEqual(
    transform(['x', $set(2)], {x: 1}),
    {x: 2}
  );
});

test('transform update', t => {
  t.deepEqual(
    transform(['x', $update(increment)], {x: 1}),
    {x: 2}
  );
});

test('transform update primitive', t => {
  t.deepEqual(
    transform([$update(increment)], 0),
    1
  );
});

test('transform predicate', t => {
  t.deepEqual(
    transform([isEven, $update(increment)], 1),
    1
  );
  t.deepEqual(
    transform([isEven, $update(increment)], 2),
    3
  );
});

test('transform values', t => {
  t.deepEqual(
    transform([$values, $update(increment)], [1, 2, 3]),
    [2, 3, 4]
  );
  t.deepEqual(
    transform([$values, 'x', $update(increment)], [{x: 1}, {x: 2}]),
    [{x: 2}, {x: 3}]
  );
  t.deepEqual(
    transform([$values, 'x', isEven, $update(increment)], [{x: 1}, {x: 2}]),
    [{x: 1}, {x: 3}]
  );
});

test('transform multi', t => {
  t.deepEqual(
    transform(
      [$values,
        [
          $update(increment),
          $update(increment)
        ]
      ]
    , [1, 2, 3]),
    [3, 4, 5]
  );
  t.deepEqual(
    transform(
      [$values,
        [
          ['x', $update(increment)],
          ['y', $update(increment)]
        ]
      ]
    , [{x: 1, y: 2}, {x: 2, y: 3}]),
    [{x: 2, y: 3}, {x: 3, y: 4}]
  );
});

test('transform array', t => {
  t.deepEqual(
    transform([1, $update(fp.upperCase)], ['foo', 'bar']),
    ['foo', 'BAR']
  );
});

test('transform pairs', t => {
  t.deepEqual(
    transform([
      $pairs,
      $update(([key, value]) => [key.toUpperCase(), value + 1])
    ], {x: 1, y: 2}),
    {X: 2, Y: 3}
  );
  t.deepEqual(
    transform([
      $pairs,
      [
        [0, $update(fp.upperCase)],
        [1, $update(increment)]
      ]
    ], {x: 1, y: 2}),
    {X: 2, Y: 3}
  );
  t.deepEqual(
    transform([
      $pairs,
      [
        [0, fp.eq('x'), $update(fp.upperCase)],
        [1, isEven, $update(increment)]
      ]
    ], {x: 1, y: 2}),
    {X: 1, y: 3}
  );
});

test('transform keys', t => {
  t.deepEqual(
    transform([$keys, $update(fp.upperCase)], {x: 1, y: 2}),
    {X: 1, Y: 2}
  );
});
