import test from 'ava';

import 'babel-core/register';

import {
  $apply,
  $lens,
  update
} from 'qim/src';

test('lens navigator', t => {
  const $pct = $lens(
    n => n * 100,
    pct => pct / 100
  );

  t.deepEqual(
    update(
      ['x', $pct, pct => pct > 50, $apply(pct => pct + 5)],
      {x: .75}
    ),
    {x: .80}
  );
});
