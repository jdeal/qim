import $traverse from './$traverse';
import {wrap} from './utils/data';

export function Merge (spec, isDeep) {
  this.spec = spec;
  this.isDeep = isDeep;
}

Merge.prototype = $traverse(
  function (type, object, next) {
    return next(wrap(object).merge(this.spec, this.isDeep).value());
  }
);

const $merge = spec => new Merge(spec);

export default $merge;
