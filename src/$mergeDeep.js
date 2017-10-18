import $traverse from './$traverse';
import {wrap} from './utils/data';

const $mergeDeep = (spec) => $traverse(
  (type, object, next) => next(wrap(object).merge(spec, true).value())
);

export default $mergeDeep;
