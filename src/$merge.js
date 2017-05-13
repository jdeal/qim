import createNavigator from './createNavigator';
import createMerge from './utils/createMerge';

const merge = createMerge();

const applyMerge = (args, object, next) => {
  const [spec] = args;
  return next(merge(spec, object));
};

const $merge = createNavigator({
  hasParams: true,
  select: applyMerge,
  update: applyMerge
});

export default $merge;
