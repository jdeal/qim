export const pathKey = '@@qim/navPath';

const wrapPath = (path) => {
  if (typeof path !== 'function' && !Array.isArray(path)) {
    if (typeof path === 'object') {
      throw new Error('$nav requires function/array/primitive.');
    }
    path = [path];
  }
  return path;
};

const $nav = function (path) {
  path = wrapPath(path);
  const nav = {[pathKey]: path};
  nav.self = nav;
  if (arguments.length > 1) {
    const moreNavPaths = [];
    for (let i = 1; i < arguments.length; i++) {
      path = arguments[i];
      path = wrapPath(path);
      moreNavPaths.push(path);
    }
    nav.moreNavPaths = moreNavPaths;
  }
  return nav;
};

export default $nav;
