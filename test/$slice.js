import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  $slice,
  $each,
  $apply
} from 'qim/src';

const toUpperCase = s => s.toUpperCase();

test('$slice', t => {
  t.deepEqual(
    select([$slice(1), $each], ['a', 'b', 'c']),
    ['b', 'c']
  );
  t.deepEqual(
    select([$slice(-2), $each], ['a', 'b', 'c']),
    ['b', 'c']
  );
  t.deepEqual(
    update([$slice(1), $each, $apply(toUpperCase)], ['a', 'b', 'c']),
    ['a', 'B', 'C']
  );
  t.deepEqual(
    update([$slice(-2), $each, $apply(toUpperCase)], ['a', 'b', 'c']),
    ['a', 'B', 'C']
  );
});
