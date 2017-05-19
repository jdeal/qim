export const $applyKey = '@@qim/$apply';

const $apply = (fn) => ({'@@qim/nav': $applyKey, fn});

export default $apply;
