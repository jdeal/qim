import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  $apply,
  $eachKey,
  $none,
  $slice,
} from 'qim/src';

const selectEachKeyMacro = (t, path, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => select([...path, $eachKey], input));
    return;
  }
  const result = select([...path, $eachKey], input);
  t.deepEqual(result, expected);
};

selectEachKeyMacro.title = (title) => `select $eachKey of ${title}`;

test('empty array', selectEachKeyMacro, [], [], []);
test('array', selectEachKeyMacro, [], ['a', 'b', 'c'], [0, 1, 2]);
test('slice of array', selectEachKeyMacro, [$slice(0, 2)], ['a', 'b', 'c'], [0, 1]);

test('empty object', selectEachKeyMacro, [], {}, []);
test('object', selectEachKeyMacro, [], {x: 'a', y: 'b', z: 'c'}, ['x', 'y', 'z']);
test('slice of object', selectEachKeyMacro, [$slice(0, 2)], {x: 'a', y: 'b', z: 'c'}, ['x', 'y']);

test('empty string', selectEachKeyMacro, [], '', []);
test('string', selectEachKeyMacro, [], 'abc', [0, 1, 2]);
test('slice of string', selectEachKeyMacro, [$slice(0, 2)], 'abc', [0, 1]);

test('number', selectEachKeyMacro, [], 5, new Error());
test('undefined', selectEachKeyMacro, [], undefined, new Error());


const updateEachKeyMacro = (t, path, fn, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => update([...path, $eachKey, $apply(fn)], input));
    return;
  }
  const result = update([...path, $eachKey, $apply(fn)], input);
  t.deepEqual(result, expected);
};

updateEachKeyMacro.title = (title) => `update $eachKey of ${title}`;

const toUpper = s => s.toUpperCase();

test('array with 2 - key', updateEachKeyMacro, [], key => 2 - key, ['a', 'b', 'c'], ['c', 'b', 'a']);
test('array with 3 - key', updateEachKeyMacro, [], key => 3 - key, ['a', 'b', 'c'], ['c', 'b', 'a']);
test('array with none key', updateEachKeyMacro, [], key => key === 1 ? $none : key, ['a', 'b', 'c'], ['a', 'c']);
test('array with key + 1', updateEachKeyMacro, [], key => key + 1, ['a', 'b', 'c'], ['a', 'b', 'c']);
test('array with same key', updateEachKeyMacro, [], () => 0, ['a', 'b', 'c'], ['c']);
test('array with x key', updateEachKeyMacro, [], () => 'x', ['a', 'b', 'c'], []);

test('empty object', updateEachKeyMacro, [], toUpper, {}, {});
test('object', updateEachKeyMacro, [], toUpper, {x: 'a', y: 'b', z: 'c'}, {X: 'a', Y: 'b', Z: 'c'});
test('object with none keys', updateEachKeyMacro, [], key => key === 'y' ? $none : key, {x: 'a', y: 'b', z: 'c'}, {x: 'a', z: 'c'});
test('object with same key', updateEachKeyMacro, [], () => 'x', {x: 'a', y: 'b', z: 'c'}, {x: 'c'});
test('slice of object', updateEachKeyMacro, [$slice(0, 2)], toUpper, {x: 'a', y: 'b', z: 'c'}, {X: 'a', Y: 'b', z: 'c'});

test('empty string', updateEachKeyMacro, [], toUpper, '', '');
//test('string with 2 - key', updateEachKeyMacro, [], key => 2 - key, 'abc', 'cba');
