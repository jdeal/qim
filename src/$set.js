export const $setKey = '@@qim/$setKey';

const $set = (value) => ({'@@qim/nav': $setKey, value});

export default $set;
