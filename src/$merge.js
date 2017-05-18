import $traverse from './$traverse';
import createMerge from './utils/createMerge';

const merge = createMerge();

const $merge = (spec) => $traverse(
  (type, object, next) => next(merge(spec, object))
);

export default $merge;
