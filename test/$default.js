import test from 'ava';

import 'babel-core/register';

import { select, update, $default, $at, $set } from 'qim/src';

test('select property from default object', t =>
  t.deepEqual(select(['a', $default({}), 'b'], {}), []));

test('select default value from property of default object', t =>
  t.deepEqual(select(['a', $default({}), 'b', $default(0)], {}), [0]));

test('select default string from index of string', t =>
  t.deepEqual(select([$at(0), $default('x')], ''), ['x']));

test('update property of default object to number', t =>
  t.deepEqual(update(['a', $default({}), 'b', $set(1)], {}), { a: { b: 1 } }));

test('update index of default array to string', t =>
  t.deepEqual(update(['a', $default([]), 0, $set('x')], {}), { a: ['x'] }));

test('update with default non-empty object', t =>
  t.deepEqual(update(['a', $default({ b: 0 }), 'c', $set(1)], {}), {
    a: { b: 0, c: 1 }
  }));

test('update with default non-empty array', t =>
  t.deepEqual(update(['a', $default(['x']), 1, $set('y')], {}), {
    a: ['x', 'y']
  }));

test('update default of undefined', t =>
  t.deepEqual(update([$default({})], undefined), {}));

test('update default of undefined with set property', t =>
  t.deepEqual(update([$default({}), 'a', $set(1)], undefined), { a: 1 }));

test('update default of undefined to array', t =>
  t.deepEqual(update([$default([])], undefined), []));

test('update default of undefined to array and set index', t =>
  t.deepEqual(update([$default([]), 0, $set('x')], undefined), ['x']));

test('update default of array and set index to string', t =>
  t.deepEqual(update([0, $default('x')], []), ['x']));

test('update default of array and set position to string', t =>
  t.deepEqual(update([$at(0), $default('x')], ''), 'x'));
