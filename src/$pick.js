import $traverse from './$traverse';
import {wrapPick, unwrap, replacePick} from './utils/data';

const $pick = (...args) => $traverse({
  select: (object, next) => {
    return next(wrapPick(object, args));
  },
  update: (object, next) => {
    const pick = wrapPick(object, args);
    const result = next(pick);

    return unwrap(replacePick(args, result, object));
  }
});

export default $pick;
