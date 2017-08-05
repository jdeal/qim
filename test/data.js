import test from 'ava';
import _ from 'lodash';

import 'babel-core/register';

import {wrap, unwrap, wrapSlice} from 'qim/src/utils/data';

test('wrap/unwrap', t => {
  const wrappedValue = wrap(0);
  t.is(
    wrappedValue.value(),
    0
  );
  t.is(
    unwrap(wrappedValue),
    0
  );
});

test('wrap already wrapped', t => {
  const wrappedValue = wrap(0);
  const rewrappedValue = wrap(wrappedValue);
  t.is(
    rewrappedValue.value(),
    0
  );
  t.is(
    unwrap(rewrappedValue),
    0
  );
});

const wrapMethodsMacro = (t, input, expected) => {
  const clone = _.cloneDeep(input);
  const wrapped = wrap(input);
  const output = Object.keys(expected).reduce((result, method) => {
    const expectedResult = expected[method];
    if (Array.isArray(expectedResult)) {
      const calls = _.chunk(expectedResult, 2);
      result[method] = _.flatten(calls.map(([args]) => [
        args,
        _.cloneDeep(unwrap(wrapped[method].apply(wrapped, args)))
      ]));
    } else {
      result[method] = _.cloneDeep(unwrap(wrapped[method]()));
    }
    return result;
  }, {});
  t.deepEqual(output, expected);
  t.deepEqual(input, clone);
};

wrapMethodsMacro.title = (title, input) => `wrapper methods for value: ${input}`;

test(wrapMethodsMacro, undefined, {
  get: [
    ['foo'], undefined,
    [0], undefined
  ],
  set: [
    ['x', 0], undefined
  ]
});

test(wrapMethodsMacro, {foo: 'bar'}, {
  get: [
    ['foo'], 'bar',
    [0], undefined
  ],
  set: [
    ['foo', 'baz'], {foo: 'baz'},
    [0, 'zero'], {foo: 'baz', 0: 'zero'}
  ]
});

test(wrapMethodsMacro, ['a'], {
  get: [
    ['b'], undefined,
    [0], 'a'
  ],
  set: [
    [0, 'aa'], ['aa'],
    [1, 'bb'], ['aa', 'bb']
  ]
});

test('slice', t => {
  const slice = wrapSlice(['a', 'b', 'c'], 0, 2);
  t.deepEqual(
    slice.value(),
    ['a', 'b']
  );
});

test('slice of a slice', t => {
  const slice = wrapSlice(['a', 'b', 'c'], 0, 2);
  const sliceOfSlice = wrapSlice(slice, 0, 1);
  t.deepEqual(
    sliceOfSlice.value(),
    ['a']
  );
});

test('slice object', t => {
  const slice = wrapSlice({a: 0, b: 1, c: 2}, 0, 2);
  t.deepEqual(
    slice.value(),
    {a: 0, b: 1}
  );
});
