import test from 'ava';

import 'babel-core/register';

import { select, update, $apply, $eachPair, $none, $slice } from 'qim/src';

const selectEachPair = (path, input) => select([...path, $eachPair], input);

test('select each pair empty array', t =>
  t.deepEqual(selectEachPair([], []), []));

test('select each pair array', t =>
  t.deepEqual(selectEachPair([], ['a', 'b', 'c']), [
    [0, 'a'],
    [1, 'b'],
    [2, 'c']
  ]));

test('select each pair slice of array', t =>
  t.deepEqual(selectEachPair([$slice(0, 2)], ['a', 'b', 'c']), [
    [0, 'a'],
    [1, 'b']
  ]));

test('select each pair empty object', t =>
  t.deepEqual(selectEachPair([], {}), []));

test('select each pair object', t =>
  t.deepEqual(selectEachPair([], { x: 'a', y: 'b', z: 'c' }), [
    ['x', 'a'],
    ['y', 'b'],
    ['z', 'c']
  ]));

test('select each pair slice of object', t =>
  t.deepEqual(selectEachPair([$slice(0, 2)], { x: 'a', y: 'b', z: 'c' }), [
    ['x', 'a'],
    ['y', 'b']
  ]));

test('select each pair empty string', t =>
  t.deepEqual(selectEachPair([], ''), []));

test('select each pair string', t =>
  t.deepEqual(selectEachPair([], 'abc'), [[0, 'a'], [1, 'b'], [2, 'c']]));

test('select each pair slice of string', t =>
  t.deepEqual(selectEachPair([$slice(0, 2)], 'abc'), [[0, 'a'], [1, 'b']]));

test('select each pair number', t => t.throws(() => selectEachPair([], 5)));

test('select each pair undefined', t =>
  t.throws(() => selectEachPair([], undefined)));

const updateEachPair = (path, fn, input) =>
  update([...path, $eachPair, $apply(fn)], input);

const toUpper = ([k, v]) => [k.toUpperCase(), v.toUpperCase()];
const createUpperFn = keyFn => ([k, v]) => [keyFn(k), v ? v.toUpperCase() : v];

test('update each pair array with 2 - key', t =>
  t.deepEqual(
    updateEachPair([], createUpperFn(key => 2 - key), ['a', 'b', 'c']),
    ['C', 'B', 'A']
  ));

test('update each pair array with 3 - key', t =>
  t.deepEqual(
    updateEachPair([], createUpperFn(key => 3 - key), ['a', 'b', 'c']),
    ['C', 'B', 'A']
  ));

test('update each pair array with none key', t =>
  t.deepEqual(
    updateEachPair([], createUpperFn(key => (key === 1 ? $none : key)), [
      'a',
      'b',
      'c'
    ]),
    ['A', 'C']
  ));

test('update each pair array with undefined key', t =>
  t.deepEqual(
    updateEachPair([], createUpperFn(key => (key === 1 ? undefined : key)), [
      'a',
      'b',
      'c'
    ]),
    ['A', 'C']
  ));

test('update each pair array with key + 1', t =>
  t.deepEqual(
    updateEachPair([], createUpperFn(key => key + 1), ['a', 'b', 'c']),
    ['A', 'B', 'C']
  ));

test('update each pair array with same key', t =>
  t.deepEqual(updateEachPair([], createUpperFn(() => 0), ['a', 'b', 'c']), [
    'C'
  ]));

test('update each pair array with x key', t =>
  t.deepEqual(
    updateEachPair([], createUpperFn(() => 'x'), ['a', 'b', 'c']),
    []
  ));

const arrayWithHoles = ['a'];
arrayWithHoles[2] = 'c';

test('update each pair array with holes with key + 1', t =>
  t.deepEqual(
    updateEachPair([], createUpperFn(key => key + 1), arrayWithHoles),
    ['A', undefined, 'C']
  ));

test('update each pair empty object', t =>
  t.deepEqual(updateEachPair([], toUpper, {}), {}));

test('update each pair object', t =>
  t.deepEqual(updateEachPair([], toUpper, { x: 'a', y: 'b', z: 'c' }), {
    X: 'A',
    Y: 'B',
    Z: 'C'
  }));

test('update each pair object with none pair', t =>
  t.deepEqual(
    updateEachPair([], pair => (pair[0] === 'y' ? $none : pair), {
      x: 'a',
      y: 'b',
      z: 'c'
    }),
    { x: 'a', z: 'c' }
  ));

test('update each pair object with undefined pair', t =>
  t.deepEqual(
    updateEachPair([], pair => (pair[0] === 'y' ? undefined : pair), {
      x: 'a',
      y: 'b',
      z: 'c'
    }),
    { x: 'a', z: 'c' }
  ));

test('update each pair object with same key', t =>
  t.deepEqual(
    updateEachPair([], createUpperFn(() => 'x'), { x: 'a', y: 'b', z: 'c' }),
    { x: 'C' }
  ));

test('update each pair slice of object', t =>
  t.deepEqual(
    updateEachPair([$slice(0, 2)], toUpper, { x: 'a', y: 'b', z: 'c' }),
    { X: 'A', Y: 'B', z: 'c' }
  ));

test('update each pair empty string', t =>
  t.deepEqual(updateEachPair([], toUpper, ''), ''));

test('update each pair string with 2 - key', t =>
  t.deepEqual(updateEachPair([], createUpperFn(key => 2 - key), 'abc'), 'CBA'));

test('update each pair string with 3 - key', t =>
  t.deepEqual(updateEachPair([], createUpperFn(key => 3 - key), 'abc'), 'CBA'));

test('update each pair string with none key', t =>
  t.deepEqual(
    updateEachPair([], createUpperFn(key => (key === 1 ? $none : key)), 'abc'),
    'AC'
  ));

test('update each pair string with key + 1', t =>
  t.deepEqual(updateEachPair([], createUpperFn(key => key + 1), 'abc'), 'ABC'));

test('update each pair string with same key', t =>
  t.deepEqual(updateEachPair([], createUpperFn(() => 0), 'abc'), 'C'));

test('update each pair string with x key', t =>
  t.deepEqual(updateEachPair([], createUpperFn(() => 'x'), 'abc'), ''));
