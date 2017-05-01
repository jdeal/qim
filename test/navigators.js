import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  $first,
  $last,
  $merge,
  $set,
  $nav,
  $each,
  $stop,
  $apply
} from 'qim/src';

test('$first', t => {
  t.deepEqual(
    select([$first], [0, 1, 2]),
    [0]
  );
  t.deepEqual(
    select([$first], {x: 0, y: 1, z: 2}),
    [0]
  );
  t.deepEqual(
    update([$first, $set('first')], [0, 1, 2]),
    ['first', 1, 2]
  );
  t.deepEqual(
    update([$first, $set('first')], {x: 0, y: 1, z: 2}),
    {x: 'first', y: 1, z: 2}
  );
});

test('$last', t => {
  t.deepEqual(
    select([$last], [0, 1, 2]),
    [2]
  );
  t.deepEqual(
    select([$last], {x: 0, y: 1, z: 2}),
    [2]
  );
  t.deepEqual(
    update([$last, $set('last')], [0, 1, 2]),
    [0, 1, 'last']
  );
  t.deepEqual(
    update([$last, $set('last')], {x: 0, y: 1, z: 2}),
    {x: 0, y: 1, z: 'last'}
  );
});

test('$merge', t => {
  t.deepEqual(
    update([$merge({y: 2})], {x: 1}),
    {x: 1, y: 2}
  );

  const state = {x: 1};

  t.is(
    update([$merge({x: 1})], state),
    state
  );

  state.y = 2;

  t.is(
    update([$merge({x: 1})], state),
    state
  );

  t.deepEqual(
    update([$merge({0: 'x'})], []),
    ['x']
  );

  t.deepEqual(
    update([$merge(['x'])], []),
    ['x']
  );

  t.deepEqual(
    update([$merge(['a'])], ['x', 'y', 'z']),
    ['a', 'y', 'z']
  );
});

test('$nav', t => {
  t.deepEqual(
    update(
      [
        $each, $nav(
          obj => ['isEqual', $set(obj.x === obj.y)]
        )
      ],
      [{x: 1, y: 1}, {x: 1, y: 2}]
    ),
    [
      {x: 1, y: 1, isEqual: true},
      {x: 1, y: 2, isEqual: false}
    ]
  );
});

test('$nav recursive', t => {
  const $walk = $nav((item, $self) =>
    Array.isArray(item) ? [$each, $self] : []
  );

  t.deepEqual(
    select([$walk, val => val % 2 === 0], [0, 1, 2, [4, 5, 6, [7, 8, 9]]]),
    [0, 2, 4, 6, 8]
  );
});

test('$stop', t => {
  t.deepEqual(
    select(['x', $stop, 'y'], {x: {y: 1}}),
    []
  );

  t.deepEqual(
    update(['x', $stop, 'y', $apply(value => value + 1)], {x: {y: 1}}),
    {x: {y: 1}}
  );

  t.deepEqual(
    select([
      ['a', $stop, 'x'],
      ['b', 'x']
    ], {a: {x: 'ax'}, b: {x: 'bx'}}),
    ['bx']
  );

  t.deepEqual(
    update([
      ['a', $stop, 'x', $apply(s => s.toUpperCase())],
      ['b', 'x', $apply(s => s.toUpperCase())]
    ], {a: {x: 'ax'}, b: {x: 'bx'}}),
    {a: {x: 'ax'}, b: {x: 'BX'}}
  );
});
