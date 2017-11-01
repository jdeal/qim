import test from 'ava';
import util from 'util';

import 'babel-core/register';

import {
  update,
  $at,
  $set,
  $none,
} from 'qim/src';

const atMacro = (t, index, value, input, expected) => {
  const result = update([$at(index), $set(value)], input);
  t.deepEqual(result, expected);
};

atMacro.title = (title, index, value) => `$at(${index}) $set(${util.inspect(value)})`;

test(atMacro, 0, 'X', ['a', 'b', 'c'], ['X', 'b', 'c']);
test(atMacro, 1, 'X', ['a', 'b', 'c'], ['a', 'X', 'c']);
test(atMacro, -1, 'X', ['a', 'b', 'c'], ['a', 'b', 'X']);
test(atMacro, -2, 'X', ['a', 'b', 'c'], ['a', 'X', 'c']);
test(atMacro, 3, 'X', ['a', 'b', 'c'], ['a', 'b', 'c', 'X']);
test(atMacro, 4, 'X', ['a', 'b', 'c'], ['a', 'b', 'c', undefined, 'X']);
test(atMacro, -4, 'X', ['a', 'b', 'c'], ['X', 'a', 'b', 'c']);
test(atMacro, -5, 'X', ['a', 'b', 'c'], ['X', undefined, 'a', 'b', 'c']);
test(atMacro, 0, $none, ['a', 'b', 'c'], ['b', 'c']);
test(atMacro, 1, $none, ['a', 'b', 'c'], ['a', 'c']);
test(atMacro, -1, $none, ['a', 'b', 'c'], ['a', 'b']);
test(atMacro, -2, $none, ['a', 'b', 'c'], ['a', 'c']);
test(atMacro, 3, $none, ['a', 'b', 'c'], ['a', 'b', 'c']);
test(atMacro, -4, $none, ['a', 'b', 'c'], ['a', 'b', 'c']);

test(atMacro, 0, 'X', {a: 1, b: 2, c: 3}, {a: 'X', b: 2, c: 3});
test(atMacro, 1, 'X', {a: 1, b: 2, c: 3}, {a: 1, b: 'X', c: 3});
test(atMacro, -1, 'X', {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 'X'});
test(atMacro, -2, 'X', {a: 1, b: 2, c: 3}, {a: 1, b: 'X', c: 3});
test(atMacro, 3, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(atMacro, -4, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(atMacro, 0, $none, {a: 1, b: 2, c: 3}, {b: 2, c: 3});
test(atMacro, 1, $none, {a: 1, b: 2, c: 3}, {a: 1, c: 3});
test(atMacro, -1, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2});
test(atMacro, -2, $none, {a: 1, b: 2, c: 3}, {a: 1, c: 3});
test(atMacro, 3, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(atMacro, -4, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});

test(atMacro, 0, 'X', 'abc', 'Xbc');
test(atMacro, 1, 'X', 'abc', 'aXc');
test(atMacro, -1, 'X', 'abc', 'abX');
test(atMacro, -2, 'X', 'abc', 'aXc');
test(atMacro, 3, 'X', 'abc', 'abcX');
test(atMacro, 4, 'X', 'abc', 'abc X');
test(atMacro, -4, 'X', 'abc', 'Xabc');
test(atMacro, -5, 'X', 'abc', 'X abc');
test(atMacro, 0, $none, 'abc', 'bc');
test(atMacro, 1, $none, 'abc', 'ac');
test(atMacro, -1, $none, 'abc', 'ab');
test(atMacro, -2, $none, 'abc', 'ac');
test(atMacro, 3, $none, 'abc', 'abc');
test(atMacro, -4, $none, 'abc', 'abc');

test(atMacro, 0, 'X', undefined, undefined);
test(atMacro, 0, 'X', null, null);
test(atMacro, 0, 'X', 0, 0);
test(atMacro, 0, 'X', true, true);
