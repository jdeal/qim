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

test('$pick', t => {
  t.deepEqual(
    select(
      [$pick('joe', 'mary'), $each, 'name'],
      {joe: {name: 'Joe'}, mary: {name: 'Mary'}, bob: {name: 'Bob'}}
    ),
    ['Joe', 'Mary']
  );
});

test('replace pick', t => {
  t.deepEqual(
    update([$pick('x', 'y'), $each, $apply(increment)], {x: 1, y: 1, z: 1}),
    {x: 2, y: 2, z: 1}
  );
});

test('replace pick with dynamic', t => {
  t.deepEqual(
    update([$pick('x', 'y'), $set({a: 1})], {x: 1, y: 1, z: 1}),
    {a: 1, z: 1}
  );
});

test('apply pick', t => {
  t.deepEqual(
    update([$pick(['x', 'y']), $each, $apply(val => val + 1)], {x: 1, y: 1, z: 1}),
    {x: 2, y: 2, z: 1}
  );
});
