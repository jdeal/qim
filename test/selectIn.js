import test from 'ava';

import 'babel-core/register';

import selectIn from 'qim/src/selectIn';
import $eachValue from 'qim/src/navigators/$eachValue';
import $eachKey from 'qim/src/navigators/$eachKey';
import $eachPair from 'qim/src/navigators/$eachPair';

const isEven = value => value % 2 === 0;

test('selectIn from primitive', t => {
  t.deepEqual(
    selectIn([], 1),
    [1]
  );
  t.deepEqual(
    selectIn([], null),
    [null]
  );
  t.deepEqual(
    selectIn(['x'], 1),
    []
  );
  t.deepEqual(
    selectIn(['x'], null),
    []
  );
});

test('selectIn from object', t => {
  t.deepEqual(
    selectIn([], {x: 1}),
    [{x: 1}]
  );
  t.deepEqual(
    selectIn(['x'], {x: 1}),
    [1]
  );
});

test('selectIn predicate', t => {
  t.deepEqual(
    selectIn([isEven], 1),
    []
  );
  t.deepEqual(
    selectIn([isEven], 2),
    [2]
  );
});

test('selectIn values', t => {
  t.deepEqual(
    selectIn([$eachValue], [1, 2, 3]),
    [1, 2, 3]
  );
  t.deepEqual(
    selectIn([$eachValue, isEven], [1, 2, 3, 4]),
    [2, 4]
  );
  t.deepEqual(
    selectIn([$eachValue, 'x'], [{x: 1}, {x: 2}]),
    [1, 2]
  );
});

test('selectIn keys', t => {
  t.deepEqual(
    selectIn([$eachKey], {x: 1, y: 2}),
    ['x', 'y']
  );
});

test('selectIn pairs', t => {
  t.deepEqual(
    selectIn([$eachPair], {x: 1, y: 2}),
    [['x', 1], ['y', 2]]
  );

  t.deepEqual(
    selectIn([$eachPair, 1], {x: 1, y: 2}),
    [1, 2]
  );
});
