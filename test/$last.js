import test from 'ava';
import util from 'util';

import 'babel-core/register';

import {valueToString} from './_TestUtils';

import {
  select,
  update,
  $last,
  $set,
  $none,
} from 'qim/src';

const selectLastMacro = (t, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => select([$last], input));
    return;
  }
  const result = select([$last], input);
  t.deepEqual(result, expected);
};

selectLastMacro.title = (title, input) => `select $last of ${util.inspect(input)}`;

test(selectLastMacro, ['a', 'b', 'c'], ['c']);
test(selectLastMacro, {a: 1, b: 2, c: 3}, [3]);
test(selectLastMacro, 'abc', ['c']);
test(selectLastMacro, 5, new Error());
test(selectLastMacro, undefined, new Error());

const updateLastMacro = (t, lastValue, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => update([$last, $set(lastValue)], input));
    return;
  }
  const result = update([$last, $set(lastValue)], input);
  t.deepEqual(result, expected);
};

updateLastMacro.title = (title, lastValue, input) => `update $last set to ${valueToString(lastValue)} for ${util.inspect(input)}`;

test(updateLastMacro, 'X', ['a', 'b', 'c'], ['a', 'b', 'X']);
test(updateLastMacro, $none, ['a', 'b', 'c'], ['a', 'b']);
test(updateLastMacro, undefined, ['a', 'b', 'c'], ['a', 'b', undefined]);

test(updateLastMacro, 10, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 10});
test(updateLastMacro, $none, {a: 1, b: 2, c: 3}, {a: 1, b: 2});
test(updateLastMacro, undefined, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: undefined});

test(updateLastMacro, 'X', 'abc', 'abX');
test(updateLastMacro, '', 'abc', 'ab');
test(updateLastMacro, $none, 'abc', 'ab');
test(updateLastMacro, 5, 'abc', 'ab5');
test(updateLastMacro, undefined, 'abc', 'abundefined');

test(updateLastMacro, 'X', 0, new Error());
test(updateLastMacro, 'X', true, new Error());
test(updateLastMacro, 'X', undefined, new Error());
