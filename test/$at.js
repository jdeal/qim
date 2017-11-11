import test from 'ava';

import 'babel-core/register';

import { select, update, $at, $set, $none } from 'qim/src';

const selectAt = (index, input) => select([$at(index)], input);

test('select 0 from array', t =>
  t.deepEqual(selectAt(0, ['a', 'b', 'c']), ['a']));

test('select 1 from array', t =>
  t.deepEqual(selectAt(1, ['a', 'b', 'c']), ['b']));

test('select -1 from array', t =>
  t.deepEqual(selectAt(-1, ['a', 'b', 'c']), ['c']));

test('select -2 from array', t =>
  t.deepEqual(selectAt(-2, ['a', 'b', 'c']), ['b']));

test('select 3 from array', t =>
  t.deepEqual(selectAt(3, ['a', 'b', 'c']), [undefined]));

test('select -4 from array', t =>
  t.deepEqual(selectAt(-4, ['a', 'b', 'c']), [undefined]));

test('select 0 from object', t =>
  t.deepEqual(selectAt(0, { a: 1, b: 2, c: 3 }), [1]));

test('select 1 from object', t =>
  t.deepEqual(selectAt(1, { a: 1, b: 2, c: 3 }), [2]));

test('select -1 from object', t =>
  t.deepEqual(selectAt(-1, { a: 1, b: 2, c: 3 }), [3]));

test('select -2 from object', t =>
  t.deepEqual(selectAt(-2, { a: 1, b: 2, c: 3 }), [2]));

test('select 3 from object', t =>
  t.deepEqual(selectAt(3, { a: 1, b: 2, c: 3 }), [undefined]));

test('select -4 from object', t =>
  t.deepEqual(selectAt(-4, { a: 1, b: 2, c: 3 }), [undefined]));

test('select 0 from string', t => t.deepEqual(selectAt(0, 'abc'), ['a']));

test('select 1 from string', t => t.deepEqual(selectAt(1, 'abc'), ['b']));

test('select -1 from string', t => t.deepEqual(selectAt(-1, 'abc'), ['c']));

test('select -2 from string', t => t.deepEqual(selectAt(-2, 'abc'), ['b']));

test('select 3 from string', t => t.deepEqual(selectAt(3, 'abc'), [undefined]));

test('select -4 from string', t =>
  t.deepEqual(selectAt(-4, 'abc'), [undefined]));

test('select 0 from undefined', t => t.throws(() => selectAt(0, undefined)));

test('select 0 from null', t => t.throws(() => selectAt(0, null)));

test('select 0 from 0', t => t.throws(() => selectAt(0, 0)));

test('select 0 from true', t => t.throws(() => selectAt(0, true)));

const updateAt = (index, value, input) =>
  update([$at(index), $set(value)], input);

test('update 0 in array', t =>
  t.deepEqual(updateAt(0, 'X', ['a', 'b', 'c']), ['X', 'b', 'c']));

test('update 1 in array', t =>
  t.deepEqual(updateAt(1, 'X', ['a', 'b', 'c']), ['a', 'X', 'c']));

test('update -1 in array', t =>
  t.deepEqual(updateAt(-1, 'X', ['a', 'b', 'c']), ['a', 'b', 'X']));

test('update -2 in array', t =>
  t.deepEqual(updateAt(-2, 'X', ['a', 'b', 'c']), ['a', 'X', 'c']));

test('update 3 in array', t =>
  t.deepEqual(updateAt(3, 'X', ['a', 'b', 'c']), ['a', 'b', 'c', 'X']));

test('update 4 in array', t =>
  t.deepEqual(updateAt(4, 'X', ['a', 'b', 'c']), [
    'a',
    'b',
    'c',
    undefined,
    'X'
  ]));

test('update -4 in array', t =>
  t.deepEqual(updateAt(-4, 'X', ['a', 'b', 'c']), ['X', 'a', 'b', 'c']));

test('update -5 in array', t =>
  t.deepEqual(updateAt(-5, 'X', ['a', 'b', 'c']), [
    'X',
    undefined,
    'a',
    'b',
    'c'
  ]));

test('update 0 to $none in array', t =>
  t.deepEqual(updateAt(0, $none, ['a', 'b', 'c']), ['b', 'c']));

test('update 1 to $none in array', t =>
  t.deepEqual(updateAt(1, $none, ['a', 'b', 'c']), ['a', 'c']));

