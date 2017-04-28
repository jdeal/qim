import test from 'ava';

import 'babel-core/register';

import {
  update,
  $merge
} from 'qim/src';

test('$merge', t => {
  t.deepEqual(
    update([$merge({y: 2})], {x: 1}),
    {x: 1, y: 2}
  );

  const state = {x: 1};

  t.is(
    update([$merge({x: 1})], state),
    state
  );

  state.y = 2;

  t.is(
    update([$merge({x: 1})], state),
    state
  );

  t.deepEqual(
    update([$merge({0: 'x'})], []),
    ['x']
  );

  t.deepEqual(
    update([$merge(['x'])], []),
    ['x']
  );

  t.deepEqual(
    update([$merge(['a'])], ['x', 'y', 'z']),
    ['a', 'y', 'z']
  );
});
