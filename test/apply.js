import test from 'ava';

import 'babel-core/register';
import fp from 'lodash/fp';

import {
  apply,
  $each,
  $eachKey,
  $eachPair,
  $none,
  $slice
} from 'qim/src';

const increment = value => value + 1;
const isEven = value => value % 2 === 0;

test('apply identity', t => {
  t.deepEqual(
    apply([], obj => obj, {x: 1}),
    {x: 1}
  );
});

test('apply constant', t => {
  t.deepEqual(
    apply(['x'], () => 2, {x: 1}),
    {x: 2}
  );
});

test('apply increment', t => {
  t.deepEqual(
    apply(['x', increment], increment, {x: 1}),
    {x: 2}
  );
});

test('apply $apply primitive', t => {
  t.deepEqual(
    apply([], increment, 0),
    1
  );
});

test('apply predicate', t => {
  t.deepEqual(
    apply([isEven], increment, 1),
    1
  );
  t.deepEqual(
    apply([isEven], increment, 2),
    3
  );
});

test('apply values', t => {
  t.deepEqual(
    apply([$each], increment, [1, 2, 3]),
    [2, 3, 4]
  );
  t.deepEqual(
    apply([$each, isEven], increment, [1, 2, 3]),
    [1, 3, 3]
  );
  t.deepEqual(
    apply([$each, 'x'], increment, [{x: 1, y: 2}, {x: 2, y: 3}]),
    [{x: 2, y: 2}, {x: 3, y: 3}]
  );
  t.deepEqual(
    apply([$each, 'x', isEven], increment, [{x: 1}, {x: 2}]),
    [{x: 1}, {x: 3}]
  );
});

test('apply keys', t => {
  t.deepEqual(
    apply([$eachKey], fp.upperCase, {x: 1, y: 2}),
    {X: 1, Y: 2}
  );
});

test('apply pairs', t => {
  t.deepEqual(
    apply(
      [$eachPair],
      ([key, value]) => [key.toUpperCase(), value + 1],
      {x: 1, y: 2}
    ),
    {X: 2, Y: 3}
  );
});

test('apply array', t => {
  t.deepEqual(
    apply([1], fp.upperCase, ['foo', 'bar']),
    ['foo', 'BAR']
  );
});

test('remove key', t => {
  t.deepEqual(
    apply(['x'], () => $none, {x: 1, y: 2}),
    {y: 2}
  );
});

test('remove item', t => {
  t.deepEqual(
    apply([0], () => $none, ['a', 'b']),
    ['b']
  );
});

test('remove all keys', t => {
  t.deepEqual(
    apply([$each], () => $none, {x: 1, y: 2}),
    {}
  );
});

test('remove all items', t => {
  t.deepEqual(
    apply([$each], () => $none, ['a', 'b']),
    []
  );
});

test('remove all keys with $none', t => {
  t.deepEqual(
    apply([$eachKey], () => $none, {x: 1, y: 2}),
    {}
  );
});

test('remove all pairs from array with $none', t => {
  t.deepEqual(
    apply([$eachPair], () => $none, ['a', 'b']),
    []
  );
});

test('remove all pairs from object with $none', t => {
  t.deepEqual(
    apply([$eachPair], () => $none, {x: 1, y: 2}),
    {}
  );
});

test('replace slice', t => {
  t.deepEqual(
    apply([$slice(0, 2)], () => ['x', 'y'], ['a', 'b', 'c', 'd']),
    ['x', 'y', 'c', 'd']
  );
});
