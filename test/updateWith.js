import test from 'ava';

import 'babel-core/register';
import fp from 'lodash/fp';

import {
  updateWith,
  $eachValue,
  $eachKey,
  $eachPair,
  $apply,
  $none,
  $slice
} from 'qim/src';

const increment = value => value + 1;
const isEven = value => value % 2 === 0;

test('updateWith identity', t => {
  t.deepEqual(
    updateWith([], obj => obj, {x: 1}),
    {x: 1}
  );
});

test('updateWith constant', t => {
  t.deepEqual(
    updateWith(['x'], () => 2, {x: 1}),
    {x: 2}
  );
});

test('updateWith increment', t => {
  t.deepEqual(
    updateWith(['x', increment], increment, {x: 1}),
    {x: 2}
  );
});

test('updateWith $apply primitive', t => {
  t.deepEqual(
    updateWith([], increment, 0),
    1
  );
});

test('updateWith predicate', t => {
  t.deepEqual(
    updateWith([isEven], increment, 1),
    1
  );
  t.deepEqual(
    updateWith([isEven], increment, 2),
    3
  );
});

test('updateWith values', t => {
  t.deepEqual(
    updateWith([$eachValue], increment, [1, 2, 3]),
    [2, 3, 4]
  );
  t.deepEqual(
    updateWith([$eachValue, isEven], increment, [1, 2, 3]),
    [1, 3, 3]
  );
  t.deepEqual(
    updateWith([$eachValue, 'x'], increment, [{x: 1, y: 2}, {x: 2, y: 3}]),
    [{x: 2, y: 2}, {x: 3, y: 3}]
  );
  t.deepEqual(
    updateWith([$eachValue, 'x', isEven], increment, [{x: 1}, {x: 2}]),
    [{x: 1}, {x: 3}]
  );
});

test('updateWith keys', t => {
  t.deepEqual(
    updateWith([$eachKey], fp.upperCase, {x: 1, y: 2}),
    {X: 1, Y: 2}
  );
});

test('updateWith pairs', t => {
  t.deepEqual(
    updateWith(
      [$eachPair],
      ([key, value]) => [key.toUpperCase(), value + 1],
      {x: 1, y: 2}
    ),
    {X: 2, Y: 3}
  );
});

test('updateWith array', t => {
  t.deepEqual(
    updateWith([1], fp.upperCase, ['foo', 'bar']),
    ['foo', 'BAR']
  );
});

test('remove key', t => {
  t.deepEqual(
    updateWith(['x'], () => $none, {x: 1, y: 2}),
    {y: 2}
  );
});

test('remove item', t => {
  t.deepEqual(
    updateWith([0], () => $none, ['a', 'b']),
    ['b']
  );
});

test('remove all keys', t => {
  t.deepEqual(
    updateWith([$eachValue], () => $none, {x: 1, y: 2}),
    {}
  );
});

test('remove all items', t => {
  t.deepEqual(
    updateWith([$eachValue], () => $none, ['a', 'b']),
    []
  );
});

test('remove all keys with $none', t => {
  t.deepEqual(
    updateWith([$eachKey], () => $none, {x: 1, y: 2}),
    {}
  );
});

test('remove all pairs from array with $none', t => {
  t.deepEqual(
    updateWith([$eachPair], () => $none, ['a', 'b']),
    []
  );
});

test('remove all pairs from object with $none', t => {
  t.deepEqual(
    updateWith([$eachPair], () => $none, {x: 1, y: 2}),
    {}
  );
});

test('replace slice', t => {
  t.deepEqual(
    updateWith([$slice(0, 2)], () => ['x', 'y'], ['a', 'b', 'c', 'd']),
    ['x', 'y', 'c', 'd']
  );
});
