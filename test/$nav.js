import test from 'ava';

import 'babel-core/register';

import {
  $each,
  $eachPair,
  $apply,
  $nav,
  select,
  update,
  has
} from 'qim/src';

test('recursive path navigator', t => {
  const $walk = $nav((item) =>
    Array.isArray(item) ? [$each, $walk] : []
  );

  t.deepEqual(
    select([$walk, val => val % 2 === 0], [0, 1, 2, [4, 5, 6, [7, 8, 9]]]),
    [0, 2, 4, 6, 8]
  );
});

test('parameterized path navigator', t => {
  const $eachIfKeyStartsWith = (prefix) => $nav(
    [
      $eachPair,
      has([0, key => key.substring(0, prefix.length) === prefix]),
      1
    ]
  );

  t.deepEqual(
    update(
      [$eachIfKeyStartsWith('a'), $apply(value => value * 10)],
      {a: 1, aa: 2, b: 3, bb: 4}
    ),
    {a: 10, aa: 20, b: 3, bb: 4}
  );
});
