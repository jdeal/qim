import $setContext from './$setContext';

const identity = v => v;

const $pushContext = (key, fn = identity) => $setContext(key,
  (obj, ctx) => (ctx[key] || []).concat(fn(obj, ctx))
);

export default $pushContext;
