import test from 'ava';
import _ from 'lodash';

import 'babel-core/register';

import { wrap, unwrap, wrapSlice, wrapPick, $none } from 'qim/src/utils/data';

test('wrap/unwrap', t => {
  const wrappedValue = wrap(0);
  t.is(wrappedValue.value(), 0);
  t.is(unwrap(wrappedValue), 0);
});

test('wrap already wrapped', t => {
  const wrappedValue = wrap(0);
  const rewrappedValue = wrap(wrappedValue);
  t.is(rewrappedValue.value(), 0);
  t.is(unwrap(rewrappedValue), 0);
});

const wrapMethodsMacro = (t, input, expected) => {
  const clone = _.cloneDeep(input);
  const wrapped = wrap(input);
  const output = Object.keys(expected).reduce((result, method) => {
    const expectedResult = expected[method];
    const calls = Array.isArray(expectedResult)
      ? _.chunk(expectedResult, 2)
      : [[[], expectedResult]];
    const callMethod = (wrappedMethod, args) => {
      try {
        return _.cloneDeep(unwrap(wrappedMethod.apply(wrapped, args)));
      } catch (e) {
        return new Error();
      }
    };
    result[method] = _.flatten(
      calls.map(([args]) => [args, callMethod(wrapped[method], args)])
    );
    if (!Array.isArray(expectedResult)) {
      result[method] = result[method][1];
    }
    return result;
  }, {});
  t.deepEqual(output, expected);
  t.deepEqual(input, clone);
};

wrapMethodsMacro.title = (title, input) =>
  `wrapper methods for value: ${input}`;

// prettier-ignore
test(wrapMethodsMacro, undefined, {
  get: [
    ['foo'], undefined,
    [0], undefined
  ],
  has: [
    ['foo'], false
  ],
  set: [
    ['x', 0], undefined
  ],
  delete: [
    ['foo'], undefined
  ],
  getAtIndex: new Error(),
  setAtIndex: new Error(),
  count: new Error(),
  value: undefined,
  canAppend: false,
  toArray: new Error(),
  reduce: new Error(),
  mapPairs: new Error(),
  merge: [
    [1], 1,
    [{}], {}
  ],
  sliceToValue: new Error(),
  replaceSlice: new Error(),
  replacePick: new Error(),
  cloneEmpty: new Error(),
  isUndefined: true,
  isNone: false,
  isSequence: false,
  hasKeys: false,
  isList: false
});

// prettier-ignore
test(wrapMethodsMacro, 1, {
  get: [
    ['foo'], undefined,
    [0], undefined
  ],
  has: [
    ['foo'], false
  ],
  set: [
    ['x', 0], 1
  ],
  delete: [
    ['foo'], 1
  ],
  getAtIndex: new Error(),
  setAtIndex: new Error(),
  count: new Error(),
  value: 1,
  canAppend: false,
  toArray: new Error(),
  reduce: new Error(),
  mapPairs: new Error(),
  merge: [
    [2], 2,
    [{}], {}
  ],
  sliceToValue: new Error(),
  replaceSlice: new Error(),
  replacePick: new Error(),
  cloneEmpty: new Error(),
  isUndefined: false,
  isNone: false,
  isSequence: false,
  hasKeys: false,
  isList: false
});

