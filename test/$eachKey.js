import test from 'ava';

import 'babel-core/register';

import { select, update, $apply, $eachKey, $none, $slice } from 'qim/src';

const selectEachKey = (path, input) => select([...path, $eachKey], input);

test('select each key empty array', t =>
  t.deepEqual(selectEachKey([], []), []));

test('select each key array', t =>
  t.deepEqual(selectEachKey([], ['a', 'b', 'c']), [0, 1, 2]));

test('select each key slice of array', t =>
  t.deepEqual(selectEachKey([$slice(0, 2)], ['a', 'b', 'c']), [0, 1]));

test('select each key empty object', t =>
  t.deepEqual(selectEachKey([], {}), []));

test('select each key object', t =>
  t.deepEqual(selectEachKey([], { x: 'a', y: 'b', z: 'c' }), ['x', 'y', 'z']));

test('select each key slice of object', t =>
  t.deepEqual(selectEachKey([$slice(0, 2)], { x: 'a', y: 'b', z: 'c' }), [
    'x',
    'y'
  ]));

test('select each key empty string', t =>
  t.deepEqual(selectEachKey([], ''), []));

test('select each key string', t =>
  t.deepEqual(selectEachKey([], 'abc'), [0, 1, 2]));

test('select each key slice of string', t =>
  t.deepEqual(selectEachKey([$slice(0, 2)], 'abc'), [0, 1]));

test('select each key number', t => t.throws(() => selectEachKey([], 5)));

test('select each key undefined', t =>
  t.throws(() => selectEachKey([], undefined)));

const updateEachKey = (path, fn, input) =>
  update([...path, $eachKey, $apply(fn)], input);

const toUpper = s => s.toUpperCase();

test('update each key array with 2 - key', t =>
  t.deepEqual(updateEachKey([], key => 2 - key, ['a', 'b', 'c']), [
    'c',
    'b',
    'a'
  ]));

test('update each key array with 3 - key', t =>
  t.deepEqual(updateEachKey([], key => 3 - key, ['a', 'b', 'c']), [
    'c',
    'b',
    'a'
  ]));

test('update each key array with none key', t =>
  t.deepEqual(
    updateEachKey([], key => (key === 1 ? $none : key), ['a', 'b', 'c']),
    ['a', 'c']
  ));

test('update each key array with undefined key', t =>
  t.deepEqual(
    updateEachKey([], key => (key === 1 ? undefined : key), ['a', 'b', 'c']),
    ['a', 'c']
  ));

test('update each key array with key + 1', t =>
  t.deepEqual(updateEachKey([], key => key + 1, ['a', 'b', 'c']), [
    'a',
    'b',
    'c'
  ]));

test('update each key array with same key', t =>
  t.deepEqual(updateEachKey([], () => 0, ['a', 'b', 'c']), ['c']));

test('update each key array with x key', t =>
  t.deepEqual(updateEachKey([], () => 'x', ['a', 'b', 'c']), []));

const arrayWithHoles = ['a'];
arrayWithHoles[2] = 'c';

test('update each key array with holes with key + 1', t =>
  t.deepEqual(updateEachKey([], key => key + 1, arrayWithHoles), [
    'a',
    undefined,
    'c'
  ]));

test('update each key empty object', t =>
  t.deepEqual(updateEachKey([], toUpper, {}), {}));

test('update each key object', t =>
  t.deepEqual(updateEachKey([], toUpper, { x: 'a', y: 'b', z: 'c' }), {
    X: 'a',
    Y: 'b',
    Z: 'c'
  }));

test('update each key object with none key', t =>
  t.deepEqual(
    updateEachKey([], key => (key === 'y' ? $none : key), {
      x: 'a',
      y: 'b',
      z: 'c'
    }),
    { x: 'a', z: 'c' }
  ));

test('update each key object with undefined key', t =>
  t.deepEqual(
    updateEachKey([], key => (key === 'y' ? undefined : key), {
      x: 'a',
      y: 'b',
      z: 'c'
    }),
    { x: 'a', undefined: 'b', z: 'c' }
  ));

test('update each key object with same key', t =>
  t.deepEqual(updateEachKey([], () => 'x', { x: 'a', y: 'b', z: 'c' }), {
    x: 'c'
  }));

test('update each key slice of object', t =>
  t.deepEqual(
    updateEachKey([$slice(0, 2)], toUpper, { x: 'a', y: 'b', z: 'c' }),
    { X: 'a', Y: 'b', z: 'c' }
  ));

test('update each key empty string', t =>
  t.deepEqual(updateEachKey([], toUpper, ''), ''));

test('update each key string with 2 - key', t =>
  t.deepEqual(updateEachKey([], key => 2 - key, 'abc'), 'cba'));

test('update each key string with 3 - key', t =>
  t.deepEqual(updateEachKey([], key => 3 - key, 'abc'), 'cba'));

test('update each key string with none key', t =>
  t.deepEqual(
    updateEachKey([], key => (key === 1 ? $none : key), 'abc'),
    'ac'
  ));

test('update each key string with key + 1', t =>
  t.deepEqual(updateEachKey([], key => key + 1, 'abc'), 'abc'));

test('update each key string with same key', t =>
  t.deepEqual(updateEachKey([], () => 0, 'abc'), 'c'));

test('update each key string with x key', t =>
  t.deepEqual(updateEachKey([], () => 'x', 'abc'), ''));
