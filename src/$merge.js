import $traverse from './$traverse';
import {wrap} from './utils/data';

const $merge = (spec) => $traverse(
  (type, object, next) => next(wrap(object).merge(spec).value())
);

export default $merge;
