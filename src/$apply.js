export const $applyKey = '@@qim/$apply';

const $apply = (predicate) => ({'@@qim/nav': $applyKey, data: predicate});

export default $apply;
