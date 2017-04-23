import test from 'ava';

import 'babel-core/register';

import getTypeErrorMessage from 'qim/src/utils/getTypeErrorMessage';

test('get error message for one type', t => {
  t.is(
    getTypeErrorMessage('$foo', 'array', {}),
    '$foo only supports arrays, but an object was provided.'
  );
});

test('get error message for two types', t => {
  t.is(
    getTypeErrorMessage('$foo', ['array', 'string'], 3),
    '$foo only supports arrays and strings, but a number was provided.'
  );
});

test('get error message for three types', t => {
  t.is(
    getTypeErrorMessage('$foo', ['array', 'object', 'string'], true),
    '$foo only supports arrays, objects, and strings, but a boolean was provided.'
  );
});
