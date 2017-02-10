import test from 'ava';

import 'babel-core/register';

import setIn from 'im-js/src/methods/setIn';

test('setIn path', t => {
  const obj = {x: {y: 1}};
  const newObj = setIn(obj, ['x', 'y'], 2);
  t.deepEqual(newObj, {x: {y: 2}});
  t.not(obj, newObj);
  t.not(obj.x, newObj.x);
});

test('setIn should create path', t => {
  const obj = {};
  const newObj = setIn(obj, ['x', 'y'], 1);
  t.deepEqual(newObj, {x: {y: 1}});
  t.not(obj, newObj);
});

test('setIn should create array path', t => {
  const obj = {};
  const newObj = setIn(obj, ['x', 0], 1);
  t.deepEqual(newObj, {x: [1]});
});
