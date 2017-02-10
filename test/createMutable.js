import test from 'ava';

import 'babel-core/register';

import createMutable from 'im-js/src/createMutable';

test('set property', t => {
  const obj = createMutable({x: 1});
  const newObj = obj.set('x', 2);
  t.deepEqual(newObj.value(), {x: 2});
});

test('setIn path', t => {
  const obj = createMutable({x: {y: 1}});
  const newObj = obj.setIn(['x', 'y'], 2);
  t.deepEqual(newObj.value(), {x: {y: 2}});
});

test('setIn should create path', t => {
  const obj = createMutable({});
  const newObj = obj.setIn(['x', 'y'], 1);
  t.deepEqual(newObj.value(), {x: {y: 1}});
});

test('setIn should create array path', t => {
  const obj = createMutable({});
  const newObj = obj.setIn(['x', 0], 1);
  t.deepEqual(newObj.value(), {x: [1]});
});
