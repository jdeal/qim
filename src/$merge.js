import createNavigator from './createNavigator';
import getTypeErrorMessage from './utils/getTypeErrorMessage';

const merge = (nav, object, next) => {
  const {spec} = nav;
  if (spec && typeof spec === 'object') {
    let newObject = object;
    for (let key in spec) {
      if (spec.hasOwnProperty(key)) {
        if (newObject[key] !== spec[key]) {
          if (newObject === object) {
            if (Array.isArray(object)) {
              newObject = object.slice(0);
            } else {
              newObject = Object.assign({}, object);
            }
          }
          newObject[key] = spec[key];
        }
      }
    }
    return next(newObject);
  }
  throw new Error(getTypeErrorMessage('$merge', 'object', object));
};

const $merge = createNavigator({
  select: merge,
  update: merge
},
  (nav) => (spec) => ({'@@qim/nav': nav, spec})
);

export default $merge;
