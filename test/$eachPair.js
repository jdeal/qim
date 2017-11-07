import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  $apply,
  $eachPair,
  $none,
  $slice,
} from 'qim/src';

const selectEachPairMacro = (t, path, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => select([...path, $eachPair], input));
    return;
  }
  const result = select([...path, $eachPair], input);
  t.deepEqual(result, expected);
};

selectEachPairMacro.title = (title) => `select $eachPair of ${title}`;

test('empty array', selectEachPairMacro, [], [], []);
test('array', selectEachPairMacro, [], ['a', 'b', 'c'], [[0, 'a'], [1, 'b'], [2, 'c']]);
test('slice of array', selectEachPairMacro, [$slice(0, 2)], ['a', 'b', 'c'], [[0, 'a'], [1, 'b']]);

test('empty object', selectEachPairMacro, [], {}, []);
test('object', selectEachPairMacro, [], {x: 'a', y: 'b', z: 'c'}, [['x', 'a'], ['y', 'b'], ['z', 'c']]);
test('slice of object', selectEachPairMacro, [$slice(0, 2)], {x: 'a', y: 'b', z: 'c'}, [['x', 'a'], ['y', 'b']]);

test('empty string', selectEachPairMacro, [], '', []);
test('string', selectEachPairMacro, [], 'abc', [[0, 'a'], [1, 'b'], [2, 'c']]);
test('slice of string', selectEachPairMacro, [$slice(0, 2)], 'abc', [[0, 'a'], [1, 'b']]);

test('number', selectEachPairMacro, [], 5, new Error());
test('undefined', selectEachPairMacro, [], undefined, new Error());


const updateEachPairMacro = (t, path, fn, input, expected) => {
  if (expected instanceof Error) {
    t.throws(() => update([...path, $eachPair, $apply(fn)], input));
    return;
  }
  const result = update([...path, $eachPair, $apply(fn)], input);
  t.deepEqual(result, expected);
};

updateEachPairMacro.title = (title) => `update $eachKey of ${title}`;

const toUpper = ([k, v]) => [k.toUpperCase(), v.toUpperCase()];
const createUpperFn = (keyFn) => ([k, v]) => [keyFn(k), v ? v.toUpperCase() : v];

test('array with 2 - key', updateEachPairMacro, [], createUpperFn(key => 2 - key), ['a', 'b', 'c'], ['C', 'B', 'A']);
test('array with 3 - key', updateEachPairMacro, [], createUpperFn(key => 3 - key), ['a', 'b', 'c'], ['C', 'B', 'A']);
test('array with none key', updateEachPairMacro, [], createUpperFn(key => key === 1 ? $none : key), ['a', 'b', 'c'], ['A', 'C']);
test('array with undefined key', updateEachPairMacro, [], createUpperFn(key => key === 1 ? undefined : key), ['a', 'b', 'c'], ['A', 'C']);
test('array with key + 1', updateEachPairMacro, [], createUpperFn(key => key + 1), ['a', 'b', 'c'], ['A', 'B', 'C']);
test('array with same key', updateEachPairMacro, [], createUpperFn(() => 0), ['a', 'b', 'c'], ['C']);
test('array with x key', updateEachPairMacro, [], createUpperFn(() => 'x'), ['a', 'b', 'c'], []);

const arrayWithHoles = ['a'];
arrayWithHoles[2] = 'c';
test('array with holes with key + 1', updateEachPairMacro, [], createUpperFn(key => key + 1), arrayWithHoles, ['A', undefined, 'C']);

test('empty object', updateEachPairMacro, [], toUpper, {}, {});
test('object', updateEachPairMacro, [], toUpper, {x: 'a', y: 'b', z: 'c'}, {X: 'A', Y: 'B', Z: 'C'});
test('object with none pair', updateEachPairMacro, [], (pair) => pair[0] === 'y' ? $none : pair, {x: 'a', y: 'b', z: 'c'}, {x: 'a', z: 'c'});
test('object with undefined pair', updateEachPairMacro, [], (pair) => pair[0] === 'y' ? undefined : pair, {x: 'a', y: 'b', z: 'c'}, {x: 'a', z: 'c'});
test('object with same key', updateEachPairMacro, [], createUpperFn(() => 'x'), {x: 'a', y: 'b', z: 'c'}, {x: 'C'});
test('slice of object', updateEachPairMacro, [$slice(0, 2)], toUpper, {x: 'a', y: 'b', z: 'c'}, {X: 'A', Y: 'B', z: 'c'});

test('empty string', updateEachPairMacro, [], toUpper, '', '');
test('string with 2 - key', updateEachPairMacro, [], createUpperFn(key => 2 - key), 'abc', 'CBA');
test('string with 3 - key', updateEachPairMacro, [], createUpperFn(key => 3 - key), 'abc', 'CBA');
test('string with none key', updateEachPairMacro, [], createUpperFn(key => key === 1 ? $none : key), 'abc', 'AC');
test('string with key + 1', updateEachPairMacro, [], createUpperFn(key => key + 1), 'abc', 'ABC');
test('string with same key', updateEachPairMacro, [], createUpperFn(() => 0), 'abc', 'C');
test('string with x key', updateEachPairMacro, [], createUpperFn(() => 'x'), 'abc', '');
