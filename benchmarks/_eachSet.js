import {update, $nav, $apply, $each, $eachPair} from '../src';

const data = {a: 'foo', b: 'bar', c: 'baz'};

const toUpperCase = s => s.toUpperCase();

export default [
  {
    name: '$each',
    test: () => (
      update([$each, $apply(toUpperCase)], data)
    )
  },
  {
    name: '$eachPair, 1',
    test: () => (
      update([$eachPair, 1, $apply(toUpperCase)], data)
    )
  },
  {
    name: '$nav([$eachPair, 1])',
    test: () => (
      update([$nav([$eachPair, 1]), $apply(toUpperCase)], data)
    )
  }
];
