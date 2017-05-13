import createNavigator from './createNavigator';
import createMerge from './utils/createMerge';

const mergeDeep = createMerge({isDeep: true});

const applyMergeDeep = (args, object, next) => {
  const [spec] = args;
  return next(mergeDeep(spec, object));
};

const $mergeDeep = createNavigator({
  hasParams: true,
  select: applyMergeDeep,
  update: applyMergeDeep
});

export default $mergeDeep;
