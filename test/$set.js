import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  $set,
  $none,
  $each
} from 'qim/src';

const selectSetMacro = (t, path, value, input, expected) => {
  const fn = () => select([...path, $set(value)], input);
  if (expected instanceof Error) {
    t.throws(fn);
    return;
  }
  const result = fn();
  t.deepEqual(result, expected);
};

selectSetMacro.title = (title) => `set ${title}`;

test('primitive', selectSetMacro, [], 1, 0, [1]);
test('object', selectSetMacro, [], 1, {x: 1}, [1]);
test('path in object', selectSetMacro, ['x'], 1, {x: 0}, [1]);
test('path in string', selectSetMacro, [1], 'X', 'abc', ['X']);
test('each item of array', selectSetMacro, [$each], 'x', ['a', 'b', 'c'], ['x', 'x', 'x']);

const updateSetMacro = (t, path, value, input, expected) => {
  const fn = () => update([...path, $set(value)], input);
  if (expected instanceof Error) {
    t.throws(fn);
    return;
  }
  const result = fn();
  t.deepEqual(result, expected);
};

updateSetMacro.title = (title) => `update ${title}`;

test('primitive', updateSetMacro, [], 1, 0, 1);
test('object', updateSetMacro, [], 1, {x: 1}, 1);
test('path in array', updateSetMacro, [1], 'X', ['a', 'b', 'c'], ['a', 'X', 'c']);
test('path in array to $none', updateSetMacro, [1], $none, ['a', 'b', 'c'], ['a', 'c']);
test('new path in array', updateSetMacro, [2], 'X', ['a', 'b'], ['a', 'b', 'X']);
test('path in object', updateSetMacro, ['x'], 1, {x: 0}, {x: 1});
test('new path in object', updateSetMacro, ['x'], 1, {a: 0}, {a: 0, x: 1});
test('path in object to $none', updateSetMacro, ['x'], $none, {x: 0, y: 1}, {y: 1});
test('path in string', updateSetMacro, [1], 'X', 'abc', 'aXc');
test('each item of array', updateSetMacro, [$each], 'x', ['a', 'b', 'c'], ['x', 'x', 'x']);
test('each item of object', updateSetMacro, [$each], 10, {a: 1, b: 2, c: 3}, {a: 10, b: 10, c: 10});
test('each item of string', updateSetMacro, [$each], 'X', 'abc', 'XXX');

test('new path in array with holes', t => {
  const array = ['a'];
  array[2] = 'c';
  t.deepEqual(
    update([3, $set('X')], array),
    ['a', undefined, 'c', 'X']
  );
  t.false(1 in array);
});

test('new path and a new hole in an array', t => {
  const array = ['a'];
  t.deepEqual(
    update([2, $set('X')], array),
    ['a', undefined, 'X']
  );
  t.false(1 in array);
});
