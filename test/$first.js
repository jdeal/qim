import test from 'ava';

import 'babel-core/register';

import { select, update, $first, $set, $none } from 'qim/src';

const selectFirst = input => select([$first], input);

test('select first of array', t =>
  t.deepEqual(selectFirst(['a', 'b', 'c']), ['a']));

test('select first of object', t =>
  t.deepEqual(selectFirst({ a: 1, b: 2, c: 3 }), [1]));

test('select first of string', t => t.deepEqual(selectFirst('abc'), ['a']));

test('select first of number', t => t.throws(() => selectFirst(5)));

test('select first of undefined', t => t.throws(() => selectFirst(undefined)));

const updateFirst = (firstValue, input) =>
  update([$first, $set(firstValue)], input);

test('update first of array with string', t =>
  t.deepEqual(updateFirst('X', ['a', 'b', 'c']), ['X', 'b', 'c']));

test('update first of array with none', t =>
  t.deepEqual(updateFirst($none, ['a', 'b', 'c']), ['b', 'c']));

test('update first of array with undefined', t =>
  t.deepEqual(updateFirst(undefined, ['a', 'b', 'c']), [undefined, 'b', 'c']));

test('update first of object with number', t =>
  t.deepEqual(updateFirst(10, { a: 1, b: 2, c: 3 }), { a: 10, b: 2, c: 3 }));

test('update first of object with none', t =>
  t.deepEqual(updateFirst($none, { a: 1, b: 2, c: 3 }), { b: 2, c: 3 }));

test('update first of object with undefined', t =>
  t.deepEqual(updateFirst(undefined, { a: 1, b: 2, c: 3 }), {
    a: undefined,
    b: 2,
    c: 3
  }));

test('update first of string with string', t =>
  t.deepEqual(updateFirst('X', 'abc'), 'Xbc'));

test('update first of string with empty string', t =>
  t.deepEqual(updateFirst('', 'abc'), 'bc'));

test('update first of string with none', t =>
  t.deepEqual(updateFirst($none, 'abc'), 'bc'));

test('update first of string with number', t =>
  t.deepEqual(updateFirst(5, 'abc'), '5bc'));

test('update first of string with undefined', t =>
  t.deepEqual(updateFirst(undefined, 'abc'), 'undefinedbc'));

test('update first of number with string', t =>
  t.throws(() => updateFirst('X', 0)));

test('update first of true with string', t =>
  t.throws(() => updateFirst('X', true)));

test('update first of undefined with string', t =>
  t.throws(() => updateFirst('X', undefined)));
