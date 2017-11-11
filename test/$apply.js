import test from 'ava';

import 'babel-core/register';

import { select, update, $apply, $each } from 'qim/src';

const toUpperCase = s => s.toUpperCase();

const selectApply = (path, input) =>
  select([...path, $apply(toUpperCase)], input);

test('select from string', t => t.deepEqual(selectApply([], 'a'), ['A']));

test('select from index of array', t =>
  t.deepEqual(selectApply([0], ['a']), ['A']));

test('select from property of object', t =>
  t.deepEqual(selectApply(['x'], { x: 'a' }), ['A']));

test('select from index of string', t =>
  t.deepEqual(selectApply([0], 'abc'), ['A']));

test('select from each of array', t =>
  t.deepEqual(selectApply([$each], ['a', 'b', 'c']), ['A', 'B', 'C']));

test('select from each of object', t =>
  t.deepEqual(selectApply([$each], { x: 'a', y: 'b' }), ['A', 'B']));

test('select from each of string', t =>
  t.deepEqual(selectApply([$each], 'abc'), ['A', 'B', 'C']));

const updateApply = (path, input) =>
  update([...path, $apply(toUpperCase)], input);

test('update of string', t => t.deepEqual(updateApply([], 'a'), 'A'));

test('update index of array', t => t.deepEqual(updateApply([0], ['a']), ['A']));

test('update property of object', t =>
  t.deepEqual(updateApply(['x'], { x: 'a' }), { x: 'A' }));

test('update index of string', t =>
  t.deepEqual(updateApply([0], 'abc'), 'Abc'));

test('update each of array', t =>
  t.deepEqual(updateApply([$each], ['a', 'b', 'c']), ['A', 'B', 'C']));

test('update each of object', t =>
  t.deepEqual(updateApply([$each], { x: 'a', y: 'b' }), { x: 'A', y: 'B' }));

test('update each of string', t =>
  t.deepEqual(updateApply([$each], 'abc'), 'ABC'));
