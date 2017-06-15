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
    const moreNavPath = [];
    for (let i = 1; i < arguments.length; i++) {
      path = arguments[i];
      if (typeof path !== 'function' && !Array.isArray(path)) {
        if (typeof path === 'object') {
          throw new Error('Function or array or primitive is required to create a path navigator.');
        }
        path = [path];
      }
      moreNavPath.push(path);
    }
    nav.moreNavPath = moreNavPath;
  }
  return nav;
};

export default $nav;
