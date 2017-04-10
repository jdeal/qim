export const $navKey = '@@qim/$navKey';

const $nav = (path) => [$navKey, Array.isArray(path) ? path : [path]];

export default $nav;
