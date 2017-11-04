import test from 'ava';
import util from 'util';

import 'babel-core/register';

import {
  select,
  update,
  $default,
  $at,
  $set
} from 'qim/src';

const selectDefaultMacro = (t, path, input, expected) => {
  const result = select(path, input);
  t.deepEqual(result, expected);
};

selectDefaultMacro.title = (title, path, input) => `select $path of ${util.inspect(input)}`;

test(selectDefaultMacro, ['a', $default({}), 'b'], {}, []);
test(selectDefaultMacro, ['a', $default({}), 'b', $default(0)], {}, [0]);
test(selectDefaultMacro, [$at(0), $default('x')], '', ['x']);

const updateDefaultMacro = (t, path, input, expected) => {
  const result = update(path, input);
  t.deepEqual(result, expected);
};

updateDefaultMacro.title = (title, path, input) => `update $path of ${util.inspect(input)}`;

test(updateDefaultMacro, ['a', $default({}), 'b', $set(1)], {}, {a: {b: 1}});
test(updateDefaultMacro, ['a', $default([]), 0, $set('x')], {}, {a: ['x']});
test(updateDefaultMacro, ['a', $default({b: 0}), 'c', $set(1)], {}, {a: {b: 0, c: 1}});
test(updateDefaultMacro, ['a', $default(['x']), 1, $set('y')], {}, {a: ['x', 'y']});
test(updateDefaultMacro, [$default({})], undefined, {});
test(updateDefaultMacro, [$default({}), 'a', $set(1)], undefined, {a: 1});
test(updateDefaultMacro, [$default([])], undefined, []);
test(updateDefaultMacro, [$default([]), 0, $set('x')], undefined, ['x']);
test(updateDefaultMacro, [0, $default('x')], [], ['x']);
test(updateDefaultMacro, [$at(0), $default('x')], '', 'x');
