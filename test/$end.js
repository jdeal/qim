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

const updateEndMacro = (t, beginArray, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => update([$end, $set(beginArray)], input));
    return;
  }
  const result = update([$end, $set(beginArray)], input);
  t.deepEqual(result, expected);
};

updateEndMacro.title = (title, beginArray, input) => `update $end of ${util.inspect(input)} with ${util.inspect(beginArray)}`;

test(updateEndMacro, 'X', ['a', 'b', 'c'], ['a', 'b', 'c', 'X']);
test(updateEndMacro, ['X'], ['a', 'b', 'c'], ['a', 'b', 'c', 'X']);
test(updateEndMacro, [], ['a', 'b', 'c'], ['a', 'b', 'c']);
test(updateEndMacro, $none, ['a', 'b', 'c'], ['a', 'b', 'c']);
test(updateEndMacro, {x: 1}, ['a', 'b', 'c'], ['a', 'b', 'c', {x: 1}]);
test(updateEndMacro, undefined, ['a', 'b', 'c'], ['a', 'b', 'c', undefined]);

test(updateEndMacro, {x: 10}, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3, x: 10});
test(updateEndMacro, {}, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(updateEndMacro, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
test(updateEndMacro, [10], {a: 1, b: 2, c: 3}, {0: 10, a: 1, b: 2, c: 3});
test(updateEndMacro, 'x', {a: 1, b: 2, c: 3}, {0: 'x', a: 1, b: 2, c: 3});
test(updateEndMacro, undefined, {a: 1, b: 2, c: 3}, new Error());
test(updateEndMacro, 1, {a: 1, b: 2, c: 3}, new Error());

test(updateEndMacro, 'X', 'abc', 'abcX');
test(updateEndMacro, ['X'], 'abc', 'abcX');
test(updateEndMacro, '', 'abc', 'abc');
test(updateEndMacro, [], 'abc', 'abc');
test(updateEndMacro, $none, 'abc', 'abc');
test(updateEndMacro, 5, 'abc', 'abc5');
test(updateEndMacro, undefined, 'abc', 'abcundefined');

test(updateEndMacro, ['X'], 0, new Error());
test(updateEndMacro, ['X'], true, new Error());
test(updateEndMacro, ['X'], undefined, new Error());
