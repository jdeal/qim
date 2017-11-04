import test from 'ava';
import util from 'util';

import 'babel-core/register';

import {
  select,
  update,
  $begin,
  $set,
  $none,
} from 'qim/src';

const selectBeginMacro = (t, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => select([$begin], input));
    return;
  }
  const result = select([$begin], input);
  t.deepEqual(result, expected);
};

selectBeginMacro.title = (title, input) => `select $begin of ${util.inspect(input)}`;

test(selectBeginMacro, ['a', 'b', 'c'], [[]]);
test(selectBeginMacro, {a: 1, b: 2, c: 3}, [{}]);
test(selectBeginMacro, 'abc', ['']);
test(selectBeginMacro, 5, new Error());
test(selectBeginMacro, undefined, new Error());

const updateBeginMacro = (t, beginArray, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => update([$begin, $set(beginArray)], input));
    return;
  }
  const result = update([$begin, $set(beginArray)], input);
  t.deepEqual(result, expected);
};

updateBeginMacro.title = (title, beginArray, input) => `update $begin of ${util.inspect(input)} with ${util.inspect(beginArray)}`;

test(updateBeginMacro, 'X', ['a', 'b', 'c'], ['X', 'a', 'b', 'c']);
test(updateBeginMacro, ['X'], ['a', 'b', 'c'], ['X', 'a', 'b', 'c']);
test(updateBeginMacro, [], ['a', 'b', 'c'], ['a', 'b', 'c']);
test(updateBeginMacro, $none, ['a', 'b', 'c'], ['a', 'b', 'c']);
test(updateBeginMacro, {x: 1}, ['a', 'b', 'c'], [{x: 1}, 'a', 'b', 'c']);
test(updateBeginMacro, undefined, ['a', 'b', 'c'], [undefined, 'a', 'b', 'c']);

test(updateBeginMacro, {x: 10}, {a: 1, b: 2, c: 3}, {x: 10, a: 1, b: 2, c: 3});
test(updateBeginMacro, {}, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(updateBeginMacro, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(updateBeginMacro, [10], {a: 1, b: 2, c: 3}, {0: 10, a: 1, b: 2, c: 3});
test(updateBeginMacro, 'x', {a: 1, b: 2, c: 3}, {0: 'x', a: 1, b: 2, c: 3});
test(updateBeginMacro, undefined, {a: 1, b: 2, c: 3}, new Error());
test(updateBeginMacro, 1, {a: 1, b: 2, c: 3}, new Error());

test(updateBeginMacro, 'X', 'abc', 'Xabc');
test(updateBeginMacro, ['X'], 'abc', 'Xabc');
test(updateBeginMacro, '', 'abc', 'abc');
test(updateBeginMacro, [], 'abc', 'abc');
test(updateBeginMacro, $none, 'abc', 'abc');
test(updateBeginMacro, 5, 'abc', '5abc');
test(updateBeginMacro, undefined, 'abc', 'undefinedabc');

test(updateBeginMacro, ['X'], 0, new Error());
test(updateBeginMacro, ['X'], true, new Error());
test(updateBeginMacro, ['X'], undefined, new Error());
