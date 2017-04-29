import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  $first,
  $last,
  $merge,
  $set
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
