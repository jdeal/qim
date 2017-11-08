import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  $none
} from 'qim/src';

test('select just $none', t => {
  t.deepEqual(
    select($none, {}),
    []
  );
});

test('update to $none', t => {
  t.deepEqual(
    update($none, {}),
    undefined
  );
});

test('remove non-existent path', t => {
  t.deepEqual(
    update(['x', 'y', $none], {}),
    {}
  );
});
