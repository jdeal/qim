import test from 'ava';

import 'babel-core/register';

import { select, update, $apply, $each, $slice } from 'qim/src';

const toUpperCase = s => s.toUpperCase();

const selectEach = (path, input) => select([...path, $each], input);

test('select each empty array', t => t.deepEqual(selectEach([], []), []));

test('select each array', t =>
  t.deepEqual(selectEach([], ['a', 'b', 'c']), ['a', 'b', 'c']));

test('select each slice of array', t =>
  t.deepEqual(selectEach([$slice(0, 2)], ['a', 'b', 'c']), ['a', 'b']));

test('select each empty object', t => t.deepEqual(selectEach([], {}), []));

test('select each object', t =>
  t.deepEqual(selectEach([], { x: 'a', y: 'b', z: 'c' }), ['a', 'b', 'c']));

test('select each slice of object', t =>
  t.deepEqual(selectEach([$slice(0, 2)], { x: 'a', y: 'b', z: 'c' }), [
    'a',
    'b'
  ]));

test('select each empty string', t => t.deepEqual(selectEach([], ''), []));

test('select each string', t =>
  t.deepEqual(selectEach([], 'abc'), ['a', 'b', 'c']));

test('select each slice of string', t =>
  t.deepEqual(selectEach([$slice(0, 2)], 'abc'), ['a', 'b']));

test('select each number', t => t.throws(() => selectEach([], 5)));

test('select each undefined', t => t.throws(() => selectEach([], undefined)));

const updateEach = (path, input) =>
  update([...path, $each, $apply(toUpperCase)], input);

test('update each empty array', t => t.deepEqual(updateEach([], []), []));

test('update each array', t =>
  t.deepEqual(updateEach([], ['a', 'b', 'c']), ['A', 'B', 'C']));

test('update each slice of array', t =>
  t.deepEqual(updateEach([$slice(0, 2)], ['a', 'b', 'c']), ['A', 'B', 'c']));

test('update each empty object', t => t.deepEqual(updateEach([], {}), {}));

test('update each object', t =>
  t.deepEqual(updateEach([], { x: 'a', y: 'b', z: 'c' }), {
    x: 'A',
    y: 'B',
    z: 'C'
  }));

test('update each slice of object', t =>
  t.deepEqual(updateEach([$slice(0, 2)], { x: 'a', y: 'b', z: 'c' }), {
    x: 'A',
    y: 'B',
    z: 'c'
  }));

test('update each empty string', t => t.deepEqual(updateEach([], ''), ''));

test('update each string', t => t.deepEqual(updateEach([], 'abc'), 'ABC'));

test('update each slice of string', t =>
  t.deepEqual(updateEach([$slice(0, 2)], 'abc'), 'ABc'));

test('update each number', t => t.throws(() => updateEach([], 5)));

test('update each undefined', t => t.throws(() => updateEach([], undefined)));
