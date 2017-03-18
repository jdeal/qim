import test from 'ava';

import 'babel-core/register';
import fp from 'lodash/fp';

import {
  update,
  updateIn,
  $eachValue,
  $eachKey,
  $eachPair
} from 'qim/src';

const increment = value => value + 1;
const isEven = value => value % 2 === 0;

test('updateIn identity', t => {
  t.deepEqual(
    updateIn([], obj => obj, {x: 1}),
    {x: 1}
  );
});

test('updateIn set', t => {
  t.deepEqual(
    updateIn(['x'], () => 2, {x: 1}),
    {x: 2}
  );
});

test('updateIn update', t => {
  t.deepEqual(
    updateIn(['x'], increment, {x: 1}),
    {x: 2}
  );
});

test('updateIn update primitive', t => {
  t.deepEqual(
    updateIn([], increment, 0),
    1
  );
});

test('updateIn predicate', t => {
  t.deepEqual(
    updateIn([isEven], increment, 1),
    1
  );
  t.deepEqual(
    updateIn([isEven], increment, 2),
    3
  );
});

test('updateIn values', t => {
  t.deepEqual(
    updateIn([$eachValue], increment, [1, 2, 3]),
    [2, 3, 4]
  );
  t.deepEqual(
    updateIn([$eachValue, isEven], increment, [1, 2, 3]),
    [1, 3, 3]
  );
  t.deepEqual(
    updateIn([$eachValue, 'x'], increment, [{x: 1, y: 2}, {x: 2, y: 3}]),
    [{x: 2, y: 2}, {x: 3, y: 3}]
  );
  t.deepEqual(
    updateIn([$eachValue, 'x', isEven], increment, [{x: 1}, {x: 2}]),
    [{x: 1}, {x: 3}]
  );
});

test('updateIn keys', t => {
  t.deepEqual(
    updateIn([$eachKey], fp.upperCase, {x: 1, y: 2}),
    {X: 1, Y: 2}
  );
});

test('updateIn pairs', t => {
  t.deepEqual(
    updateIn(
      [$eachPair],
      ([key, value]) => [key.toUpperCase(), value + 1],
      {x: 1, y: 2}
    ),
    {X: 2, Y: 3}
  );

  t.deepEqual(
    updateIn($eachPair, [
      update(0, fp.upperCase),
      update(1, increment)
    ], {x: 1, y: 2}),
    {X: 2, Y: 3}
  );

  t.deepEqual(
    updateIn($eachPair, [
      updateIn([0, fp.eq('x')], fp.upperCase),
      updateIn([1, isEven], increment)
    ], {x: 1, y: 2}),
    {X: 1, y: 3}
  );
});

test('updateIn multi', t => {
  t.deepEqual(
    updateIn([$eachValue], [
      increment,
      increment
    ], [1, 2, 3]),
    [3, 4, 5]
  );

  t.deepEqual(
    updateIn([$eachValue], [
      update('x', increment),
      update('y', increment)
    ], [{x: 1, y: 2}, {x: 2, y: 3}]),
    [{x: 2, y: 3}, {x: 3, y: 4}]
  );
});

test('updateIn array', t => {
  t.deepEqual(
    updateIn([1], fp.upperCase, ['foo', 'bar']),
    ['foo', 'BAR']
  );
});
