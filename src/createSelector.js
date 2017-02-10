let _nextSelectorId = 0;
export const getNextSelectorId = () => _nextSelectorId++;

export const cacheSelectorId = getNextSelectorId();

export const selectKey = '@@im/select';
export const transformKey = '@@im/transform';
export const idKey = '@@/id';

const createSelector = (config) => {
  const selector = {
    [idKey]: getNextSelectorId()
  };

  if (typeof config.select === 'function') {
    selector[selectKey] = config.select;
  }

  if (typeof config.transform === 'function') {
    selector[transformKey] = config.transform;
  }

  return selector;
};

export default createSelector;
