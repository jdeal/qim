export const $noneKey = '@@qim/$noneKey';

const $none = ({'@@qim/nav': $noneKey});

export const isNone = (value) => value && value['@@qim/nav'] === $noneKey;

export const undefinedIfNone = (value) => isNone(value) ? undefined : value;

export default $none;
