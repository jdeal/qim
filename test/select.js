import test from 'ava';

import 'babel-core/register';

import {
  select,
  $each,
  $eachKey,
  $eachPair,
  $nav,
  $apply
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
    select([$each], [1, 2, 3]),
    [1, 2, 3]
  );
  t.deepEqual(
    select([$each], {'': 0, 'x': 1, 'y': 2}),
    [0, 1, 2]
  );
  t.deepEqual(
    select([$each, isEven], [1, 2, 3, 4]),
    [2, 4]
  );
  t.deepEqual(
    select([$each, 'x'], [{x: 1}, {x: 2}]),
    [1, 2]
  );
});

test('select keys', t => {
  t.deepEqual(
    select([$eachKey], {'': 0, x: 1, y: 2}),
    ['', 'x', 'y']
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

test('multi $nav', t => {
  t.deepEqual(
    select(
      [
        $nav(['x'], ['y']),
        $apply(val => val * 10)
      ],
      {x: 1, y: 2}
    ),
    [10, 20]
  );
});

test('stop with undefined', t => {
  t.deepEqual(
    select(undefined, {x: 1}),
    []
  );

  t.deepEqual(
    select(['x', undefined, 'y'], {x: {y: 1}}),
    []
  );

  t.deepEqual(
    select([
      ['a', undefined, 'x'],
      ['b', 'x']
    ], {a: {x: 'ax'}, b: {x: 'bx'}}),
    ['bx']
  );
});
