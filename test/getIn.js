import test from 'ava';

import 'babel-core/register';

import {
  getIn,
  $eachValue,
  $eachKey,
  $eachPair
} from 'qim/src';

const isEven = value => value % 2 === 0;

test('getIn from primitive', t => {
  t.is(
    getIn([], 1),
    1
  );
  t.is(
    getIn([], null),
    null
  );
  t.is(
    getIn(['x'], 1),
    undefined
  );
  t.is(
    getIn(['x'], null),
    undefined
  );
});

test('getIn from object', t => {
  t.deepEqual(
    getIn([], {x: 1}),
    {x: 1}
  );
  t.deepEqual(
    getIn(['x'], {x: 1}),
    1
  );
});

test('getIn predicate', t => {
  t.deepEqual(
    getIn([isEven], 1),
    undefined
  );
  t.deepEqual(
    getIn([isEven], 2),
    2
  );
});

test('getIn values', t => {
  t.deepEqual(
    getIn([$eachValue], [1, 2, 3]),
    1
  );
  t.deepEqual(
    getIn([$eachValue, isEven], [1, 2, 3, 4]),
    2
  );
  t.deepEqual(
    getIn([$eachValue, 'x'], [{x: 1}, {x: 2}]),
    1
  );
});

test('getIn keys', t => {
  t.deepEqual(
    getIn([$eachKey], {x: 1, y: 2}),
    'x'
  );
});

test('getIn pairs', t => {
  t.deepEqual(
    getIn([$eachPair], {x: 1, y: 2}),
    ['x', 1]
  );

  t.deepEqual(
    getIn([$eachPair, 1], {x: 1, y: 2}),
    1
  );
});
