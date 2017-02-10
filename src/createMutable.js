import objectAssign from 'object-assign';

function isInt(value) {
  var x;
  return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}

const setIn = (obj, path, value) => {
  var nextObj, pathIndex, pathSetIndex, key, nextKey, setKey;
  var subObj = obj;

  if (path == null || typeof path !== 'object' || typeof path.length !== 'number') {
    throw new TypeError('getIn requires array-like object for path');
  }

  if (!isMutable(obj)) {
    return obj;
  }

  for (pathIndex = 0; pathIndex < path.length - 1; pathIndex++) {
    key = path[pathIndex];
    nextObj = subObj.get(key);
    if (!isMutable(nextObj)) {
      nextKey = path[pathIndex + 1];
      if (isInt(nextKey)) {
        subObj.set(key, []);
      } else {
        subObj.set(key, {});
      }
      nextObj = subObj.get(key);
    }
    subObj = nextObj;
  }

  subObj.set(path[path.length - 1], value);

  return obj;
};

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

  setIn(path, value) {
    return setIn(this, path, value);
  }

  value() {
    return this._obj;
  }

}

export const isMutable = (object) => object instanceof Mutable;

const createMutable = (obj) => new Mutable(obj);

export default createMutable;
