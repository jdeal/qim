import arrayify from './utils/arrayify';

export const selectKey = '@@qim/navSelect';
export const updateKey = '@@qim/navUpdate';
export const pathKey = '@@qim/navPath';

const createNavigator = (spec) => {
  let {path} = spec;
  const {hasParams} = spec;

  if (path) {
    if (typeof path !== 'function' && !Array.isArray(path)) {
      if (typeof path === 'object') {
        throw new Error('Function or array or primitive is required to create a path navigator.');
      }
      path = [path];
    }
    // If this navigator is unparameterized, just return an envelope with the
    // path array or function.
    if (!hasParams) {
      return {
        [pathKey]: path
      };
    }
    if (typeof path !== 'function') {
      throw new Error('Function or array is required to create a path navigator.');
    }
    // If our path function only accepts one parameter, we know it only depends
    // on `args`. In that case, it's not going to dynamically receive data, so
    // we can call the function as soon as we have arguments, rather than
    // calling every time we navigate.
    if (path.length === 1) {
      return (...args) => {
        const navPath = path(args);
        return {
          [pathKey]: navPath == null ? [] : arrayify(navPath)
        };
      };
    }
    // Create our parameterized navigator function, which will return an
    // envelope that points to our path function and arguments.
    const navFn = (...args) => ({
      [pathKey]: path,
      hasArgs: true,
      args,
      self: navFn
    });
    return navFn;
  } else {
    if (spec.select && typeof spec.select !== 'function') {
      throw new Error('Select method for a navigator must be a function.');
    }
    if (spec.update && typeof spec.update !== 'function') {
      throw new Error('Update method for a navigator must be a function.');
    }
    // If there are no parameters, just return an envelop with select/update
    // functions.
    if (!hasParams) {
      return {
        [selectKey]: spec.select,
        [updateKey]: spec.update
      };
    }
    // Create our parameterized navigator function, which will return an
    // envelope with select/update functions and arguments.
    return (...args) => ({
      [selectKey]: spec.select,
      [updateKey]: spec.update,
      hasArgs: true,
      args
    });
  }
};

export default createNavigator;
