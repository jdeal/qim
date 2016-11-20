import createMutable from './createMutable';

class ImmutableWrapper {

  constructor(obj) {
    this._obj = obj;
  }

  withMutations(mutate) {
    const mutator = createMutable(this._obj);
    mutate(mutator);
    return new ImmutableWrapper(mutator.value());
  }

  set(key, value) {
    return this.withMutations(m => m.set(key, value));
  }

  value() {
    return this._obj;
  }

}

export const isImmutable = (object) => {
  return object instanceof ImmutableWrapper;
};

const im = obj => new ImmutableWrapper(obj);

export default im;
