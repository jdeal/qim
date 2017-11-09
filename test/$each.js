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

const selectEach = (path, input) => select([...path, $each], input);

test('select empty array', t => t.deepEqual(selectEach([], []), []));
test(
  'select array',
  t => t.deepEqual(selectEach([], ['a', 'b', 'c']), ['a', 'b', 'c'])
);
test(
  'select slice of array',
  t => t.deepEqual(selectEach([$slice(0, 2)], ['a', 'b', 'c']), ['a', 'b'])
);

test('select empty object', t => t.deepEqual(selectEach([], {}), []));
test(
  'select object',
  t => t.deepEqual(selectEach([], {x: 'a', y: 'b', z: 'c'}), ['a', 'b', 'c'])
);
test(
  'select slice of object',
  t => t.deepEqual(selectEach([$slice(0, 2)], {x: 'a', y: 'b', z: 'c'}), ['a', 'b'])
);

test('select empty string', t => t.deepEqual(selectEach([], ''), []));
test(
  'select string',
  t => t.deepEqual(selectEach([], 'abc'), ['a', 'b', 'c'])
);
test(
  'select slice of string',
  t => t.deepEqual(selectEach([$slice(0, 2)], 'abc'), ['a', 'b'])
);

test('select number', t => t.throws(() => selectEach([], 5)));
test(
  'select undefined',
  t => t.throws(() => selectEach([], undefined))
);

const updateEach = (path, input) => update([...path, $each, $apply(toUpperCase)], input);

test('update empty array', t => t.deepEqual(updateEach([], []), []));
test(
  'update array',
  t => t.deepEqual(updateEach([], ['a', 'b', 'c']), ['A', 'B', 'C'])
);
test(
  'update slice of array',
  t => t.deepEqual(updateEach([$slice(0, 2)], ['a', 'b', 'c']), ['A', 'B', 'c'])
);

test('update empty object', t => t.deepEqual(updateEach([], {}), {}));
test(
  'update object',
  t => t.deepEqual(updateEach([], {x: 'a', y: 'b', z: 'c'}), {x: 'A', y: 'B', z: 'C'})
);
test('update slice of object', t => t.deepEqual(
  updateEach([$slice(0, 2)], {x: 'a', y: 'b', z: 'c'}),
  {x: 'A', y: 'B', z: 'c'}
));

test('update empty string', t => t.deepEqual(updateEach([], ''), ''));
test('update string', t => t.deepEqual(updateEach([], 'abc'), 'ABC'));
test(
  'update slice of string',
  t => t.deepEqual(updateEach([$slice(0, 2)], 'abc'), 'ABc')
);

test('update number', t => t.throws(() => updateEach([], 5)));
test(
  'update undefined',
  t => t.throws(() => updateEach([], undefined))
);
