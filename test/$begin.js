import test from 'ava';

import 'babel-core/register';

import { select, update, $begin, $set, $none } from 'qim/src';

const selectBegin = input => select([$begin], input);

test('select begin of array', t =>
  t.deepEqual(selectBegin(['a', 'b', 'c']), [[]]));

test('select begin of object', t =>
  t.deepEqual(selectBegin({ a: 1, b: 2, c: 3 }), [{}]));

test('select begin of string', t => t.deepEqual(selectBegin('abc'), ['']));

test('select begin of number', t => t.throws(() => selectBegin(5)));

test('select begin of undefined', t => t.throws(() => selectBegin(undefined)));

const updateBegin = (beginArray, input) =>
  update([$begin, $set(beginArray)], input);

test('update begin of array with string', t =>
  t.deepEqual(updateBegin('X', ['a', 'b', 'c']), ['X', 'a', 'b', 'c']));

test('update begin of array with array', t =>
  t.deepEqual(updateBegin(['X'], ['a', 'b', 'c']), ['X', 'a', 'b', 'c']));

test('update begin of array with empty', t =>
  t.deepEqual(updateBegin([], ['a', 'b', 'c']), ['a', 'b', 'c']));

test('update begin of array with $none', t =>
  t.deepEqual(updateBegin($none, ['a', 'b', 'c']), ['a', 'b', 'c']));

test('update begin of object with object', t =>
  t.deepEqual(updateBegin({ x: 1 }, ['a', 'b', 'c']), [
    { x: 1 },
    'a',
    'b',
    'c'
  ]));

test('update begin of array with undefined', t =>
  t.deepEqual(updateBegin(undefined, ['a', 'b', 'c']), [
    undefined,
    'a',
    'b',
    'c'
  ]));

test('update begin of object with object', t =>
  t.deepEqual(updateBegin({ x: 10 }, { a: 1, b: 2, c: 3 }), {
    x: 10,
    a: 1,
    b: 2,
    c: 3
  }));

test('update begin of object with empty object', t =>
  t.deepEqual(updateBegin({}, { a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 }));

test('update begin of object with $none', t =>
  t.deepEqual(updateBegin($none, { a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 }));

test('update begin of object with array', t =>
  t.deepEqual(updateBegin([10], { a: 1, b: 2, c: 3 }), {
    0: 10,
    a: 1,
    b: 2,
    c: 3
  }));

test('update begin of object with string', t =>
  t.deepEqual(updateBegin('x', { a: 1, b: 2, c: 3 }), {
    0: 'x',
    a: 1,
    b: 2,
    c: 3
  }));

test('update begin of object with undefined', t =>
  t.throws(() => updateBegin(undefined, { a: 1, b: 2, c: 3 })));

test('update begin of object with number', t =>
  t.throws(() => updateBegin(1, { a: 1, b: 2, c: 3 })));

test('update begin of string with string', t =>
  t.deepEqual(updateBegin('X', 'abc'), 'Xabc'));

test('update begin of string with array', t =>
  t.deepEqual(updateBegin(['X'], 'abc'), 'Xabc'));

test('update begin of string with empty string', t =>
  t.deepEqual(updateBegin('', 'abc'), 'abc'));

test('update begin of string with empty array', t =>
  t.deepEqual(updateBegin([], 'abc'), 'abc'));

test('update begin of string with $none', t =>
  t.deepEqual(updateBegin($none, 'abc'), 'abc'));

test('update begin of string with number', t =>
  t.deepEqual(updateBegin(5, 'abc'), '5abc'));

test('update begin of string with undefined', t =>
  t.deepEqual(updateBegin(undefined, 'abc'), 'undefinedabc'));

test('update begin of number with array', t =>
  t.throws(() => updateBegin(['X'], 0)));

test('update begin of true with array', t =>
  t.throws(() => updateBegin(['X'], true)));

test('update begin of undefine with array', t =>
  t.throws(() => updateBegin(['X'], undefined)));
