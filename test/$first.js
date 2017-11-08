import test from 'ava';
import util from 'util';

import 'babel-core/register';

import {
  select,
  update,
  $first,
  $set,
  $none,
} from 'qim/src';

const selectFirstMacro = (t, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => select([$first], input));
    return;
  }
  const result = select([$first], input);
  t.deepEqual(result, expected);
};

selectFirstMacro.title = (title, input) => `select $first of ${util.inspect(input)}`;

test(selectFirstMacro, ['a', 'b', 'c'], ['a']);
test(selectFirstMacro, {a: 1, b: 2, c: 3}, [1]);
test(selectFirstMacro, 'abc', ['a']);
test(selectFirstMacro, 5, new Error());
test(selectFirstMacro, undefined, new Error());

const updateFirstMacro = (t, firstValue, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => update([$first, $set(firstValue)], input));
    return;
  }
  const result = update([$first, $set(firstValue)], input);
  t.deepEqual(result, expected);
};

updateFirstMacro.title = (title, firstValue, input) => `update $first of ${util.inspect(input)} with ${util.inspect(firstValue)}`;

test(updateFirstMacro, 'X', ['a', 'b', 'c'], ['X', 'b', 'c']);
test(updateFirstMacro, $none, ['a', 'b', 'c'], ['b', 'c']);
test(updateFirstMacro, undefined, ['a', 'b', 'c'], [undefined, 'b', 'c']);

test(updateFirstMacro, 10, {a: 1, b: 2, c: 3}, {a: 10, b: 2, c: 3});
test(updateFirstMacro, $none, {a: 1, b: 2, c: 3}, {b: 2, c: 3});
test(updateFirstMacro, undefined, {a: 1, b: 2, c: 3}, {a: undefined, b: 2, c: 3});

test(updateFirstMacro, 'X', 'abc', 'Xbc');
test(updateFirstMacro, '', 'abc', 'bc');
test(updateFirstMacro, $none, 'abc', 'bc');
test(updateFirstMacro, 5, 'abc', '5bc');
test(updateFirstMacro, undefined, 'abc', 'undefinedbc');

test(updateFirstMacro, 'X', 0, new Error());
test(updateFirstMacro, 'X', true, new Error());
test(updateFirstMacro, 'X', undefined, new Error());
