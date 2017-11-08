import test from 'ava';

import 'babel-core/register';

import {
  select,
  update,
  find,
  $first,
  $each,
  $eachPair,
  $apply,
  $setContext
} from 'qim/src';

test('$setContext', t => {
  t.deepEqual(
    select(
      [$setContext('first', find($first)), $each, $apply((letter, ctx) => `${ctx.first}${letter}`)],
      ['a', 'b', 'c']
    ),
    ['aa', 'ab', 'ac']
  );

  t.deepEqual(
    update(
      ['stuff', $setContext('first', find($first)), $each, $apply((letter, ctx) => `${ctx.first}${letter}`)],
      {stuff: ['a', 'b', 'c']}
    ),
    {stuff: ['aa', 'ab', 'ac']}
  );

  t.deepEqual(
    select(
      [
        $eachPair, $setContext('level', find(0)), 1,
        $eachPair, $setContext('key', find(0)), 1,
        $apply((message, ctx) => ({level: ctx.level, key: ctx.key, message}))
      ],
      {error: {foo: 'a', bar: 'b'}, warning: {baz: 'c', qux: 'd'}}
    ),
    [
      {level: 'error', key: 'foo', message: 'a'},
      {level: 'error', key: 'bar', message: 'b'},
      {level: 'warning', key: 'baz', message: 'c'},
      {level: 'warning', key: 'qux', message: 'd'}
    ]
  );
});
