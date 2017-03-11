export const selectKey = '@@im/select';
export const updateKey = '@@im/transform';
export const navigatorRef = {};

const createNavigator = (config) => {
  const nav = {};

  if (typeof config.select === 'function') {
    nav[selectKey] = config.select;
  }

  if (typeof config.update === 'function') {
    nav[updateKey] = config.update;
  }

  return nav;
};

export default createNavigator;
