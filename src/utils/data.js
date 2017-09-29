import objectAssign from 'object-assign';

import normalizeIndex from './normalizeIndex';

const isInteger = value => {
  if (isNaN(value)) {
    return !1;
  } else {
    let x = parseFloat(value);
    return (0 | x) === x;
  }
};

const eachFlattenedKey = (fn, keys, object) => {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (Array.isArray(key)) {
      for (let j = 0; j < key.length; j++) {
        const subKey = key[j];
        if (subKey in object) {
          fn(subKey);
        }
      }
    } else {
      if (key in object) {
        fn(key);
      }
    }
  }
};

const wrapKey = '@@qim/wrap';

export const isWrappedUnsafe = (source) => typeof source[wrapKey] === 'undefined' ?
  false :
  true;

export const isWrapped = (source) => source == null || typeof source[wrapKey] === 'undefined' ?
  false :
  true;

let Wrapper;

export const wrap = (source) => isWrapped(source) ?
  source :
  new Wrapper(source);

export const unwrap = (wrapped) => isWrapped(wrapped) ?
  wrapped.value() :
  wrapped;

const replaceSliceOfArray = (begin, end, newSlice, source) => {
  const sliceBegin = normalizeIndex(begin, source.length, 0);
  const sliceEnd = normalizeIndex(end, source.length, source.length);
  newSlice = unwrap(newSlice);
  newSlice = newSlice === undefined ? [] : newSlice;
  const newArray = [];
  for (let i = 0; i < sliceBegin; i++) {
    newArray.push(source[i]);
  }
  newSlice = [].concat(newSlice);
  for (let i = 0; i < newSlice.length; i++) {
    newArray.push(newSlice[i]);
  }
  for (let i = sliceEnd; i < source.length; i++) {
    newArray.push(source[i]);
  }
  return newArray;
};

Wrapper = function (source) {
  this['@@qim/wrap'] = true;
  this._type = undefined;
  this._source = source;
  this._hasMutated = false;
};

const PRIMITIVE_TYPE = 0;
const OBJECT_TYPE = 1;
const ARRAY_TYPE = 2;
const STRING_TYPE = 3;

const baseMethods = {
  type() {
    return this._type;
  },
  has(key) {
    return key in this._source;
  },
  get(key) {
    return this._source[key];
  },
  value() {
    return this._source;
  }
};

const methods = [];

const createMethods = (...moreMethods) => objectAssign({}, ...moreMethods);

methods[PRIMITIVE_TYPE] = createMethods(baseMethods, {
  has() {
    return false;
  },
  get() {
    return undefined;
  },
  set() {
    return this;
  },
  sliceToValue() {
    return undefined;
  },
  pickToValue() {
    return undefined;
  }
});

methods[OBJECT_TYPE] = createMethods(baseMethods, {
  set(key, value) {
    if (!this._hasMutated) {
      const source = this._source;
      if (source[key] === value && key in source) {
        return this;
      }
      this._source = objectAssign(source.constructor(), source);
      this._hasMutated = true;
    }
    this._source[key] = value;
    return this;
  },
  sliceToValue(begin, end) {
    return Object.keys(this._source).slice(begin, end).reduce((result, key) => {
      result[key] = this._source[key];
      return result;
    }, {});
  },
  pickToValue(keys) {
    const picked = {};
    eachFlattenedKey((key) => {
      picked[key] = this._source[key];
    }, keys, this._source);
    return picked;
  }
});

methods[ARRAY_TYPE] = createMethods(baseMethods, {
  set(key, value) {
    if (!this._hasMutated) {
      const source = this._source;
      if (source[key] === value && key in source) {
        return source;
      }
      this._source = source.slice(0);
      this._hasMutated = true;
    }
    this._source[key] = value;
    return this;
  },
  sliceToValue(begin, end) {
    return this._source.slice(begin, end);
  },
  pickToValue(keys) {
    const picked = [];
    eachFlattenedKey((key) => {
      picked.push(this._source[key]);
    }, keys, this._source);
    return picked;
  },
  replaceSlice(begin, end, newSlice) {
    return replaceSliceOfArray(begin, end, newSlice, this._source);
  }
});

