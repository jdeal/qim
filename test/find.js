import test from 'ava';

import 'babel-core/register';

import {
  find,
  $each,
  $eachKey,
  $eachPair,
  $default
} from 'qim/src';

const isEven = value => value % 2 === 0;

test('find from primitive', t => {
  t.is(
    find([], 1),
    1
  );
  t.is(
    find([], null),
    null
  );
  t.is(
    find(['x'], 1),
    undefined
  );
  t.is(
    find(['x'], null),
    undefined
  );
});

test('find from object', t => {
  t.deepEqual(
    find([], {x: 1}),
    {x: 1}
  );
  t.deepEqual(
    find(['x'], {x: 1}),
    1
  );
});

test('find predicate', t => {
  t.deepEqual(
    find([isEven], 1),
    undefined
  );
  t.deepEqual(
    find([isEven], 2),
    2
  );
});

test('find values', t => {
  t.deepEqual(
    find([$each], [1, 2, 3]),
    1
  );
  t.deepEqual(
    find([$each, isEven], [1, 2, 3, 4]),
    2
  );
  t.deepEqual(
    find([$each, 'x'], [{x: 1}, {x: 2}]),
    1
  );
});

test('find keys', t => {
  t.deepEqual(
    find([$eachKey], {x: 1, y: 2}),
    'x'
  );
});

test('find pairs', t => {
  t.deepEqual(
    find([$eachPair], {x: 1, y: 2}),
    ['x', 1]
  );

  t.deepEqual(
    find([$eachPair, 1], {x: 1, y: 2}),
    1
  );
});

test('fill in path with $default', t => {
  t.deepEqual(
    find(['x', $default({}), 'y', $default(0)], {}),
    0
  );
});
