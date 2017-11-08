import test from 'ava';

import 'babel-core/register';

import {getType, valueToString} from './_TestUtils';

import {
  select,
  update,
  $at,
  $set,
  $none,
} from 'qim/src';

const selectAtMacro = (t, index, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => select([$at(index)], input));
    return;
  }
  const result = select([$at(index)], input);
  t.deepEqual(result, expected);
};

selectAtMacro.title = (title, index, input) => `select at ${index} from ${getType(input)}`;

test(selectAtMacro, 0, ['a', 'b', 'c'], ['a']);
test(selectAtMacro, 1, ['a', 'b', 'c'], ['b']);
test(selectAtMacro, -1, ['a', 'b', 'c'], ['c']);
test(selectAtMacro, -2, ['a', 'b', 'c'], ['b']);
test(selectAtMacro, 3, ['a', 'b', 'c'], [undefined]);
test(selectAtMacro, -4, ['a', 'b', 'c'], [undefined]);

test(selectAtMacro, 0, {a: 1, b: 2, c: 3}, [1]);
test(selectAtMacro, 1, {a: 1, b: 2, c: 3}, [2]);
test(selectAtMacro, -1, {a: 1, b: 2, c: 3}, [3]);
test(selectAtMacro, -2, {a: 1, b: 2, c: 3}, [2]);
test(selectAtMacro, 3, {a: 1, b: 2, c: 3}, [undefined]);
test(selectAtMacro, -4, {a: 1, b: 2, c: 3}, [undefined]);

test(selectAtMacro, 0, 'abc', ['a']);
test(selectAtMacro, 1, 'abc', ['b']);
test(selectAtMacro, -1, 'abc', ['c']);
test(selectAtMacro, -2, 'abc', ['b']);
test(selectAtMacro, 3, 'abc', [undefined]);
test(selectAtMacro, -4, 'abc', [undefined]);

test(selectAtMacro, 0, undefined, new Error());
test(selectAtMacro, 0, null, new Error());
test(selectAtMacro, 0, 0, new Error());
test(selectAtMacro, 0, true, new Error());

const updateAtMacro = (t, index, value, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => select([$at(index)], input));
    return;
  }
  const result = update([$at(index), $set(value)], input);
  t.deepEqual(result, expected);
};

updateAtMacro.title = (title, index, value, input) => `update at ${index} set to ${valueToString(value)} for ${getType(input)}`;

test(updateAtMacro, 0, 'X', ['a', 'b', 'c'], ['X', 'b', 'c']);
test(updateAtMacro, 1, 'X', ['a', 'b', 'c'], ['a', 'X', 'c']);
test(updateAtMacro, -1, 'X', ['a', 'b', 'c'], ['a', 'b', 'X']);
test(updateAtMacro, -2, 'X', ['a', 'b', 'c'], ['a', 'X', 'c']);
test(updateAtMacro, 3, 'X', ['a', 'b', 'c'], ['a', 'b', 'c', 'X']);
test(updateAtMacro, 4, 'X', ['a', 'b', 'c'], ['a', 'b', 'c', undefined, 'X']);
test(updateAtMacro, -4, 'X', ['a', 'b', 'c'], ['X', 'a', 'b', 'c']);
test(updateAtMacro, -5, 'X', ['a', 'b', 'c'], ['X', undefined, 'a', 'b', 'c']);
test(updateAtMacro, 0, $none, ['a', 'b', 'c'], ['b', 'c']);
test(updateAtMacro, 1, $none, ['a', 'b', 'c'], ['a', 'c']);
test(updateAtMacro, -1, $none, ['a', 'b', 'c'], ['a', 'b']);
test(updateAtMacro, -2, $none, ['a', 'b', 'c'], ['a', 'c']);
test(updateAtMacro, 3, $none, ['a', 'b', 'c'], ['a', 'b', 'c']);
test(updateAtMacro, -4, $none, ['a', 'b', 'c'], ['a', 'b', 'c']);

test(updateAtMacro, 0, 'X', {a: 1, b: 2, c: 3}, {a: 'X', b: 2, c: 3});
test(updateAtMacro, 1, 'X', {a: 1, b: 2, c: 3}, {a: 1, b: 'X', c: 3});
test(updateAtMacro, -1, 'X', {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 'X'});
test(updateAtMacro, -2, 'X', {a: 1, b: 2, c: 3}, {a: 1, b: 'X', c: 3});
test(updateAtMacro, 3, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(updateAtMacro, -4, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(updateAtMacro, 0, $none, {a: 1, b: 2, c: 3}, {b: 2, c: 3});
test(updateAtMacro, 1, $none, {a: 1, b: 2, c: 3}, {a: 1, c: 3});
test(updateAtMacro, -1, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2});
test(updateAtMacro, -2, $none, {a: 1, b: 2, c: 3}, {a: 1, c: 3});
test(updateAtMacro, 3, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(updateAtMacro, -4, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});

test(updateAtMacro, 0, 'X', 'abc', 'Xbc');
test(updateAtMacro, 1, 'X', 'abc', 'aXc');
test(updateAtMacro, -1, 'X', 'abc', 'abX');
test(updateAtMacro, -2, 'X', 'abc', 'aXc');
test(updateAtMacro, 3, 'X', 'abc', 'abcX');
test(updateAtMacro, 4, 'X', 'abc', 'abc X');
test(updateAtMacro, -4, 'X', 'abc', 'Xabc');
test(updateAtMacro, -5, 'X', 'abc', 'X abc');
test(updateAtMacro, 0, $none, 'abc', 'bc');
test(updateAtMacro, 1, $none, 'abc', 'ac');
test(updateAtMacro, -1, $none, 'abc', 'ab');
test(updateAtMacro, -2, $none, 'abc', 'ac');
test(updateAtMacro, 3, $none, 'abc', 'abc');
test(updateAtMacro, -4, $none, 'abc', 'abc');

test(updateAtMacro, 0, 'X', undefined, new Error());
test(updateAtMacro, 0, 'X', null, new Error());
test(updateAtMacro, 0, 'X', 0, new Error());
test(updateAtMacro, 0, 'X', true, new Error());
