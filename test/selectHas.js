import test from 'ava';

import 'babel-core/register';

import {
  selectHas,
  $eachValue,
  $eachKey,
  $eachPair
} from 'qim/src';

const isEven = value => value % 2 === 0;

test('selectHas from primitive', t => {
  t.true(selectHas([], 1));
  t.true(selectHas([], null));
  t.false(selectHas(['x'], 1));
  t.false(selectHas(['x'], null));
});

test('selectHas from object', t => {
  t.true(selectHas([], {x: 1}));
  t.true(selectHas(['x'], {x: 1}));
  t.false(selectHas(['y'], {x: 1}));
});

test('selectHas predicate', t => {
  t.false(selectHas([isEven], 1));
  t.true(selectHas([isEven], 2));
});

test('selectHas values', t => {
  t.true(selectHas([$eachValue], [1, 2, 3]));
  t.true(selectHas([$eachValue, isEven], [1, 2, 3, 4]));
  t.false(selectHas([$eachValue, isEven], [1, 3]));
  t.true(selectHas([$eachValue, 'x'], [{x: 1}, {x: 2}]));
  t.false(selectHas([$eachValue, 'y'], [{x: 1}, {x: 2}]));
});

test('selectHas keys', t => {
  t.true(selectHas([$eachKey], {x: 1, y: 2}));
  t.false(selectHas([$eachKey], {}));
});

test('selectHas pairs', t => {
  t.true(selectHas([$eachPair], {x: 1, y: 2}));
  t.false(selectHas([$eachPair], {}));
});
