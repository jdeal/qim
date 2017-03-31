export const $applyKey = '@@qim/$apply';

const $apply = (fn) => [$applyKey, fn];

export default $apply;
