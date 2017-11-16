import test from 'ava';

import 'babel-core/register';

import {
  set,
  $each,
  $eachKey,
  $eachPair,
  $none,
  $slice,
  $default
} from 'qim/src';

test('set to value', t => {
  t.deepEqual(
    set(['x'], 2, {x: 1}),
    {x: 2}
  );
});

test('remove key', t => {
  t.deepEqual(
    set(['x'], $none, {x: 1, y: 2}),
    {y: 2}
  );
});

test('remove key from object special case', t => {
  t.deepEqual(
    set('x', $none, {x: 1, y: 2}),
    {y: 2}
  );
});

test('remove key from array special case', t => {
  t.deepEqual(
    set(0, $none, ['x', 'y']),
    ['y']
  );
});

test('remove key from string special case', t => {
  t.deepEqual(
    set(0, $none, 'xyz'),
    'yz'
  );
});

test('remove item', t => {
  t.deepEqual(
    set([0], $none, ['a', 'b']),
    ['b']
  );
});

test('remove all keys', t => {
  t.deepEqual(
    set([$each], $none, {x: 1, y: 2}),
    {}
  );
});

test('remove all items', t => {
  t.deepEqual(
    set([$each], $none, ['a', 'b']),
    []
  );
});

test('remove all keys with $none', t => {
  t.deepEqual(
    set([$eachKey], $none, {x: 1, y: 2}),
    {}
  );
});

test('remove all pairs from array with $none', t => {
  t.deepEqual(
    set([$eachPair], $none, ['a', 'b']),
    []
  );
});

test('remove all pairs from object with $none', t => {
  t.deepEqual(
    set([$eachPair], $none, {x: 1, y: 2}),
    {}
  );
});

test('replace slice', t => {
  t.deepEqual(
    set([$slice(0, 2)], ['x', 'y'], ['a', 'b', 'c', 'd']),
    ['x', 'y', 'c', 'd']
  );
});

test('auto-create objects', t => {
  t.deepEqual(
    set(['x', 'y'], 0, {}),
    {x: {y: 0}}
  );
});

test('do not auto-create arrays', t => {
  t.deepEqual(
    set(['x', 0], 'a', {}),
    {x: {0: 'a'}}
  );
});

test('fill in path with $default', t => {
  t.deepEqual(
    set(['x', $default({a: 0}), 'y'], 0, {}),
    {x: {a: 0, y: 0}}
  );
  t.deepEqual(
    set(['x', $default([0, 0]), 0], 1, {}),
    {x: [1, 0]}
  );
});

test('set by index', t => {
  t.deepEqual(
    set([5], 5, [0, 1, 2, 3, 4]),
    [0, 1, 2, 3, 4, 5]
  );
});
