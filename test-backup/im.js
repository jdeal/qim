import test from 'ava';

import 'babel-core/register';

import im from 'im-js/src/im';

test('no-op withMutations', t => {
  const obj = {};
  const newObj = im(obj)
    .withMutations(() => {})
    .value();
  t.is(obj, newObj);
});

test('set prop withMutations', t => {
  const obj = {x: 1};
  const newObj = im(obj)
    .withMutations(m => m.set('x', 2))
    .value();
  t.deepEqual(newObj, {x: 2});
});

test('set prop withMutations with no change', t => {
  const obj = {x: 1};
  const newObj = im(obj)
    .withMutations(m => m.set('x', 1))
    .value();
  t.is(obj, newObj);
});

test('set prop', t => {
  const obj = {x: 1};
  const wrapper = im(obj);
  const newObj = wrapper.set('x', 2).value();
  t.deepEqual(newObj, {x: 2});
  t.is(wrapper.value(), obj);
});

test('set prop with no change', t => {
  const obj = {x: 1};
  const newObj = im(obj).set('x', 1).value();
  t.is(obj, newObj);
});