// prettier-ignore
test(wrapMethodsMacro, {foo: 'bar'}, {
  get: [
    ['foo'], 'bar',
    [0], undefined
  ],
  has: [
    ['foo'], true,
    ['bar'], false,
  ],
  set: [
    ['foo', 'baz'], {foo: 'baz'},
    ['x', 1], {foo: 'baz', x: 1},
    [0, 'zero'], {foo: 'baz', x: 1, 0: 'zero'}
  ],
  delete: [
    ['x'], {foo: 'baz', 0: 'zero'}
  ],
  getAtIndex: [
    [0], 'zero',
    [1], 'baz'
  ],
  setAtIndex: [
    [1, 'bar'], {0: 'zero', foo: 'bar'}
  ],
  count: 2,
  value: {0: 'zero', foo: 'bar'},
  canAppend: false,
  toArray: [
    [], ['zero', 'bar']
  ],
  reduce: [
    [
      (result, value, key) => {
        result.push([key, value]);
        return result;
      }, [],
    ], [['0', 'zero'], ['foo', 'bar']]
  ],
  mapPairs: [
    [
      ([key, value]) => [key.toUpperCase(), value.toUpperCase()]
    ], {0: 'ZERO', 'FOO': 'BAR'}
  ],
  merge: [
    [{x: 1}], {0: 'zero', foo: 'bar', x: 1}
  ],
  sliceToValue: [
    [1, 2], {foo: 'bar'}
  ],
  replaceSlice: [
    [1, 2, {foo: 'baz'}], {0: 'zero', foo: 'baz', x: 1}
  ],
  replacePick: [
    [['foo', 'x'], {foo: 'bar'}], {0: 'zero', foo: 'bar'}
  ],
  cloneEmpty: [
    [], {}
  ],
  isUndefined: false,
  isNone: false,
  isSequence: true,
  hasKeys: true,
  isList: false
});

// prettier-ignore
test(wrapMethodsMacro, ['a'], {
  get: [
    ['b'], undefined,
    [0], 'a',
    [1], undefined
  ],
  has: [
    ['x'], false,
    [0], true,
    [1], false
  ],
  set: [
    [0, 'aa'], ['aa'],
    [1, 'xx'], ['aa', 'xx'],
    [2, 'cc'], ['aa', 'xx', 'cc'],
    [1, 'bb'], ['aa', 'bb', 'cc']
  ],
  delete: [
    ['x'], ['aa', 'bb', 'cc'],
    [1], ['aa', 'cc'],
  ],
  getAtIndex: [
    [0], 'aa',
    [1], 'cc'
  ],
  setAtIndex: [
    [1, 'bb'], ['aa', 'bb'],
    [10, $none], ['aa', 'bb']
  ],
  count: 2,
  value: [
    [], ['aa', 'bb']
  ],
  canAppend: true,
  toArray: [
    [], ['aa', 'bb']
  ],
  reduce: [
    [
      (result, value, key) => {
        result.push([key, value]);
        return result;
      }, [],
    ], [[0, 'aa'], [1, 'bb']]
  ],
  mapPairs: [
    [
      ([key, value]) => [2 - key, value.toUpperCase()]
    ], ['BB', 'AA']
  ],
  merge: [
    [['cc']], ['cc', 'bb']
  ],
  sliceToValue: [
    [1, 2], ['bb']
  ],
  replaceSlice: [
    [1, 2, ['dd']], ['cc', 'dd']
  ],
  replacePick: [
    [[0], ['aa']], ['aa', 'dd']
  ],
  cloneEmpty: [
    [], []
  ],
  isUndefined: false,
  isNone: false,
  isSequence: true,
  hasKeys: false,
  isList: true
});

// prettier-ignore
test(wrapMethodsMacro, 'a', {
  get: [
    ['b'], undefined,
    [0], 'a',
    [1], undefined
  ],
  has: [
    ['x'], false,
    [0], true,
    [1], false
  ],
  set: [
    [0, 'x'], 'x',
    [1, 'y'], 'xy',
    [2, 'z'], 'xyz',
    [1, 'yy'], 'xyyz',
    [10, $none], 'xyyz'
  ],
  delete: [
    ['x'], 'xyyz',
    [2], 'xyz'
  ],
  getAtIndex: [
    [0], 'x',
    [1], 'y',
    [-1], 'z',
    [10], undefined
  ],
  setAtIndex: [
    [1, 'Y'], 'xYz',
    [3, '_'], 'xYz_',
    [3, ''], 'xYz'
  ],
  count: 3,
  value: 'xYz',
  canAppend: true,
  toArray: [
    [], ['x', 'Y', 'z']
  ],
  reduce: [
    [
      (result, value, key) => {
        result.push([key, value]);
        return result;
      }, [],
    ], [[0, 'x'], [1, 'Y'], [2, 'z']]
  ],
  mapPairs: [
    [
      ([key, value]) => [3 - key, value.toUpperCase()]
    ], 'ZYX'
  ],
  merge: [
    // does not mutate
    ['abc'], 'abc'
  ],
  sliceToValue: [
    [1, 2], 'Y'
  ],
  replaceSlice: [
    [1, 2, 'y'], 'xyz'
  ],
  replacePick: [
    [[1], ['yy']], 'xyyz'
  ],
  cloneEmpty: '',
  isUndefined: false,
  isNone: false,
  isSequence: true,
  hasKeys: false,
  isList: false
});