test('update -1 to $none in array', t =>
  t.deepEqual(updateAt(-1, $none, ['a', 'b', 'c']), ['a', 'b']));

test('update -2 to $none in array', t =>
  t.deepEqual(updateAt(-2, $none, ['a', 'b', 'c']), ['a', 'c']));

test('update 3 to $none in array', t =>
  t.deepEqual(updateAt(3, $none, ['a', 'b', 'c']), ['a', 'b', 'c']));

test('update -4 to $none in array', t =>
  t.deepEqual(updateAt(-4, $none, ['a', 'b', 'c']), ['a', 'b', 'c']));

test('update 0 in object', t =>
  t.deepEqual(updateAt(0, 'X', { a: 1, b: 2, c: 3 }), { a: 'X', b: 2, c: 3 }));

test('update 1 in object', t =>
  t.deepEqual(updateAt(1, 'X', { a: 1, b: 2, c: 3 }), { a: 1, b: 'X', c: 3 }));

test('update -1 in object', t =>
  t.deepEqual(updateAt(-1, 'X', { a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 'X' }));

test('update -2 in object', t =>
  t.deepEqual(updateAt(-2, 'X', { a: 1, b: 2, c: 3 }), { a: 1, b: 'X', c: 3 }));

test('update 3 to $none in object', t =>
  t.deepEqual(updateAt(3, $none, { a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 }));

test('update -4 to $none in object', t =>
  t.deepEqual(updateAt(-4, $none, { a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 }));

test('update 0 to $none in object', t =>
  t.deepEqual(updateAt(0, $none, { a: 1, b: 2, c: 3 }), { b: 2, c: 3 }));

test('update 1 to $none in object', t =>
  t.deepEqual(updateAt(1, $none, { a: 1, b: 2, c: 3 }), { a: 1, c: 3 }));

test('update -1 to $none in object', t =>
  t.deepEqual(updateAt(-1, $none, { a: 1, b: 2, c: 3 }), { a: 1, b: 2 }));

test('update -2 to $none in object', t =>
  t.deepEqual(updateAt(-2, $none, { a: 1, b: 2, c: 3 }), { a: 1, c: 3 }));

test('update 3 to $none in object', t =>
  t.deepEqual(updateAt(3, $none, { a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 }));

test('update -4 to $none in object', t =>
  t.deepEqual(updateAt(-4, $none, { a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 }));

test('update 0 in string', t => t.deepEqual(updateAt(0, 'X', 'abc'), 'Xbc'));

test('update 1 in string', t => t.deepEqual(updateAt(1, 'X', 'abc'), 'aXc'));

test('update -1 in string', t => t.deepEqual(updateAt(-1, 'X', 'abc'), 'abX'));

test('update -2 in string', t => t.deepEqual(updateAt(-2, 'X', 'abc'), 'aXc'));

test('update 3 in string', t => t.deepEqual(updateAt(3, 'X', 'abc'), 'abcX'));

test('update 4 in string', t => t.deepEqual(updateAt(4, 'X', 'abc'), 'abc X'));

test('update -4 in string', t => t.deepEqual(updateAt(-4, 'X', 'abc'), 'Xabc'));

test('update -5 in string', t =>
  t.deepEqual(updateAt(-5, 'X', 'abc'), 'X abc'));

test('update 0 to $none in string', t =>
  t.deepEqual(updateAt(0, $none, 'abc'), 'bc'));

test('update 1 to $none in string', t =>
  t.deepEqual(updateAt(1, $none, 'abc'), 'ac'));

test('update -1 to $none in string', t =>
  t.deepEqual(updateAt(-1, $none, 'abc'), 'ab'));

test('update -2 to $none in string', t =>
  t.deepEqual(updateAt(-2, $none, 'abc'), 'ac'));

test('update 3 to $none in string', t =>
  t.deepEqual(updateAt(3, $none, 'abc'), 'abc'));

test('update -4 to $none in string', t =>
  t.deepEqual(updateAt(-4, $none, 'abc'), 'abc'));

test('update 0 in undefined', t => t.throws(() => updateAt(0, 'X', undefined)));

test('update 0 in null', t => t.throws(() => updateAt(0, 'X', null)));

test('update 0 in 0', t => t.throws(() => updateAt(0, 'X', 0)));

test('update 0 in true', t => t.throws(() => updateAt(0, 'X', true)));
