import test from 'ava';

import 'babel-core/register';

import get from 'im-js/src/get';

test('get undefined returns undefined', t => {
  t.is(get(undefined), undefined);
});

test('get null returns null', t => {
  t.is(get(null), null);
});

test('get false returns false', t => {
  t.is(get(false), false);
});

test('get undefined key returns undefined', t => {
  const obj = {x: 1};
  t.is(get(obj, ['y']), undefined);
});

test('get value at key', t => {
  const obj = {x: 1};
  t.is(get(obj, ['x']), 1);
});

test('get value at deep key', t => {
  const obj = {x: {y: 1}};
  t.is(get(obj, ['x', 'y']), 1);
});

test('get key with dotted path', t => {
  const obj = {x: {y: 1}};
  t.is(get(obj, 'x.y'), 1);
});
