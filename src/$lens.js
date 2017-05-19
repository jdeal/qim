export const $lensKey = '@@qim/$lens';

const $lens = (fn, fromFn) => ({'@@qim/nav': $lensKey, fn, fromFn});

export default $lens;
