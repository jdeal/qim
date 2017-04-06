import test from 'ava';

import 'babel-core/register';

import {
  select,
  $eachValue,
  $eachKey,
  $eachPair
} from 'qim/src';

const isEven = value => value % 2 === 0;

test('select from primitive', t => {
  t.deepEqual(
    select([], 1),
    [1]
  );
  t.deepEqual(
    select([], null),
    [null]
  );
  t.deepEqual(
    select(['x'], 1),
    []
  );
  t.deepEqual(
    select(['x'], null),
    []
  );
});

test('select from object', t => {
  t.deepEqual(
    select([], {x: 1}),
    [{x: 1}]
  );
  t.deepEqual(
    select(['x'], {x: 1}),
    [1]
  );
});

test('select predicate', t => {
  t.deepEqual(
    select([isEven], 1),
    []
  );
  t.deepEqual(
    select([isEven], 2),
    [2]
  );
});

test('select values', t => {
  t.deepEqual(
    select([$eachValue], [1, 2, 3]),
    [1, 2, 3]
  );
  t.deepEqual(
    select([$eachValue, isEven], [1, 2, 3, 4]),
    [2, 4]
  );
  t.deepEqual(
    select([$eachValue, 'x'], [{x: 1}, {x: 2}]),
    [1, 2]
  );
});

test('select keys', t => {
  t.deepEqual(
    select([$eachKey], {x: 1, y: 2}),
    ['x', 'y']
  );
});

test('select pairs', t => {
  t.deepEqual(
    select([$eachPair], {x: 1, y: 2}),
    [['x', 1], ['y', 2]]
  );

  t.deepEqual(
    select([$eachPair, 1], {x: 1, y: 2}),
    [1, 2]
  );
});
