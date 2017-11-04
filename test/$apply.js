import test from 'ava';
import util from 'util';

import 'babel-core/register';

import {
  select,
  update,
  $apply,
  $each
} from 'qim/src';

const toUpperCase = s => s.toUpperCase();

const selectApplyMacro = (t, path, input, expected) => {
  const result = select([...path, $apply(toUpperCase)], input);
  t.deepEqual(result, expected);
};

selectApplyMacro.title = (title, path) => `select $apply(${util.inspect(path)})`;

test(selectApplyMacro, [], 'a', ['A']);
test(selectApplyMacro, [0], ['a'], ['A']);
test(selectApplyMacro, ['x'], {x: 'a'}, ['A']);
test(selectApplyMacro, [0], 'abc', ['A']);
test(selectApplyMacro, [$each], ['a', 'b', 'c'], ['A', 'B', 'C']);
test(selectApplyMacro, [$each], {x: 'a', y: 'b'}, ['A', 'B']);
test(selectApplyMacro, [$each], 'abc', ['A', 'B', 'C']);

const updateApplyMacro = (t, path, input, expected) => {
  const result = update([...path, $apply(toUpperCase)], input);
  t.deepEqual(result, expected);
};

updateApplyMacro.title = (title, path) => `update $apply(${util.inspect(path)})`;

test(updateApplyMacro, [], 'a', 'A');
test(updateApplyMacro, [0], ['a'], ['A']);
test(updateApplyMacro, ['x'], {x: 'a'}, {x: 'A'});
test(updateApplyMacro, [0], 'abc', 'Abc');
test(updateApplyMacro, [$each], ['a', 'b', 'c'], ['A', 'B', 'C']);
test(updateApplyMacro, [$each], {x: 'a', y: 'b'}, {x: 'A', y: 'B'});
test(updateApplyMacro, [$each], 'abc', 'ABC');
