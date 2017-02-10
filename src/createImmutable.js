import get from './methods/get';
import set from './methods/set';
import getIn from './methods/getIn';
import setIn from './methods/setIn';

class Immutable {

  constructor(obj) {
    this._obj = obj;
  }

  get(key, defaultValue) {
    return new Immutable(get(this._obj, key, defaultValue));
  }

  set(key, value) {
    const obj = set(this._obj, key, value);
    if (obj === this._obj) {
      return this;
    }
    return new Immutable(obj);
  }

  getIn(path, defaultValue) {
    return new Immutable(getIn(this._obj, path, defaultValue));
  }

  setIn(path, value) {
    const obj = setIn(this._obj, path, value);
    if (obj === this._obj) {
      return this;
    }
    return new Immutable(obj);
  }

  value() {
    return this._obj;
  }

}

export const isImmutable = (object) => object instanceof Immutable;

const createImmutable = (obj) => new Immutable(obj);

export default createImmutable;
