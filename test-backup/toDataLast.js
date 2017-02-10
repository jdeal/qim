import test from 'ava';

import 'babel-core/register';

import toDataLast from 'im-js/src/toDataLast';

test('convert data-first to data-last', t => {
  const getKey = (obj, key) => obj[key];
  const fpGetKey = toDataLast(getKey);
  console.log(fpGetKey.toString())
  t.is(fpGetKey('x', {x: 1}), 1);
});
