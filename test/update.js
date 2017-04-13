import test from 'ava';

import 'babel-core/register';
import fp from 'lodash/fp';

import {
  update,
  $eachValue,
  $eachKey,
  $eachPair,
  $set,
  $apply,
  $none
} from 'qim/src';

const increment = value => value + 1;
const isEven = value => value % 2 === 0;

test('update identity', t => {
  t.deepEqual(
    update([], {x: 1}),
    {x: 1}
  );
});

test('update $set', t => {
  t.deepEqual(
    update(['x', $set(2)], {x: 1}),
    {x: 2}
  );
});

test('update $apply', t => {
  t.deepEqual(
    update(['x', $apply(increment)], {x: 1}),
    {x: 2}
  );
});

test('update $apply primitive', t => {
  t.deepEqual(
    update([$apply(increment)], 0),
    1
  );
});

test('update predicate', t => {
  t.deepEqual(
    update([isEven, $apply(increment)], 1),
    1
  );
  t.deepEqual(
    update([isEven, $apply(increment)], 2),
    3
  );
});

test('update values', t => {
  t.deepEqual(
    update([$eachValue, $apply(increment)], [1, 2, 3]),
    [2, 3, 4]
  );
  t.deepEqual(
    update([$eachValue, isEven, $apply(increment)], [1, 2, 3]),
    [1, 3, 3]
  );
  t.deepEqual(
    update([$eachValue, 'x', $apply(increment)], [{x: 1, y: 2}, {x: 2, y: 3}]),
    [{x: 2, y: 2}, {x: 3, y: 3}]
  );
  t.deepEqual(
    update([$eachValue, 'x', isEven, $apply(increment)], [{x: 1}, {x: 2}]),
    [{x: 1}, {x: 3}]
  );
});

test('update keys', t => {
  t.deepEqual(
    update([$eachKey, $apply(fp.upperCase)], {x: 1, y: 2}),
    {X: 1, Y: 2}
  );
});

test('update pairs', t => {
  t.deepEqual(
    update([
      $eachPair,
      $apply(([key, value]) => [key.toUpperCase(), value + 1])
    ],
      {x: 1, y: 2}
    ),
    {X: 2, Y: 3}
  );

  t.deepEqual(
    update([$eachPair,
      [0, $apply(fp.upperCase)],
      [1, $apply(increment)]
    ], {x: 1, y: 2}),
    {X: 2, Y: 3}
  );

  t.deepEqual(
    update([$eachPair,
      [0, fp.eq('x'), $apply(fp.upperCase)],
      [1, isEven, $apply(increment)]
    ], {x: 1, y: 2}),
    {X: 1, y: 3}
  );
});

test('update multi', t => {
  t.deepEqual(
    update([$eachValue,
      $apply(increment),
      $apply(increment)
    ], [1, 2, 3]),
    [3, 4, 5]
  );

  t.deepEqual(
    update([$eachValue,
      ['x', $apply(increment)],
      ['y', $apply(increment)]
    ], [{x: 1, y: 2}, {x: 2, y: 3}]),
    [{x: 2, y: 3}, {x: 3, y: 4}]
  );
});

test('update array', t => {
  t.deepEqual(
    update([1, $apply(fp.upperCase)], ['foo', 'bar']),
    ['foo', 'BAR']
  );
});

test('remove key', t => {
  t.deepEqual(
    update(['x', $none], {x: 1, y: 2}),
    {y: 2}
  );
});

test('remove item', t => {
  t.deepEqual(
    update([0, $none], ['a', 'b']),
    ['b']
  );
});

test('remove all keys', t => {
  t.deepEqual(
    update([$eachValue, $none], {x: 1, y: 2}),
    {}
  );
});

test('remove all items', t => {
  t.deepEqual(
    update([$eachValue, $none], ['a', 'b']),
    []
  );
});

test('remove all keys with $none', t => {
  t.deepEqual(
    update([$eachKey, $none], {x: 1, y: 2}),
    {}
  );
});

test('remove all pairs from array with $none', t => {
  t.deepEqual(
    update([$eachPair, $none], ['a', 'b']),
    []
  );
});

test('remove all pairs from object with $none', t => {
  t.deepEqual(
    update([$eachPair, $none], {x: 1, y: 2}),
    {}
  );
});
