export const $setKey = '@@qim/$setKey';

const $set = (value) => ({'@@qim/nav': $setKey, data: value});

export default $set;
