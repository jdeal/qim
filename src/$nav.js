import arrayify from './utils/arrayify';

export const $navKey = '@@qim/$navKey';

const $nav = (createParams, path) => {
  if (typeof path === 'undefined') {
    path = createParams;
    createParams = false;
  }
  if (!createParams) {
    if (typeof path !== 'function' && !Array.isArray(path)) {
      throw new Error('$nav only accepts an array path or a function that creates a path.');
    }
    return {
      '@@qim/nav': $navKey,
      data: path
    };
  }
  if (typeof path !== 'function') {
    throw new Error("$nav can't be parameterized with a static path.");
  }

  if (typeof createParams === 'function') {
    // If we only pass one parameter in, we know we're only passing in `params`.
    // In that case, it's not going to dynamically receive data, so we can call
    // the function as soon as we create $nav instead of calling it every time
    // we navigate.
    if (path.length === 1) {
      return (...params) => {
        const navPath = path(createParams(params));
        return {
          '@@qim/nav': $navKey,
          data: navPath == null ? [] : arrayify(navPath)
        };
      };
    }
    const navFn = (...params) => ({
      '@@qim/nav': $navKey,
      hasParams: true,
      data: path,
      params: createParams(params),
      self: navFn
    });
  }
  // See optimization note above.
  if (path.length === 1) {
    return (...params) => {
      const navPath = path(params);
      return {
        '@@qim/nav': $navKey,
        data: navPath == null ? [] : arrayify(navPath)
      };
    };
  }
  const navFn = (...params) => ({
    '@@qim/nav': $navKey,
    hasParams: true,
    data: path,
    params,
    self: navFn
  });
  return navFn;
};

export default $nav;
