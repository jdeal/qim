export const selectKey = '@@im/select';
export const updateKey = '@@im/transform';
export const navigatorRef = {};

const createNavigator = (config) => {
  const nav = {};

  if (typeof config.select === 'function') {
    nav[selectKey] = config.select;
  }

  if (typeof config.transform === 'function') {
    nav[updateKey] = config.transform;
  }

  return nav;
};

export default createNavigator;
