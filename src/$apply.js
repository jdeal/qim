export const $applyKey = '@@qim/$apply';

const $apply = (predicate) => [$applyKey, predicate];

export default $apply;
