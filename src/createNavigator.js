export const selectKey = '@@qim/select';
export const updateKey = '@@qim/update';
export const navigatorKey = '@@qim/nav';

const createNavigator = (createParams, spec) => {
  if (typeof spec === 'undefined') {
    spec = createParams;
    createParams = false;
  }

  const nav = {};

  if (typeof spec.select === 'function') {
    nav[selectKey] = spec.select;
  }

  if (typeof spec.update === 'function') {
    nav[updateKey] = spec.update;
  }

  if (createParams) {
    if (typeof createParams === 'function') {
      return (...params) => ({
        '@@qim/nav': nav,
        params: createParams(...params),
        hasParams: true
      });
    } else {
      return (...params) => ({
        '@@qim/nav': nav,
        params,
        hasParams: true
      });
    }
  }

  return nav;
};

export default createNavigator;
