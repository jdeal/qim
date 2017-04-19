import test from 'ava';

import 'babel-core/register';

import {
  updateTo,
  $eachValue,
  $eachKey,
  $eachPair,
  $none,
  $slice
} from 'qim/src';

test('set to value', t => {
  t.deepEqual(
    updateTo(['x'], 2, {x: 1}),
    {x: 2}
  );
});

test('remove key', t => {
  t.deepEqual(
    updateTo(['x'], $none, {x: 1, y: 2}),
    {y: 2}
  );
});

test('remove item', t => {
  t.deepEqual(
    updateTo([0], $none, ['a', 'b']),
    ['b']
  );
});

test('remove all keys', t => {
  t.deepEqual(
    updateTo([$eachValue], $none, {x: 1, y: 2}),
    {}
  );
});

test('remove all items', t => {
  t.deepEqual(
    updateTo([$eachValue], $none, ['a', 'b']),
    []
  );
});

test('remove all keys with $none', t => {
  t.deepEqual(
    updateTo([$eachKey], $none, {x: 1, y: 2}),
    {}
  );
});

test('remove all pairs from array with $none', t => {
  t.deepEqual(
    updateTo([$eachPair], $none, ['a', 'b']),
    []
  );
});

test('remove all pairs from object with $none', t => {
  t.deepEqual(
    updateTo([$eachPair], $none, {x: 1, y: 2}),
    {}
  );
});

test('replace slice', t => {
  t.deepEqual(
    updateTo([$slice(0, 2)], ['x', 'y'], ['a', 'b', 'c', 'd']),
    ['x', 'y', 'c', 'd']
  );
});
