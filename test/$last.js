import test from 'ava';

import 'babel-core/register';

import { select, update, $last, $set, $none } from 'qim/src';

const selectLast = input => select([$last], input);

test('select last of array', t =>
  t.deepEqual(selectLast(['a', 'b', 'c']), ['c']));

test('select last of object', t =>
  t.deepEqual(selectLast({ a: 1, b: 2, c: 3 }), [3]));

test('select last of string', t => t.deepEqual(selectLast('abc'), ['c']));

test('select last of number', t => t.throws(() => selectLast(5)));

test('select last of undefined', t => t.throws(() => selectLast(undefined)));

const updateLast = (lastValue, input) =>
  update([$last, $set(lastValue)], input);

test('update last of array with string', t =>
  t.deepEqual(updateLast('X', ['a', 'b', 'c']), ['a', 'b', 'X']));

test('update last of array with none', t =>
  t.deepEqual(updateLast($none, ['a', 'b', 'c']), ['a', 'b']));

test('update last of array with undefined', t =>
  t.deepEqual(updateLast(undefined, ['a', 'b', 'c']), ['a', 'b', undefined]));

test('update last of object with number', t =>
  t.deepEqual(updateLast(10, { a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 10 }));

test('update last of object with none', t =>
  t.deepEqual(updateLast($none, { a: 1, b: 2, c: 3 }), { a: 1, b: 2 }));

test('update last of object with undefined', t =>
  t.deepEqual(updateLast(undefined, { a: 1, b: 2, c: 3 }), {
    a: 1,
    b: 2,
    c: undefined
  }));

test('update last of string with string', t =>
  t.deepEqual(updateLast('X', 'abc'), 'abX'));

test('update last of string with empty string', t =>
  t.deepEqual(updateLast('', 'abc'), 'ab'));

test('update last of string with none', t =>
  t.deepEqual(updateLast($none, 'abc'), 'ab'));

test('update last of string with number', t =>
  t.deepEqual(updateLast(5, 'abc'), 'ab5'));

test('update last of string with undefined', t =>
  t.deepEqual(updateLast(undefined, 'abc'), 'abundefined'));

test('update last of number with string', t =>
  t.throws(() => updateLast('X', 0)));

test('update last of true with string', t =>
  t.throws(() => updateLast('X', true)));

test('update last of undefined with string', t =>
  t.throws(() => updateLast('X', undefined)));