test('slice', t => {
  const slice = wrapSlice(['a', 'b', 'c'], 0, 2);
  t.deepEqual(slice.value(), ['a', 'b']);
});

test('slice of a slice', t => {
  const slice = wrapSlice(['a', 'b', 'c'], 0, 2);
  const sliceOfSlice = wrapSlice(slice, 0, 1);
  t.deepEqual(sliceOfSlice.value(), ['a']);
});

test('slice object', t => {
  const slice = wrapSlice({ a: 0, b: 1, c: 2 }, 0, 2);
  t.deepEqual(slice.value(), { a: 0, b: 1 });
});

test('replace slice', t => {
  const array = ['a', 'b', 'c'];
  t.deepEqual(
    wrap(array)
      .replaceSlice(1, 2, ['x'])
      .value(),
    ['a', 'x', 'c']
  );
});

test('replace slice with wrapped slice', t => {
  const array = ['a', 'b', 'c'];
  t.deepEqual(
    wrap(array)
      .replaceSlice(1, 2, wrap(['x']))
      .value(),
    ['a', 'x', 'c']
  );
});

test('replace slice of wrapped with wrapped slice', t => {
  const array = ['a', 'b', 'c'];
  t.deepEqual(
    wrap(array)
      .replaceSlice(1, 2, wrap(['x']))
      .value(),
    ['a', 'x', 'c']
  );
});

test('count slice', t => {
  t.deepEqual(wrapSlice(['a', 'b', 'c', 'd'], 1, 3).count(), 2);
  t.deepEqual(wrapSlice(['a', 'b', 'c', 'd'], 1).count(), 3);
  t.deepEqual(wrapSlice(['a', 'b', 'c', 'd'], 1).count(), 3);
  t.deepEqual(wrapSlice(['a', 'b', 'c', 'd'], -3).count(), 3);
  t.deepEqual(wrapSlice(['a', 'b', 'c', 'd'], -3, -1).count(), 2);
  t.deepEqual(wrapSlice(['a', 'b', 'c', 'd'], Infinity).count(), 0);
});

test('get at slice index', t => {
  t.deepEqual(wrapSlice(['a', 'b', 'c', 'd'], 1, 3).getAtIndex(0), 'b');
});

test('pick', t => {
  const pick = wrapPick({ a: 0, b: 1, c: 2 }, ['a', 'c']);
  t.deepEqual(pick.value(), { a: 0, c: 2 });
});

test('pick of a pick', t => {
  const pick = wrapPick({ a: 0, b: 1, c: 2 }, ['a', 'c']);
  const pickOfPick = wrapPick(pick, ['a']);
  t.deepEqual(pickOfPick.value(), { a: 0 });
});

test('pick array', t => {
  const pick = wrapPick(['a', 'b', 'c'], [0, 2]);
  t.deepEqual(pick.value(), ['a', 'c']);
});

test('replace pick', t => {
  const object = { a: 0, b: 1, c: 2 };
  t.deepEqual(
    wrap(object)
      .replacePick(['a', 'c'], { x: 10 })
      .value(),
    { b: 1, x: 10 }
  );
});

test('replace pick with wrapped pick', t => {
  const object = { a: 0, b: 1, c: 2 };
  t.deepEqual(
    wrap(object)
      .replacePick(['a', 'c'], wrap({ x: 10 }))
      .value(),
    { b: 1, x: 10 }
  );
});

test('count pick', t => {
  t.deepEqual(wrapPick({ a: 0, b: 1, c: 2 }, ['a', 'c']).count(), 2);
});
