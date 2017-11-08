import test from 'ava';

import 'babel-core/register';

import {
  select,
  find,
  $first,
  $last,
  $nav,
  $each,
  $eachPair,
  $apply,
  $pushContext
} from 'qim/src';

test('$pushContext', t => {
  t.deepEqual(
    select(
      [$pushContext('first', find($first)), $each, $apply((letter, ctx) => `${ctx.first[0]}${letter}`)],
      ['a', 'b', 'c']
    ),
    ['aa', 'ab', 'ac']
  );

  const data = {a: {b: {c: 1, d: 2}}};

  const $walk = $nav((value) => {
    if (value && typeof value === 'object') {
      return [$eachPair, $pushContext('path', find($first)), $last, $walk];
    }
    return [];
  });

  t.deepEqual(
    select(
      [$walk, $apply((value, ctx) => [...ctx.path, value])],
      data
    ),
    [['a', 'b', 'c', 1], ['a', 'b', 'd', 2]]
  );
});
