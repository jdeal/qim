import test from 'ava';

import 'babel-core/register';

import {
  hasIn,
  $eachValue,
  $eachKey,
  $eachPair
} from 'qim/src';

const isEven = value => value % 2 === 0;

test('hasIn from primitive', t => {
  t.true(hasIn([], 1));
  t.true(hasIn([], null));
  t.false(hasIn(['x'], 1));
  t.false(hasIn(['x'], null));
});

test('hasIn from object', t => {
  t.true(hasIn([], {x: 1}));
  t.true(hasIn(['x'], {x: 1}));
  t.false(hasIn(['y'], {x: 1}));
});

test('hasIn predicate', t => {
  t.false(hasIn([isEven], 1));
  t.true(hasIn([isEven], 2));
});

test('hasIn values', t => {
  t.true(hasIn([$eachValue], [1, 2, 3]));
  t.true(hasIn([$eachValue, isEven], [1, 2, 3, 4]));
  t.false(hasIn([$eachValue, isEven], [1, 3]));
  t.true(hasIn([$eachValue, 'x'], [{x: 1}, {x: 2}]));
  t.false(hasIn([$eachValue, 'y'], [{x: 1}, {x: 2}]));
});

test('hasIn keys', t => {
  t.true(hasIn([$eachKey], {x: 1, y: 2}));
  t.false(hasIn([$eachKey], {}));
});

test('hasIn pairs', t => {
  t.true(hasIn([$eachPair], {x: 1, y: 2}));
  t.false(hasIn([$eachPair], {}));
});
