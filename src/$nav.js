export const $navKey = '@@qim/$navKey';

const $nav = (path) => ({'@@qim/nav': $navKey, data: Array.isArray(path) ? path : [path]});

export default $nav;
