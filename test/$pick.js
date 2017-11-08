import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  $each,
  $pick,
  $set,
  $apply
} from 'qim/src';

const increment = value => value + 1;

test('select each from pick', t => {
  t.deepEqual(
    select(
      [$pick('joe', 'mary'), $each, 'name'],
      {joe: {name: 'Joe'}, mary: {name: 'Mary'}, bob: {name: 'Bob'}}
    ),
    ['Joe', 'Mary']
  );
});

test('update each of pick', t => {
  t.deepEqual(
    update([$pick('x', 'y'), $each, $apply(increment)], {x: 1, y: 1, z: 1}),
    {x: 2, y: 2, z: 1}
  );
});

test('replace a pick', t => {
  t.deepEqual(
    update([$pick('x', 'y'), $set({a: 1})], {x: 1, y: 1, z: 1}),
    {a: 1, z: 1}
  );
});
