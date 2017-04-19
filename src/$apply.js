export const $applyKey = '@@qim/$apply';

const $apply = (transform) => ({'@@qim/nav': $applyKey, data: transform});

export default $apply;
