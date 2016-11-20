import test from 'ava';

import 'babel-core/register';

import exists from 'im-js/src/exists';

test('undefined does not exist', t => {
  t.false(exists(undefined));
});

test('null does not exist', t => {
  t.false(exists(null));
});

test('false does exist', t => {
  t.true(exists(false));
});

test('undefined key does not exist', t => {
  const obj = {x: 1};
  t.false(exists(obj, ['y']));
});

test('key exists on object', t => {
  const obj = {x: 1};
  t.true(exists(obj, ['x']));
});

test('deep key exists on object', t => {
  const obj = {x: {y: 1}};
  t.true(exists(obj, ['x', 'y']));
});

test('string key exists on object', t => {
  const obj = {x: 1};
  t.true(exists(obj, 'x'));
});

test('deep string key exists on object', t => {
  const obj = {x: {y: 1}};
  t.true(exists(obj, 'x.y'));
});
