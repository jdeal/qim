export const pathKey = '@@qim/navPath';

const $nav = function (path) {
  if (typeof path !== 'function' && !Array.isArray(path)) {
    if (typeof path === 'object') {
      throw new Error('Function or array or primitive is required to create a path navigator.');
    }
    path = [path];
  }
  const nav = {[pathKey]: path};
  nav.self = nav;
  if (arguments.length > 1) {
    const moreNavPaths = [];
    for (let i = 1; i < arguments.length; i++) {
      path = arguments[i];
      if (typeof path !== 'function' && !Array.isArray(path)) {
        if (typeof path === 'object') {
          throw new Error('Function or array or primitive is required to create a path navigator.');
        }
        path = [path];
      }
      moreNavPaths.push(path);
    }
    nav.moreNavPaths = moreNavPaths;
  }
  return nav;
};

export default $nav;
