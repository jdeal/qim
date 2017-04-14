export const selectKey = '@@im/select';
export const updateKey = '@@im/transform';
export const navigatorKey = '@@qim/nav';

const createNavigator = (config, createNavigatorCall) => {
  const nav = {};

  if (typeof config.select === 'function') {
    nav[selectKey] = config.select;
  }

  if (typeof config.update === 'function') {
    nav[updateKey] = config.update;
  }

  if (createNavigatorCall) {
    return createNavigatorCall(nav);
  }

  return nav;
};

export default createNavigator;
