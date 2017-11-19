import test from 'ava';

import 'babel-core/register';
import fp from 'lodash/fp';

import {
  update,
  $each,
  $eachKey,
  $eachPair,
  $set,
  $apply,
  $none,
  $slice,
  $nav,
  $end
} from 'qim/src';

const increment = value => value + 1;
const isEven = value => value % 2 === 0;
const toUpperCase = s => s.toUpperCase();

test('update identity', t => {
  t.deepEqual(
    update([], {x: 1}),
    {x: 1}
  );
});

test('update $set', t => {
  t.deepEqual(
    update(['x', $set(2)], {x: 1}),
    {x: 2}
  );
});

test('update non-existent in object with undefined', t => {
  t.deepEqual(
    update(['x', $set(undefined)], {}),
    {}
  );
});

test('update non-existent in array with undefined', t => {
  t.deepEqual(
    update([1, $set(undefined)], ['a']),
    ['a']
  );
});

test('update array with holes', t => {
  const array = [];
  const other = [];
  array[2] = 'z';
  other[0] = 'a';
  other[2] = 'z';
  const newArray = update([0, $set('a')], array);
  t.is(newArray[0], 'a');
  t.is(newArray[1], undefined);
  t.is(newArray[2], 'z');
  t.false(1 in newArray);
});

test('update array with holes', t => {
  const array = ['a'];
  array[2] = 'z';
  const other = array.slice(0);
  other[0] = 'A';

  const newArray = update([$each, letter => letter === 'a', $set('A')], array);
  t.is(newArray[0], 'A');
  t.is(newArray[1], undefined);
  t.is(newArray[2], 'z');
  t.false(1 in newArray);
});

test('update $apply', t => {
  t.deepEqual(
    update(['x', $apply(increment)], {x: 1}),
    {x: 2}
  );
});

test('update $apply primitive', t => {
  t.deepEqual(
    update([$apply(increment)], 0),
    1
  );
});

test('update predicate', t => {
  t.deepEqual(
    update([isEven, $apply(increment)], 1),
    1
  );
  t.deepEqual(
    update([isEven, $apply(increment)], 2),
    3
  );
});

test('update values', t => {
  t.deepEqual(
    update([$each, $apply(increment)], [1, 2, 3]),
    [2, 3, 4]
  );
  t.deepEqual(
    update([$each, isEven, $apply(increment)], [1, 2, 3]),
    [1, 3, 3]
  );
  t.deepEqual(
    update([$each, 'x', $apply(increment)], [{x: 1, y: 2}, {x: 2, y: 3}]),
    [{x: 2, y: 2}, {x: 3, y: 3}]
  );
  t.deepEqual(
    update([$each, 'x', isEven, $apply(increment)], [{x: 1}, {x: 2}]),
    [{x: 1}, {x: 3}]
  );
});

test('update keys', t => {
  t.deepEqual(
    update([$eachKey, $apply(fp.upperCase)], {x: 1, y: 2}),
    {X: 1, Y: 2}
  );
});

test('update pairs', t => {
  t.deepEqual(
    update([
      $eachPair,
      $apply(([key, value]) => [key.toUpperCase(), value + 1])
    ],
      {x: 1, y: 2}
    ),
    {X: 2, Y: 3}
  );

  t.deepEqual(
    update([$eachPair,
      [0, $apply(fp.upperCase)],
      [1, $apply(increment)]
    ], {x: 1, y: 2}),
    {X: 2, Y: 3}
  );

  t.deepEqual(
    update([$eachPair,
      [0, fp.eq('x'), $apply(fp.upperCase)],
      [1, isEven, $apply(increment)]
    ], {x: 1, y: 2}),
    {X: 1, y: 3}
  );
});

test('update multi', t => {
  t.deepEqual(
    update([$each,
      $apply(increment),
      $apply(increment)
    ], [1, 2, 3]),
    [3, 4, 5]
  );

  t.deepEqual(
    update([$each,
      ['x', $apply(increment)],
      ['y', $apply(increment)]
    ], [{x: 1, y: 2}, {x: 2, y: 3}]),
    [{x: 2, y: 3}, {x: 3, y: 4}]
  );
});

test('update array', t => {
  t.deepEqual(
    update([1, $apply(fp.upperCase)], ['foo', 'bar']),
    ['foo', 'BAR']
  );
});

test('remove key', t => {
  t.deepEqual(
    update(['x', $none], {x: 1, y: 2}),
    {y: 2}
  );
});

test('remove non-existent key', t => {
  t.deepEqual(
    update(['x', $none], {y: 2}),
    {y: 2}
  );
});

test('remove item', t => {
  t.deepEqual(
    update([0, $none], ['a', 'b']),
    ['b']
  );
});

test('remove all keys', t => {
  t.deepEqual(
    update([$each, $none], {x: 1, y: 2}),
    {}
  );
});

test('remove all items', t => {
  t.deepEqual(
    update([$each, $none], ['a', 'b']),
    []
  );
});

test('remove all keys with $none', t => {
  t.deepEqual(
    update([$eachKey, $none], {x: 1, y: 2}),
    {}
  );
});

test('remove even keys with $none', t => {
  t.deepEqual(
    update([$eachKey, isEven, $none], ['a', 'b', 'c', 'd']),
    ['b', 'd']
  );
});

test('remove all pairs from array with $none', t => {
  t.deepEqual(
    update([$eachPair, $none], ['a', 'b']),
    []
  );
});

test('remove all pairs from object with $none', t => {
  t.deepEqual(
    update([$eachPair, $none], {x: 1, y: 2}),
    {}
  );
});

test('replace slice', t => {
  t.deepEqual(
    update([$slice(0, 2), $set(['x', 'y'])], ['a', 'b', 'c', 'd']),
    ['x', 'y', 'c', 'd']
  );
});

test('replace slice with dynamic', t => {
  t.deepEqual(
    update([$slice(0, 2), $each, $apply(toUpperCase)], ['a', 'b', 'c', 'd']),
    ['A', 'B', 'c', 'd']
  );
});

test('dynamic nav', t => {
  t.deepEqual(
    update(
      [
        $nav(
          obj => [
            'messages',
            fp.range(0, obj.n).map(() => [$end, $set(['foo'])])
          ]
        )
      ],
      {
        n: 3,
        messages: []
      }
    ),
    {
      n: 3,
      messages: ['foo', 'foo', 'foo']
    }
  );
});

test('multi $nav', t => {
  t.deepEqual(
    update(
      [
        $nav(['x'], ['y']),
        $apply(val => val * 10)
      ],
      {x: 1, y: 2}
    ),
    {x: 10, y: 20}
  );
});

test('stop with undefined', t => {
  t.deepEqual(
    update(undefined, {x: 1}),
    {x: 1}
  );

  t.deepEqual(
    update(['x', undefined, 'y', $apply(value => value + 1)], {x: {y: 1}}),
    {x: {y: 1}}
  );

  t.deepEqual(
    update([
      ['a', undefined, 'x', $apply(s => s.toUpperCase())],
      ['b', 'x', $apply(s => s.toUpperCase())]
    ], {a: {x: 'ax'}, b: {x: 'bx'}}),
    {a: {x: 'ax'}, b: {x: 'BX'}}
  );
});