methods[STRING_TYPE] = createMethods(baseMethods, {
  has(key) {
    if (isInteger(key)) {
      return this._source.charAt(key) !== '';
    }
    return false;
  },
  get(key) {
    if (isInteger(key)) {
      return this._source.charAt(key);
    }
    return undefined;
  },
  set(key, value) {
    if (isInteger(key)) {
      const source = this._source;
      if (source.charAt(key) === '') {
        return this;
      }
      if (typeof value === 'string') {
        this._source = source.substr(0, key) + value + source.substr(key + 1);
      }
    }
    return this;
  },
  sliceToValue(begin, end) {
    return this._source.substr(begin, end);
  },
  pickToValue(keys) {
    let picked = '';
    eachFlattenedKey((key) => {
      if (isInteger(key)) {
        picked += this._source[key] || '';
      }
    }, keys, this._source);
    return picked;
  }
});

const getType = (source) => {
  if (typeof source === 'object') {
    if (Array.isArray(source)) {
      return ARRAY_TYPE;
    }
    return OBJECT_TYPE;
  }
  if (typeof source === 'string') {
    return STRING_TYPE;
  }
  return PRIMITIVE_TYPE;
};

const setMethod = (wrapper, methodKey) => {
  if (wrapper._type === undefined) {
    wrapper._type = getType(wrapper._source);
  }
  wrapper[methodKey] = methods[wrapper._type][methodKey];
};

Wrapper.prototype = {
  type() {
    setMethod(this, 'type');
    return this._type;
  },
  value() {
    return this._source;
  },
  has(key) {
    setMethod(this, 'has');
    return this.has(key);
  },
  get(key) {
    setMethod(this, 'get');
    return this.get(key);
  },
  set(key, value) {
    setMethod(this, 'set');
    return this.set(key, value);
  },
  sliceToValue(begin, end) {
    setMethod(this, 'sliceToValue');
    return this.sliceToValue(begin, end);
  },
  replaceSlice(begin, end, newSlice) {
    setMethod(this, 'replaceSlice');
    return this.replaceSlice(begin, end, newSlice);
  },
  pickToValue(keys) {
    setMethod(this, 'pickToValue');
    return this.pickToValue(keys);
  }
};

const delegateMethods = {
  type() {
    if (isWrapped(this._source)) {
      this._type = this._source.type();
    }
    setMethod(this, 'type');
    return this._type;
  }
};

const SliceWrapper = function (source, begin, end) {
  this['@@qim/wrap'] = true;
  this._source = source;
  this._hasMutated = false;
  this._begin = begin;
  this._end = end;
};

export const wrapSlice = (source, begin, end) => new SliceWrapper(source, begin, end);

SliceWrapper.prototype = createMethods(delegateMethods, {
  value() {
    if (isWrapped(this._source)) {
      this._source = this._source.value();
    }
    setMethod(this, 'sliceToValue');
    this._source = this.sliceToValue(this._begin, this._end);
    setMethod(this, 'value');
    return this._source;
  },
});

const PickWrapper = function (source, properties) {
  this['@@qim/wrap'] = true;
  this._source = source;
  this._hasMutated = false;
  this._properties = properties;
};

export const wrapPick = (source, properties) => new PickWrapper(source, properties);

PickWrapper.prototype = createMethods(delegateMethods, {
  value() {
    if (isWrapped(this._source)) {
      this._source = this._source.value();
    }
    setMethod(this, 'pickToValue');
    this._source = this.pickToValue(this._properties);
    setMethod(this, 'value');
    return this._source;
  },
});

export const isNil = value => value == null;

export const hasProperty = (key, source) => {
  if (typeof source == 'object') {
    if (isWrappedUnsafe(source)) {
      return source.has(key);
    }
    return key in source;
  }
  if (typeof source === 'string') {
    if (isInteger(key)) {
      return source.charAt(key) !== '';
    }
  }
  return false;
};

