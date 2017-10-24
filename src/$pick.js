import $traverse from './$traverse';
import {wrapPick, unwrap, replacePick} from './utils/data';

function Pick(args) {
  this.args = args;
}

Pick.prototype = $traverse({
  select(object, next) {
    return next(wrapPick(object, this.args));
  },
  update(object, next) {
    const pick = wrapPick(object, this.args);
    const result = next(pick);

    return unwrap(replacePick(this.args, result, object));
  }
});

const $pick = (...args) => new Pick(args);

export default $pick;
