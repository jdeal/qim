export const $ifKey = '@@qim/$if';

const $if = (predicate) => [$ifKey, predicate];

export default $if;
