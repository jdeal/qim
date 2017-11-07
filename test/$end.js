import test from 'ava';
import util from 'util';

import 'babel-core/register';

import {
  select,
  update,
  $end,
  $set,
  $none,
} from 'qim/src';

const selectEndMacro = (t, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => select([$end], input));
    return;
  }
  const result = select([$end], input);
  t.deepEqual(result, expected);
};

selectEndMacro.title = (title, input) => `select $end of ${util.inspect(input)}`;

test(selectEndMacro, ['a', 'b', 'c'], [[]]);
test(selectEndMacro, {a: 1, b: 2, c: 3}, [{}]);
test(selectEndMacro, 'abc', ['']);
test(selectEndMacro, 5, new Error());
test(selectEndMacro, undefined, new Error());

const updateBeginMacro = (t, beginArray, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => update([$end, $set(beginArray)], input));
    return;
  }
  const result = update([$end, $set(beginArray)], input);
  t.deepEqual(result, expected);
};

updateBeginMacro.title = (title, beginArray, input) => `update $end of ${util.inspect(input)} with ${util.inspect(beginArray)}`;

test(updateBeginMacro, 'X', ['a', 'b', 'c'], ['a', 'b', 'c', 'X']);
test(updateBeginMacro, ['X'], ['a', 'b', 'c'], ['a', 'b', 'c', 'X']);
test(updateBeginMacro, [], ['a', 'b', 'c'], ['a', 'b', 'c']);
test(updateBeginMacro, $none, ['a', 'b', 'c'], ['a', 'b', 'c']);
test(updateBeginMacro, {x: 1}, ['a', 'b', 'c'], ['a', 'b', 'c', {x: 1}]);
test(updateBeginMacro, undefined, ['a', 'b', 'c'], ['a', 'b', 'c', undefined]);

test(updateBeginMacro, {x: 10}, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3, x: 10});
test(updateBeginMacro, {}, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(updateBeginMacro, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(updateBeginMacro, [10], {a: 1, b: 2, c: 3}, {0: 10, a: 1, b: 2, c: 3});
test(updateBeginMacro, 'x', {a: 1, b: 2, c: 3}, {0: 'x', a: 1, b: 2, c: 3});
test(updateBeginMacro, undefined, {a: 1, b: 2, c: 3}, new Error());
test(updateBeginMacro, 1, {a: 1, b: 2, c: 3}, new Error());

test(updateBeginMacro, 'X', 'abc', 'abcX');
test(updateBeginMacro, ['X'], 'abc', 'abcX');
test(updateBeginMacro, '', 'abc', 'abc');
test(updateBeginMacro, [], 'abc', 'abc');
test(updateBeginMacro, $none, 'abc', 'abc');
test(updateBeginMacro, 5, 'abc', 'abc5');
test(updateBeginMacro, undefined, 'abc', 'abcundefined');

test(updateBeginMacro, ['X'], 0, new Error());
test(updateBeginMacro, ['X'], true, new Error());
test(updateBeginMacro, ['X'], undefined, new Error());
