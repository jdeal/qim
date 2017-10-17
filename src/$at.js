import $traverse from './$traverse';
import {wrap} from './utils/data';

function AtNavigator(index) {
  this.index = index;
}

AtNavigator.prototype = {
  ...$traverse({
    select(object, next) {
      return next(wrap(object).getAtIndex(this.index));
    },
    update(object, next) {
      const wrapped = wrap(object);
      return wrapped
        .setAtIndex(this.index, next(wrapped.getAtIndex(this.index)))
        .value();
    }
  })
};

const $at = index => new AtNavigator(index);

export default $at;
