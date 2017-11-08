import test from 'ava';

import 'babel-core/register';

import {
  update,
  $mergeDeep
} from 'qim/src';

test('$mergeDeep', t => {
  t.deepEqual(
    update([$mergeDeep({a: {ab: 2}})], {a: {aa: 1}, b: 2}),
    {a: {aa: 1, ab: 2}, b: 2}
  );

  const state = {x: {y: 1}};

  t.is(
    update([$mergeDeep({x: {y: 1}})], state),
    state
  );


  state.x.z = 2;

  t.is(
    update([$mergeDeep({x: {y: 1}})], state),
    state
  );

  t.deepEqual(
    update([$mergeDeep({0: {0: 'x'}})], [[]]),
    [['x']]
  );

  t.deepEqual(
    update([$mergeDeep([['x']])], [[]]),
    [['x']]
  );

  t.deepEqual(
    update([$mergeDeep(['a', ['b']])], ['x', ['y', 'z']]),
    ['a', ['b', 'z']]
  );
});
