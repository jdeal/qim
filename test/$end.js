import test from 'ava';

import 'babel-core/register';

import { select, update, $end, $set, $none } from 'qim/src';

const selectEnd = input => select([$end], input);

test('select end of array', t => t.deepEqual(selectEnd(['a', 'b', 'c']), [[]]));

test('select end of object', t =>
  t.deepEqual(selectEnd({ a: 1, b: 2, c: 3 }), [{}]));

test('select end of string', t => t.deepEqual(selectEnd('abc'), ['']));

test('select end of number', t => t.throws(() => selectEnd(5)));

test('select end of undefined', t => t.throws(() => selectEnd(undefined)));

const updateEnd = (beginArray, input) =>
  update([$end, $set(beginArray)], input);

test('update end of array with string', t =>
  t.deepEqual(updateEnd('X', ['a', 'b', 'c']), ['a', 'b', 'c', 'X']));

test('update end of array with array', t =>
  t.deepEqual(updateEnd(['X'], ['a', 'b', 'c']), ['a', 'b', 'c', 'X']));

test('update end of array with blank array', t =>
  t.deepEqual(updateEnd([], ['a', 'b', 'c']), ['a', 'b', 'c']));

test('update end of array with none', t =>
  t.deepEqual(updateEnd($none, ['a', 'b', 'c']), ['a', 'b', 'c']));

test('update end of array with object', t =>
  t.deepEqual(updateEnd({ x: 1 }, ['a', 'b', 'c']), ['a', 'b', 'c', { x: 1 }]));

test('update end of array with undefined', t =>
  t.deepEqual(updateEnd(undefined, ['a', 'b', 'c']), [
    'a',
    'b',
    'c',
    undefined
  ]));

test('update end of object with object', t =>
  t.deepEqual(updateEnd({ x: 10 }, { a: 1, b: 2, c: 3 }), {
    a: 1,
    b: 2,
    c: 3,
    x: 10
  }));

test('update end of object with empty object', t =>
  t.deepEqual(updateEnd({}, { a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 }));

test('update end of object with none', t =>
  t.deepEqual(updateEnd($none, { a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 }));

test('update end of object with array', t =>
  t.deepEqual(updateEnd([10], { a: 1, b: 2, c: 3 }), {
    0: 10,
    a: 1,
    b: 2,
    c: 3
  }));

test('update end of object with string', t =>
  t.deepEqual(updateEnd('x', { a: 1, b: 2, c: 3 }), {
    0: 'x',
    a: 1,
    b: 2,
    c: 3
  }));

test('update end of object with undefined', t =>
  t.throws(() => updateEnd(undefined, { a: 1, b: 2, c: 3 })));

test('update end of object with number', t =>
  t.throws(() => updateEnd(1, { a: 1, b: 2, c: 3 })));

test('update end of string with string', t =>
  t.deepEqual(updateEnd('X', 'abc'), 'abcX'));

test('update end of string with array', t =>
  t.deepEqual(updateEnd(['X'], 'abc'), 'abcX'));

test('update end of string with empty string', t =>
  t.deepEqual(updateEnd('', 'abc'), 'abc'));

test('update end of string with empty array', t =>
  t.deepEqual(updateEnd([], 'abc'), 'abc'));

test('update end of string with none', t =>
  t.deepEqual(updateEnd($none, 'abc'), 'abc'));

test('update end of string with number', t =>
  t.deepEqual(updateEnd(5, 'abc'), 'abc5'));

test('update end of string with undefined', t =>
  t.deepEqual(updateEnd(undefined, 'abc'), 'abcundefined'));

test('update end of number with array', t =>
  t.throws(() => updateEnd(['X'], 0)));

test('update end of true with array', t =>
  t.throws(() => updateEnd(['X'], true)));

test('update end of undefined with array', t =>
  t.throws(() => updateEnd(['X'], undefined)));
