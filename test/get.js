import test from 'ava';

import 'babel-core/register';

import {
  get,
  $eachValue,
  $eachKey,
  $eachPair
} from 'qim/src';

const isEven = value => value % 2 === 0;

test('get from primitive', t => {
  t.is(
    get([], 1),
    1
  );
  t.is(
    get([], null),
    null
  );
  t.is(
    get(['x'], 1),
    undefined
  );
  t.is(
    get(['x'], null),
    undefined
  );
});

test('get from object', t => {
  t.deepEqual(
    get([], {x: 1}),
    {x: 1}
  );
  t.deepEqual(
    get(['x'], {x: 1}),
    1
  );
});

test('get predicate', t => {
  t.deepEqual(
    get([isEven], 1),
    undefined
  );
  t.deepEqual(
    get([isEven], 2),
    2
  );
});

test('get values', t => {
  t.deepEqual(
    get([$eachValue], [1, 2, 3]),
    1
  );
  t.deepEqual(
    get([$eachValue, isEven], [1, 2, 3, 4]),
    2
  );
  t.deepEqual(
    get([$eachValue, 'x'], [{x: 1}, {x: 2}]),
    1
  );
});

test('get keys', t => {
  t.deepEqual(
    get([$eachKey], {x: 1, y: 2}),
    'x'
  );
});

test('get pairs', t => {
  t.deepEqual(
    get([$eachPair], {x: 1, y: 2}),
    ['x', 1]
  );

  t.deepEqual(
    get([$eachPair, 1], {x: 1, y: 2}),
    1
  );
});
