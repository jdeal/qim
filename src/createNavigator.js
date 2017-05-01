import arrayify from './utils/arrayify';

export const selectKey = '@@qim/navSelect';
export const updateKey = '@@qim/navUpdate';
export const pathKey = '@@qim/navPath';

const createNavigator = (spec) => {
  const {path, hasParams} = spec;

  if (path) {
    if (typeof path !== 'function' && !Array.isArray(path)) {
      throw new Error('Function or array is required to create a path navigator.');
    }
    if (!hasParams) {
      return {
        [pathKey]: path
      };
    }
    if (typeof path !== 'function') {
      throw new Error('Function or array is required to create a path navigator.');
    }
    // If our path functoin only accepts one parameter, we know it only depends
    // on `params`. In that case, it's not going to dynamically receive data, so
    // we can call the function as soon as we have parameters, rather than
    // calling every time we navigate.
    if (path.length === 1) {
      return (...params) => {
        const navPath = path(params);
        return {
          [pathKey]: navPath == null ? [] : arrayify(navPath)
        };
      };
    }
    const navFn = (...params) => ({
      [pathKey]: path,
      hasParams: true,
      params,
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
    if (!hasParams) {
      return {
        [selectKey]: spec.select,
        [updateKey]: spec.update
      };
    }
    return (...params) => ({
      [selectKey]: spec.select,
      [updateKey]: spec.update,
      hasParams: true,
      params
    });
  }
};

export default createNavigator;
