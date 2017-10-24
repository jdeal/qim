import $traverse from './$traverse';
import {wrap} from './utils/data';

function At(index) {
  this.index = index;
}

At.prototype = $traverse({
  select(object, next) {
    return next(wrap(object).getAtIndex(this.index));
  },
  update(object, next) {
    const wrapped = wrap(object);
    return wrapped
      .setAtIndex(this.index, next(wrapped.getAtIndex(this.index)))
      .value();
  }
});

const $at = index => new At(index);

export default $at;
