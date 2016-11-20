import test from 'ava';

import 'babel-core/register';

import createMutable from 'im-js/src/createMutable';

test('set does not mutate original', t => {
  const obj = {x: 1};
  const wrapped = createMutable(obj);
  wrapped.set('x', 2);
  const newObj = wrapped.value();
  t.not(obj, newObj);
});

test('no-op set', t => {
  const obj = {x: 1};
  const wrapped = createMutable(obj);
  wrapped.set('x', 1);
  const newObj = wrapped.value();
  t.is(obj, newObj);
});

test('get child', t => {
  const user = {name: {first: 'Joe'}};
  const wrapped = createMutable(user);
  const wrappedName = wrapped.get('name');
  t.is(wrappedName.get('first'), 'Joe');
});

test('set child', t => {
  const user = {name: {first: 'Joe'}};
  const wrappedUser = createMutable(user);
  const wrappedName = wrappedUser.get('name');
  wrappedName.set('first', 'Joseph');
  const newUser = wrappedUser.value();
  const newName = wrappedName.value();
  t.is(newName.first, 'Joseph');
  t.not(user.name, newName);
  t.not(user, newUser);
  t.deepEqual(newUser, {name: {first: 'Joseph'}});
});

test('no-op set child', t => {
  const user = {name: {first: 'Joe'}};
  const wrappedUser = createMutable(user);
  const wrappedName = wrappedUser.get('name');
  wrappedName.set('first', 'Joe');
  const newUser = wrappedUser.value();
  const newName = wrappedName.value();
  t.is(user, newUser);
  t.is(user.name, newName);
});

test('disconnect child', t => {
  const user = {name: {first: 'Joe'}};
  const wrappedUser = createMutable(user);
  const wrappedName = wrappedUser.get('name');
  wrappedUser.set('name', {first: 'Joseph'});
  wrappedName.set('first', 'Joey');
  const newUser = wrappedUser.value();
  const newName = wrappedName.value();
  t.deepEqual(newUser, {name: {first: 'Joseph'}});
  t.deepEqual(newName, {first: 'Joey'});
});

test('set to wrapped object', t => {
  const user = {name: {first: 'Joe'}};
  const wrappedUser = createMutable(user);
  const wrappedName = createMutable({first: 'Joseph'});
  wrappedUser.set('name', wrappedName);
  const newUser = wrappedUser.value();
  t.deepEqual(newUser, {name: {first: 'Joseph'}});
});

test('create mutator from wrapped object', t => {
  const user = {name: {first: 'Joe'}};
  const wrappedUser = createMutable(user);
  const sameWrappedUser = createMutable(wrappedUser);
  sameWrappedUser.get('name').set('first', 'Joseph');
  const newUser = wrappedUser.value();
  t.deepEqual(newUser, {name: {first: 'Joseph'}});
});
