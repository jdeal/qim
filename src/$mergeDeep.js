import $traverse from './$traverse';
import createMerge from './utils/createMerge';

const mergeDeep = createMerge({isDeep: true});

const $mergeDeep = (spec) => $traverse(
  (type, object, next) => next(mergeDeep(spec, object))
);

export default $mergeDeep;