export const getProperty = (key, source) => {
  if (typeof source === 'object') {
    if (isWrappedUnsafe(source)) {
      return source.get(key);
    }
    return source[key];
  }
  if (typeof source === 'string') {
    if (isInteger(key)) {
      return source.charAt(key);
    }
  }
  return undefined;
};

export const setProperty = (key, value, source) => {
  if (typeof source === 'object') {
    if (isWrappedUnsafe(source)) {
      return source.set(key, value);
    }
    if (source[key] === value && key in source) {
      return source;
    }
    if (Array.isArray(source)) {
      source = source.slice(0);
    } else {
      source = objectAssign({}, source);
    }
    source[key] = value;
    return source;
  }
  if (typeof source === 'string') {
    if (isInteger(key)) {
      if (source.charAt(key) !== '') {
        return source;
      }
      if (typeof value === 'string') {
        return source.substr(0, key) + value + source.substr(key + 1);
      }
    }
  }
  return source;
};

export const deleteProperty = (key, source) => {
  if (typeof source === 'object') {
    if (isWrappedUnsafe(source)) {
      return source.delete(key);
    }
    if (Array.isArray(source)) {
      if (!(key in source)) {
        return source;
      }
      source = source.slice(0);
      // Could have a silly edge here where nav was a property and not an
      // index, which means it disappears. If it's still here, that means
      // it's an index.
      if (key in source) {
        source.splice(key, 1);
      }
      return source;
    }
    if (!(key in source)) {
      return source;
    }
    source = objectAssign(source.constructor(), source);
    delete source[key];
    return source;
  }
  if (typeof source === 'string') {
    if (isInteger(key)) {
      if (source.charAt(key) === '') {
        return source;
      }
      return source.substr(0, key) + source.substr(key + 1);
    }
  }
  return source;
};

// TODO: isNone
export const replaceSlice = (begin, end, newSlice, source) => {
  if (typeof source === 'object') {
    if (isWrappedUnsafe(source)) {
      return source.replaceSlice(begin, end, newSlice);
    }
    if (Array.isArray(source)) {
      return replaceSliceOfArray(begin, end, newSlice, source);
    }
    newSlice = newSlice === undefined ? {} : newSlice;
    if (typeof newSlice !== 'object') {
      throw new Error('No way to splice a non-object into an object.');
    }
    const keys = Object.keys(source);
    const sliceBegin = normalizeIndex(begin, keys.length, 0);
    const sliceEnd = normalizeIndex(end, keys.length, keys.length);
    const newObject = {};
    for (let i = 0; i < sliceBegin; i++) {
      newObject[keys[i]] = source[keys[i]];
    }
    for (let i = sliceEnd; i < source.length; i++) {
      newObject[keys[i]] = source[keys[i]];
    }
    objectAssign(newObject, newSlice);
    return newObject;
  }
  if (typeof source === 'string') {
    const sliceBegin = normalizeIndex(begin, source.length, 0);
    const sliceEnd = normalizeIndex(end, source.length, source.length);
    return source.substr(0, sliceBegin) + newSlice + source.substr(sliceEnd);
  }
  return source;
};

// TODO: isNone
export const replacePick = (properties, newPick, source) => {
  if (typeof source === 'object') {
    if (isWrappedUnsafe(source)) {
      return source.replacePick(properties, newPick, source);
    }
    if (Array.isArray(source)) {
      newPick = newPick === undefined ? [] : newPick;
      const newArray = [];
      return newArray;
    }
    newPick = unwrap(newPick);
    newPick = newPick === undefined ? {} : newPick;
    const newObject = {...source};
    eachFlattenedKey((key) => {
      delete newObject[key];
    }, properties, source);
    objectAssign(newObject, newPick);
    return newObject;
  }
  if (typeof source === 'string') {
    // not implemented
  }
  return source;
};
