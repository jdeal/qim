import test from 'ava';

import 'babel-core/register';

import transform from 'im-js/src/transform';
import $values from 'im-js/src/selectors/values';

const identity = value => value;

test('transform identity', t => {
  t.deepEqual(
    transform([], identity, {x: 1}),
    {x: 1}
  );
  t.deepEqual(
    transform(['x'], 2, {x: 1}),
    {x: 2}
  );
});

test('transform predicate', t => {
  const gtZero = value => value > 0;
  t.deepEqual(
    transform([gtZero], value => value + 1, 0),
    0
  );
  t.deepEqual(
    transform([gtZero], value => value + 1, 1),
    2
  );
});

test('transform values', t => {
  t.deepEqual(
    transform([$values], value => value + 1, [1, 2, 3]),
    [2, 3, 4]
  );
  t.deepEqual(
    transform([$values, 'x'], value => value + 1, [{x: 1}, {x: 2}]),
    [{x: 2}, {x: 3}]
  );
});
