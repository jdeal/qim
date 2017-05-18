export const pathKey = '@@qim/navPath';

const $nav = (path) => {
  if (typeof path !== 'function' && !Array.isArray(path)) {
    if (typeof path === 'object') {
      throw new Error('Function or array or primitive is required to create a path navigator.');
    }
    path = [path];
  }
  const nav = {[pathKey]: path};
  nav.self = nav;
  return nav;
};

export default $nav;
