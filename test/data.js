import test from 'ava';
import _ from 'lodash';

import 'babel-core/register';

import {wrap, unwrap, wrapSlice, wrapPick, replaceSlice, replacePick} from 'qim/src/utils/data';

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
  ],
  count: 2
});

test(wrapMethodsMacro, ['a'], {
  get: [
    ['b'], undefined,
    [0], 'a'
  ],
  set: [
    [0, 'aa'], ['aa'],
    [1, 'bb'], ['aa', 'bb']
  ],
  count: 2
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

test('replace slice', t => {
  const array = ['a', 'b', 'c'];
  t.deepEqual(
    replaceSlice(1, 2, ['x'], array),
    ['a', 'x', 'c']
  );
});

test('replace slice with wrapped slice', t => {
  const array = ['a', 'b', 'c'];
  t.deepEqual(
    replaceSlice(1, 2, wrap(['x']), array),
    ['a', 'x', 'c']
  );
});

test('replace slice of wrapped with wrapped slice', t => {
  const array = ['a', 'b', 'c'];
  t.deepEqual(
    unwrap(replaceSlice(1, 2, wrap(['x']), wrap(array))),
    ['a', 'x', 'c']
  );
});

test('count slice', t => {
  t.deepEqual(
    wrapSlice(['a', 'b', 'c', 'd'], 1, 3).count(),
    2
  );
  t.deepEqual(
    wrapSlice(['a', 'b', 'c', 'd'], 1).count(),
    3
  );
  t.deepEqual(
    wrapSlice(['a', 'b', 'c', 'd'], 1).count(),
    3
  );
  t.deepEqual(
    wrapSlice(['a', 'b', 'c', 'd'], -3).count(),
    3
  );
  t.deepEqual(
    wrapSlice(['a', 'b', 'c', 'd'], -3, -1).count(),
    2
  );
  t.deepEqual(
    wrapSlice(['a', 'b', 'c', 'd'], -0).count(),
    0
  );
});

test('get at slice index', t => {
  t.deepEqual(
    wrapSlice(['a', 'b', 'c', 'd'], 1, 3).getAtIndex(0),
    'b'
  );
});

test('pick', t => {
  const pick = wrapPick({a: 0, b: 1, c: 2}, ['a', 'c']);
  t.deepEqual(
    pick.value(),
    {a: 0, c: 2}
  );
});

test('pick of a pick', t => {
  const pick = wrapPick({a: 0, b: 1, c: 2}, ['a', 'c']);
  const pickOfPick = wrapPick(pick, ['a']);
  t.deepEqual(
    pickOfPick.value(),
    {a: 0}
  );
});

test('pick array', t => {
  const pick = wrapPick(['a', 'b', 'c'], [0, 2]);
  t.deepEqual(
    pick.value(),
    ['a', 'c']
  );
});

test('replace pick', t => {
  const object = {a: 0, b: 1, c: 2};
  t.deepEqual(
    replacePick(['a', 'c'], {x: 10}, object),
    {b: 1, x: 10}
  );
});

test('replace pick with wrapped pick', t => {
  const object = {a: 0, b: 1, c: 2};
  t.deepEqual(
    replacePick(['a', 'c'], wrap({x: 10}), object),
    {b: 1, x: 10}
  );
});

test('count pick', t => {
  t.deepEqual(
    wrapPick({a: 0, b: 1, c: 2}, ['a', 'c']).count(),
    2
  );
});
