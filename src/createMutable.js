import objectAssign from 'object-assign';

class Mutable {

  constructor(obj, parent, key) {
    if (obj instanceof Mutable) {
      return obj;
    }
    this._orig = obj;
    this._obj = obj;
    this._isObject = obj && typeof obj === 'object';
    this._isArray = Array.isArray(obj);
    this._parent = parent;
    this._key = key;
    this._children = {};
    return this;
  }

  _detach() {
    this._parent = undefined;
    this._key = undefined;
  }

  get(key) {
    if (!this._isObject) {
      return undefined;
    }
    const child = this._obj[key];
    const isChildObject = child && typeof child === 'object';
    if (!isChildObject) {
      return child;
    }
    if (!this._children[key]) {
      this._children[key] = new Mutable(child, this, key);
    }
    return this._children[key];
  }

  set(key, value) {
    value = value instanceof Mutable ? value._obj : value;
    if (!this._isObject) {
      return this;
    }
    if (this._obj[key] === value) {
      return this;
    }
    if (this._obj === this._orig) {
      if (this._isArray) {
        this._obj = this._obj.slice(0);
      } else {
        this._obj = objectAssign({}, this._obj);
      }
    }
    this._obj[key] = value;
    if (this._parent) {
      this._parent.set(this._key, this._obj);
    }
    if (this._children[key]) {
      this._children[key]._detach();
      this._children[key] = undefined;
    }
    return this;
  }

  value() {
    return this._obj;
  }

}

export const isMutable = (object) => {
  return object instanceof Mutable;
};

const createMutable = obj => {
  return new Mutable(obj);
};

export default createMutable;
