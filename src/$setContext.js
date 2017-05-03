export const $setContextKey = '@@qim/$setContext';

const setContext = (nav, value, context) => ({
  ...context,
  [nav.key]: value
});

const identity = v => v;

const $setContext = (key, fn = identity) => ({'@@qim/nav': $setContextKey, setContext, key, fn});

export default $setContext;
