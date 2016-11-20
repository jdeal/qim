import test from 'ava';

import 'babel-core/register';

import select from 'im-js/src/select';
import $values from 'im-js/src/selectors/values';

test('select from primitive', t => {
  t.deepEqual(
    select([], 1),
    [1]
  );
  t.deepEqual(
    select([], null),
    [null]
  );
  t.deepEqual(
    select(['x'], 1),
    [undefined]
  );
  t.deepEqual(
    select(['x'], null),
    [undefined]
  );
});

test('select from from object', t => {
  t.deepEqual(
    select([], {x: 1}),
    [{x: 1}]
  );
  t.deepEqual(
    select(['x'], {x: 1}),
    [1]
  );
});

test('select predicate', t => {
  const gtZero = value => value > 0;
  t.deepEqual(
    select([gtZero], 0),
    []
  );
  t.deepEqual(
    select([gtZero], 1),
    [1]
  );
});

test('select values', t => {
  t.deepEqual(
    select([$values], [1, 2, 3]),
    [1, 2, 3]
  );
  t.deepEqual(
    select([$values, 'x'], [{x: 1}, {x: 2}]),
    [1, 2]
  );
});
