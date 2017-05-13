import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  find,
  $first,
  $last,
  $merge,
  $mergeDeep,
  $set,
  $nav,
  $each,
  $eachPair,
  $apply,
  $setContext,
  $pushContext
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

test('$mergeDeep', t => {
  t.deepEqual(
    update([$mergeDeep({a: {ab: 2}})], {a: {aa: 1}, b: 2}),
    {a: {aa: 1, ab: 2}, b: 2}
  );

  const state = {x: {y: 1}};

  t.is(
    update([$mergeDeep({x: {y: 1}})], state),
    state
  );


  state.x.z = 2;

  t.is(
    update([$mergeDeep({x: {y: 1}})], state),
    state
  );

  t.deepEqual(
    update([$mergeDeep({0: {0: 'x'}})], [[]]),
    [['x']]
  );

  t.deepEqual(
    update([$mergeDeep([['x']])], [[]]),
    [['x']]
  );

  t.deepEqual(
    update([$mergeDeep(['a', ['b']])], ['x', ['y', 'z']]),
    ['a', ['b', 'z']]
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

test('stop with undefined', t => {
  t.deepEqual(
    select(['x', undefined, 'y'], {x: {y: 1}}),
    []
  );

  t.deepEqual(
    update(['x', undefined, 'y', $apply(value => value + 1)], {x: {y: 1}}),
    {x: {y: 1}}
  );

  t.deepEqual(
    select([
      ['a', undefined, 'x'],
      ['b', 'x']
    ], {a: {x: 'ax'}, b: {x: 'bx'}}),
    ['bx']
  );

  t.deepEqual(
    update([
      ['a', undefined, 'x', $apply(s => s.toUpperCase())],
      ['b', 'x', $apply(s => s.toUpperCase())]
    ], {a: {x: 'ax'}, b: {x: 'bx'}}),
    {a: {x: 'ax'}, b: {x: 'BX'}}
  );
});

test('$setContext', t => {
  t.deepEqual(
    select(
      [$setContext('first', find($first)), $each, $apply((letter, ctx) => `${ctx.first}${letter}`)],
      ['a', 'b', 'c']
    ),
    ['aa', 'ab', 'ac']
  );

  t.deepEqual(
    update(
      ['stuff', $setContext('first', find($first)), $each, $apply((letter, ctx) => `${ctx.first}${letter}`)],
      {stuff: ['a', 'b', 'c']}
    ),
    {stuff: ['aa', 'ab', 'ac']}
  );

  t.deepEqual(
    select(
      [
        $eachPair, $setContext('level', find(0)), 1,
        $eachPair, $setContext('key', find(0)), 1,
        $apply((message, ctx) => ({level: ctx.level, key: ctx.key, message}))
      ],
      {error: {foo: 'a', bar: 'b'}, warning: {baz: 'c', qux: 'd'}}
    ),
    [
      {level: 'error', key: 'foo', message: 'a'},
      {level: 'error', key: 'bar', message: 'b'},
      {level: 'warning', key: 'baz', message: 'c'},
      {level: 'warning', key: 'qux', message: 'd'}
    ]
  );
});

test('$pushContext', t => {
  t.deepEqual(
    select(
      [$pushContext('first', find($first)), $each, $apply((letter, ctx) => `${ctx.first[0]}${letter}`)],
      ['a', 'b', 'c']
    ),
    ['aa', 'ab', 'ac']
  );

  const data = {a: {b: {c: 1, d: 2}}};

  const $walk = $nav((value, $self) => {
    if (value && typeof value === 'object') {
      return [$eachPair, $pushContext('path', find($first)), $last, $self];
    }
    return [];
  });

  t.deepEqual(
    select(
      [$walk, $apply((value, ctx) => [...ctx.path, value])],
      data
    ),
    [['a', 'b', 'c', 1], ['a', 'b', 'd', 2]]
  );
});
