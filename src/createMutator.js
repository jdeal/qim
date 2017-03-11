import objectAssign from 'object-assign';

class Mutator() {
  constructor(value) {
    if (!value || typeof value !== 'object') {
      throw new Error('mutator requires object value');
    }
    this._old = value;
    this._new = value;
  }
  set(key, value) {
    if (this._new[key] === value && key in this._new) {
      return;
    }
    if (Array.isArray(this._new)) {
      this._new = this._new.slice(0);
    } else {
      this._new = objectAssign({}, this._new);
    }
    this._new[key] = value;
  }
  value() {
    return this._new;
  }
}
