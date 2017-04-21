import test from 'ava';

import 'babel-core/register';

import {
  has,
  $eachValue,
  $eachKey,
  $eachPair
} from 'qim/src';

const isEven = value => value % 2 === 0;

test('has from primitive', t => {
  t.true(has([], 1));
  t.true(has([], null));
  t.false(has(['x'], 1));
  t.false(has(['x'], null));
});

test('has from object', t => {
  t.true(has([], {x: 1}));
  t.true(has(['x'], {x: 1}));
  t.false(has(['y'], {x: 1}));
});

test('has predicate', t => {
  t.false(has([isEven], 1));
  t.true(has([isEven], 2));
});

test('has values', t => {
  t.true(has([$eachValue], [1, 2, 3]));
  t.true(has([$eachValue, isEven], [1, 2, 3, 4]));
  t.false(has([$eachValue, isEven], [1, 3]));
  t.true(has([$eachValue, 'x'], [{x: 1}, {x: 2}]));
  t.false(has([$eachValue, 'y'], [{x: 1}, {x: 2}]));
});

test('has keys', t => {
  t.true(has([$eachKey], {x: 1, y: 2}));
  t.false(has([$eachKey], {}));
});

test('has pairs', t => {
  t.true(has([$eachPair], {x: 1, y: 2}));
  t.false(has([$eachPair], {}));
});
