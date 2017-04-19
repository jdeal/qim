import test from 'ava';

import 'babel-core/register';

import {
  selectFirst,
  $eachValue,
  $eachKey,
  $eachPair
} from 'qim/src';

const isEven = value => value % 2 === 0;

test('selectFirst from primitive', t => {
  t.is(
    selectFirst([], 1),
    1
  );
  t.is(
    selectFirst([], null),
    null
  );
  t.is(
    selectFirst(['x'], 1),
    undefined
  );
  t.is(
    selectFirst(['x'], null),
    undefined
  );
});

test('selectFirst from object', t => {
  t.deepEqual(
    selectFirst([], {x: 1}),
    {x: 1}
  );
  t.deepEqual(
    selectFirst(['x'], {x: 1}),
    1
  );
});

test('selectFirst predicate', t => {
  t.deepEqual(
    selectFirst([isEven], 1),
    undefined
  );
  t.deepEqual(
    selectFirst([isEven], 2),
    2
  );
});

test('selectFirst values', t => {
  t.deepEqual(
    selectFirst([$eachValue], [1, 2, 3]),
    1
  );
  t.deepEqual(
    selectFirst([$eachValue, isEven], [1, 2, 3, 4]),
    2
  );
  t.deepEqual(
    selectFirst([$eachValue, 'x'], [{x: 1}, {x: 2}]),
    1
  );
});

test('selectFirst keys', t => {
  t.deepEqual(
    selectFirst([$eachKey], {x: 1, y: 2}),
    'x'
  );
});

test('selectFirst pairs', t => {
  t.deepEqual(
    selectFirst([$eachPair], {x: 1, y: 2}),
    ['x', 1]
  );

  t.deepEqual(
    selectFirst([$eachPair, 1], {x: 1, y: 2}),
    1
  );
});
