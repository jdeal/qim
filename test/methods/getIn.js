import test from 'ava';

import 'babel-core/register';

import getIn from 'im-js/src/methods/getIn';

test('get undefined throws error', t => {
  t.throws(() => {
    getIn(undefined);
  });
});

test('get null throws error', t => {
  t.throws(() => {
    getIn(null);
  });
});

test('get number throws error', t => {
  t.throws(() => {
    getIn(3);
  });
});

test('getIn undefined key returns undefined', t => {
  const obj = {x: 1};
  t.is(getIn(obj, ['y']), undefined);
});

test('getIn value at key', t => {
  const obj = {x: 1};
  t.is(getIn(obj, ['x']), 1);
});

test('getIn value at deep key', t => {
  const obj = {x: {y: 1}};
  t.is(getIn(obj, ['x', 'y']), 1);
});
