import test from 'ava';

import 'babel-core/register';

import { select, update, $set, $none, $each } from 'qim/src';

const selectSet = (path, value, input) => select([...path, $set(value)], input);

test('select primitive', t => t.deepEqual(selectSet([], 1, 0), [1]));

test('select object', t => t.deepEqual(selectSet([], 1, { x: 1 }), [1]));

test('select path in object', t =>
  t.deepEqual(selectSet(['x'], 1, { x: 0 }), [1]));

test('select path in string', t =>
  t.deepEqual(selectSet([1], 'X', 'abc'), ['X']));

test('select each item of array', t =>
  t.deepEqual(selectSet([$each], 'x', ['a', 'b', 'c']), ['x', 'x', 'x']));

const updateSet = (path, value, input) => update([...path, $set(value)], input);

test('update primitive', t => t.deepEqual(updateSet([], 1, 0), 1));

test('update object', t => t.deepEqual(updateSet([], 1, { x: 1 }), 1));

test('update path in array', t =>
  t.deepEqual(updateSet([1], 'X', ['a', 'b', 'c']), ['a', 'X', 'c']));

test('update path in array to $none', t =>
  t.deepEqual(updateSet([1], $none, ['a', 'b', 'c']), ['a', 'c']));

test('update new path in array', t =>
  t.deepEqual(updateSet([2], 'X', ['a', 'b']), ['a', 'b', 'X']));

test('update path in object', t =>
  t.deepEqual(updateSet(['x'], 1, { x: 0 }), { x: 1 }));

test('update new path in object', t =>
  t.deepEqual(updateSet(['x'], 1, { a: 0 }), { a: 0, x: 1 }));

test('update path in object to $none', t =>
  t.deepEqual(updateSet(['x'], $none, { x: 0, y: 1 }), { y: 1 }));

test('update path in string', t =>
  t.deepEqual(updateSet([1], 'X', 'abc'), 'aXc'));

test('update each item of array', t =>
  t.deepEqual(updateSet([$each], 'x', ['a', 'b', 'c']), ['x', 'x', 'x']));

test('update each item of object', t =>
  t.deepEqual(updateSet([$each], 10, { a: 1, b: 2, c: 3 }), {
    a: 10,
    b: 10,
    c: 10
  }));

test('update each item of string', t =>
  t.deepEqual(updateSet([$each], 'X', 'abc'), 'XXX'));

test('new path in array with holes', t => {
  const array = ['a'];
  array[2] = 'c';
  t.deepEqual(update([3, $set('X')], array), ['a', undefined, 'c', 'X']);
  t.false(1 in array);
});

test('new path and a new hole in an array', t => {
  const array = ['a'];
  t.deepEqual(update([2, $set('X')], array), ['a', undefined, 'X']);
  t.false(1 in array);
});
