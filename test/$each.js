import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  $apply,
  $each,
  $slice,
} from 'qim/src';

const toUpperCase = s => s.toUpperCase();

const selectEachMacro = (t, path, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => select([...path, $each], input));
    return;
  }
  const result = select([...path, $each], input);
  t.deepEqual(result, expected);
};

selectEachMacro.title = (title) => `select $each of ${title}`;

test('empty array', selectEachMacro, [], [], []);
test('array', selectEachMacro, [], ['a', 'b', 'c'], ['a', 'b', 'c']);
test('slice of array', selectEachMacro, [$slice(0, 2)], ['a', 'b', 'c'], ['a', 'b']);

test('empty object', selectEachMacro, [], {}, []);
test('object', selectEachMacro, [], {x: 'a', y: 'b', z: 'c'}, ['a', 'b', 'c']);
test('slice of object', selectEachMacro, [$slice(0, 2)], {x: 'a', y: 'b', z: 'c'}, ['a', 'b']);

test('empty string', selectEachMacro, [], '', []);
test('string', selectEachMacro, [], 'abc', ['a', 'b', 'c']);
test('slice of string', selectEachMacro, [$slice(0, 2)], 'abc', ['a', 'b']);

test('number', selectEachMacro, [], 5, new Error());
test('undefined', selectEachMacro, [], undefined, new Error());

const updateEachMacro = (t, path, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => update([...path, $each, $apply(toUpperCase)], input));
    return;
  }
  const result = update([...path, $each, $apply(toUpperCase)], input);
  t.deepEqual(result, expected);
};

updateEachMacro.title = (title) => `update $each of ${title}`;

test('empty array', updateEachMacro, [], [], []);
test('array', updateEachMacro, [], ['a', 'b', 'c'], ['A', 'B', 'C']);
test('slice of array', updateEachMacro, [$slice(0, 2)], ['a', 'b', 'c'], ['A', 'B', 'c']);

test('empty object', updateEachMacro, [], {}, {});
test('object', updateEachMacro, [], {x: 'a', y: 'b', z: 'c'}, {x: 'A', y: 'B', z: 'C'});
test('slice of object', updateEachMacro, [$slice(0, 2)], {x: 'a', y: 'b', z: 'c'}, {x: 'A', y: 'B', z: 'c'});

test('empty string', updateEachMacro, [], '', '');
test('string', updateEachMacro, [], 'abc', 'ABC');
test('slice of string', updateEachMacro, [$slice(0, 2)], 'abc', 'ABc');

test('number', updateEachMacro, [], 5, new Error());
test('undefined', updateEachMacro, [], undefined, new Error());
