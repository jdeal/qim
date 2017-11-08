import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  $each,
  $pick,
  $set,
  $apply,
  $none
} from 'qim/src';

const increment = value => value + 1;
const toUpperCase = s => s.toUpperCase();

test('select pick from object', t => {
  t.deepEqual(
    select(
      [$pick('a', 'c')],
      {a: 1, b: 2, c: 3}
    ),
    [{a: 1, c: 3}]
  );
});

test('update pick of object', t => {
  t.deepEqual(
    update(
      [$pick('a', 'c'), $set({a: 2})],
      {a: 1, b: 2, c: 3}
    ),
    {a: 2, b: 2}
  );
});

test('update pick of object to $none', t => {
  t.deepEqual(
    update(
      [$pick('a', 'c'), $none],
      {a: 1, b: 2, c: 3}
    ),
    {b: 2}
  );
});

test('select pick from object with flattening', t => {
  t.deepEqual(
    select(
      [$pick('a', ['c', 'e'])],
      {a: 1, b: 2, c: 3, d: 4, e: 5}
    ),
    [{a: 1, c: 3, e: 5}]
  );
});

test('select pick from array', t => {
  t.deepEqual(
    select([$pick(0, 2)], ['a', 'b', 'c']),
    [['a', 'c']]
  );
});

test('select each from pick from object', t => {
  t.deepEqual(
    select(
      [$pick('joe', 'mary'), $each, 'name'],
      {joe: {name: 'Joe'}, mary: {name: 'Mary'}, bob: {name: 'Bob'}}
    ),
    ['Joe', 'Mary']
  );
});

test('update each of pick of object', t => {
  t.deepEqual(
    update([$pick('x', 'y'), $each, $apply(increment)], {x: 1, y: 1, z: 1}),
    {x: 2, y: 2, z: 1}
  );
});

test('update each of pick of array', t => {
  t.deepEqual(
    update([$pick(0, 2), $each, $apply(toUpperCase)], ['a', 'b', 'c']),
    ['A', 'b', 'C']
  );
});

test('replace a pick', t => {
  t.deepEqual(
    update([$pick('x', 'y'), $set({a: 1})], {x: 1, y: 1, z: 1}),
    {a: 1, z: 1}
  );
});
