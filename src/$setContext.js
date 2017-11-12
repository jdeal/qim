import objectAssign from './utils/objectAssign';

export const $setContextKey = '@@qim/$setContext';

const setContext = (nav, value, context) => {
  context = objectAssign({}, context);
  context[nav.key] = value;
  return context;
};

const identity = v => v;

const $setContext = (key, fn = identity) => ({'@@qim/nav': $setContextKey, setContext, key, fn});

export default $setContext;
