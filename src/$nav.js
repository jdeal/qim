export const $navKey = '@@qim/$navKey';

const $nav = (path) => ({
  '@@qim/nav': $navKey,
  data: (typeof path === 'function' || Array.isArray(path)) ? path : [path]
});

export default $nav;
