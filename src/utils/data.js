// TODO: clean up _hasMutated

import objectAssign from './objectAssign';

import { isReduced } from './reduced';
import getTypeErrorMessage from './getTypeErrorMessage';
import normalizeIndex, { normalizeIndexIfValid } from './normalizeIndex';
import unwrapMacro from '../macros/unwrap.macro';
import isWrappedMacro from '../macros/isWrapped.macro';
import isWrappedUnsafeMacro from '../macros/isWrappedUnsafe.macro';

const hasSymbol = typeof Symbol !== 'undefined';

const iteratorKey = hasSymbol ? Symbol.iterator : '@@iterator';

const getAllProperties = object =>
  Object.keys(object).concat(
    iteratorKey === '@@iterator' ? [] : Object.getOwnPropertySymbols(object)
  );

const cloneEmptyObject = object =>
  Object.create((object.constructor && object.constructor.prototype) || null);

const isInteger = value => {
  if (isNaN(value)) {
    return !1;
  } else {
    let x = parseFloat(value);
    return (0 | x) === x;
  }
};

const falseFn = function() {
  return false;
};
const trueFn = function() {
  return true;
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

const removed = {};

const removeRemovedFromArray = array => {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      if (array[i] !== removed) {
        newArray.push(array[i]);
      }
    } else {
      newArray.length = newArray.length + 1;
    }
  }
  return newArray;
};

export const isWrappedUnsafe = source => isWrappedUnsafeMacro(source);

export const isWrapped = source => isWrappedMacro(source);

let Wrapper;

export const wrap = source =>
  isWrappedMacro(source) ? source : new Wrapper(source);

export const unwrap = wrapped => unwrapMacro(wrapped);

Wrapper = function(source, type) {
  this['@@qim/wrap'] = true;
  this._type = type;
  this._source = source;
  this._hasMutated = false;
};

const NONE_TYPE = 0;
const PRIMITIVE_TYPE = 1;
const OBJECT_TYPE = 2;
const ARRAY_TYPE = 3;
const STRING_TYPE = 4;

const hasUndefinedSource = wrapper => wrapper._source === undefined;

const hasNoneSource = wrapper => wrapper._type === NONE_TYPE;

const ObjectIterator = function(source) {
  this._source = source;
  this._keys = Object.keys(source);
  this._index = 0;
};

ObjectIterator.prototype = {
  next() {
    if (this._keys.length > this._index) {
      const key = this._keys[this._index];
      this._index++;
      return {
        value: [key, this._source[key]],
        done: false
      };
    }
    return {
      done: true
    };
  }
};

const IndexedIterator = function(source) {
  this._source = source;
  this._index = 0;
};

IndexedIterator.prototype = {
  next() {
    if (this._source.length > this._index) {
      const value = this._source[this._index];
      this._index++;
      return {
        value,
        done: false
      };
    }
    return {
      done: true
    };
  }
};

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
  set() {
    return this;
  },
  delete() {
    return this;
  },
  value() {
    return this._source;
  },
  append() {
    throw new Error(
      getTypeErrorMessage('append', ['appendable sequence'], this._source)
    );
  },
  canAppend: falseFn,
  merge(spec) {
    return wrap(spec);
  },
  isUndefined() {
    return this._source === undefined;
  },
  isNone: falseFn,
  [iteratorKey]() {
    return new ObjectIterator(this._source);
  },
  isSequence: falseFn,
  hasKeys: falseFn,
  isList: falseFn
};

[
  'getAtIndex',
  'setAtIndex',
  'count',
  'forEach',
  'toArray',
  'reduce',
  'mapPairs',
  'sliceToValue',
  'replaceSlice',
  'replacePick',
  'pickToValue',
  'cloneEmpty'
].forEach(methodName => {
  baseMethods[methodName] = function() {
    throw new Error(
      getTypeErrorMessage(methodName, ['sequence'], this._source)
    );
  };
});

const appendableMethods = {
  canAppend: trueFn
};

const nativeSequenceMethods = {
  getAtIndex(i) {
    if (i < 0) {
      i = normalizeIndexIfValid(i, this._source.length);
      if (i === undefined) {
        return undefined;
      }
    }
    return this._source[i];
  },
  count() {
    return this._source.length;
  },
  [iteratorKey]() {
    return new IndexedIterator(this._source);
  }
};

const sequenceMethods = {
  isSequence: trueFn,
  reduce(fn, initial) {
    let accum = initial;
    this.forEach((value, key) => {
      accum = fn(accum, value, key);
      if (isReduced(accum)) {
        return false;
      }
      return undefined;
    });
    return accum;
  },
  merge(spec, isDeep = false) {
    if (spec && typeof spec === 'object') {
      const wrappedSpec = wrap(spec);
      if (!wrappedSpec.isSequence() || wrappedSpec.type() === STRING_TYPE) {
        return wrappedSpec;
      }
      wrap(spec).forEach((value, key) => {
        if (!isDeep) {
          this.set(key, value);
          return;
        }
        const childValue = this.get(key);
        if (childValue && typeof childValue === 'object') {
          this.set(
            key,
            wrap(childValue)
              .merge(value, true)
              .value()
          );
          return;
        }
        this.set(key, value);
      });
      return this;
    }
    return spec;
  },
  toArray() {
    const array = [];
    this.forEach(value => {
      array.push(value);
    });
    return array;
  }
};

const methods = [];

const mix = (...moreMethods) => objectAssign({}, ...moreMethods);

export const $noneKey = '@@qim/$noneKey';

export const isNone = value => value && value['@@qim/nav'] === $noneKey;

export const undefinedIfNone = value => (isNone(value) ? undefined : value);

methods[NONE_TYPE] = mix(baseMethods, {
  has() {
    return undefined;
  },
  get() {
    return undefined;
  },
  isNone: trueFn
});

methods[PRIMITIVE_TYPE] = mix(baseMethods, {
  has() {
    return false;
  },
  get(key) {
    return this._source == null ? undefined : this._source[key];
  }
});

const deleteProperty_Object = (key, source) => {
  if (!(key in source)) {
    return source;
  }
  source = objectAssign(cloneEmptyObject(source), source);
  delete source[key];
  return source;
};

const setProperty_Object = (key, value, source) => {
  if (isNone(value)) {
    return deleteProperty_Object(key, source);
  }
  if (source[key] === value) {
    return source;
  }
  source = objectAssign(cloneEmptyObject(source), source);
  source[key] = value;
  return source;
};

methods[OBJECT_TYPE] = mix(baseMethods, sequenceMethods, {
  hasKeys: trueFn,
  count() {
    return Object.keys(this._source).length;
  },
  getAtIndex(i) {
    const keys = Object.keys(this._source);
    if (i < 0) {
      i = normalizeIndexIfValid(i, keys.length);
      if (i === undefined) {
        return undefined;
      }
    }
    return this._source[keys[i]];
  },
  delete(key) {
    if (!this._hasMutated) {
      const newSource = deleteProperty_Object(key, this._source);
      if (newSource !== this._source) {
        this._hasMutated = true;
      }
      this._source = newSource;
      return this;
    }
    delete this._source[key];
    return this;
  },
  set(key, value) {
    if (isNone(key)) {
      return this;
    }
    if (!this._hasMutated) {
      const newSource = setProperty_Object(key, value, this._source);
      if (newSource !== this._source) {
        this._hasMutated = true;
      }
      this._source = newSource;
      return this;
    }
    this._source[key] = value;
    return this;
  },
  setAtIndex(i, value) {
    const keys = Object.keys(this._source);
    i = normalizeIndexIfValid(i, keys.length);
    // TODO: throw error for invalid index
    if (i !== undefined) {
      return this.set(keys[i], value);
    }
    return this;
  },
  sliceToValue(begin, end) {
    const keys = Object.keys(this._source);
    return keys.slice(begin, end).reduce((result, key) => {
      result[key] = this._source[key];
      return result;
    }, {});
  },
  pickToValue(keys) {
    const picked = {};
    eachFlattenedKey(
      key => {
        picked[key] = this._source[key];
      },
      keys,
      this._source
    );
    return picked;
  },
  // TODO: order keys correctly with object slice
  replaceSlice(begin, end, newSlice) {
    const source = this._source;
    const keys = Object.keys(source);
    const sliceBegin = normalizeIndex(begin, keys.length, 0);
    const sliceEnd = normalizeIndex(end, keys.length, keys.length);
    newSlice = wrap(newSlice);
    if (isNone(newSlice)) {
      newSlice = wrap({});
    }
    if (!newSlice.isSequence()) {
      throw new Error('Unable to splice a non-sequence into an object.');
    }
    const newSource = {};
    for (let i = 0; i < sliceBegin; i++) {
      newSource[keys[i]] = source[keys[i]];
    }
    newSlice.forEach((value, key) => {
      newSource[key] = value;
    });
    for (let i = sliceEnd; i < keys.length; i++) {
      newSource[keys[i]] = source[keys[i]];
    }
    this._hasMutated = true;
    this._source = newSource;
    return this;
  },
  replacePick(properties, newPick) {
    const source = this._source;
    newPick = wrap(newPick);
    newPick =
      hasUndefinedSource(newPick) || hasNoneSource(newPick)
        ? wrap({})
        : newPick;
    if (!newPick.isSequence()) {
      throw new Error('Pick can only be replaced with a sequence.');
    }
    const newObject = objectAssign({}, source);
    eachFlattenedKey(
      key => {
        if (newPick.has(key)) {
          newObject[key] = newPick.get(key);
        } else {
          delete newObject[key];
        }
      },
      properties,
      source
    );
    newPick.forEach((value, key) => {
      newObject[key] = value;
    });
    this._source = newObject;
    return this;
  },
  cloneEmpty() {
    const empty = new Wrapper(cloneEmptyObject(this._source), OBJECT_TYPE);
    empty._hasMutated = true;
    return empty;
  },
  forEach(fn) {
    const source = this._source;
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        const shouldContinue = fn(source[key], key);
        if (shouldContinue === false) {
          break;
        }
      }
    }
  },
  mapPairs(fn) {
    const newObject = {};
    let hasMutated = false;
    this.forEach((value, key) => {
      const newPair = fn([key, value]);
      if (!isNone(newPair) && newPair != null) {
        const [newKey, newValue] = newPair;
        if (!isNone(newKey) && !isNone(newValue)) {
          newObject[newKey] = newValue;
          if (!hasMutated) {
            if (newKey === key && newValue === value) {
              return;
            }
          }
        }
      }
      hasMutated = true;
    });
    if (!hasMutated) {
      return wrap(this._source);
    }
    const wrapped = wrap(newObject);
    wrapped._hasMutated = true;
    wrapped._type = OBJECT_TYPE;
    return wrapped;
  }
});

const deleteProperty_Array = (key, source) => {
  if (!(key in source)) {
    return source;
  }
  source = source.slice(0);
  if (isInteger(key)) {
    source.splice(key, 1);
  } else {
    delete source[key];
  }
  return source;
};

const setProperty_Array = (key, value, source) => {
  if (isNone(value)) {
    return deleteProperty_Array(key, source);
  }
  if (source[key] === value) {
    return source;
  }
  source = source.slice(0);
  source[key] = value;
  return source;
};

methods[ARRAY_TYPE] = mix(
  baseMethods,
  sequenceMethods,
  appendableMethods,
  nativeSequenceMethods,
  {
    isList: trueFn,
    set(key, value) {
      if (isNone(key)) {
        return this;
      }
      if (!this._hasMutated) {
        const newSource = setProperty_Array(key, value, this._source);
        if (newSource !== this._source) {
          this._hasMutated = true;
        }
        this._source = newSource;
        return this;
      }
      if (isNone(value)) {
        if (isInteger(key)) {
          this._source.splice(key, 1);
        } else {
          delete this._source[key];
        }
        return this;
      }
      this._source[key] = value;
      return this;
    },
    setAtIndex(i, value) {
      if (i >= 0) {
        return this.set(i, value);
      } else if (this._source.length < -i) {
        this._source = Array(-i - this._source.length).concat(this._source);
        this._hasMutated = true;
      }
      i = normalizeIndexIfValid(i, this._source.length);
      if (i !== undefined) {
        return this.set(i, value);
      }
      return this;
    },
    delete(key) {
      if (!this._hasMutated) {
        const source = this._source;
        if (!(key in source)) {
          return this;
        }
        this._source = source.slice(0);
        this._hasMutated = true;
      }
      if (isInteger(key)) {
        this._source.splice(key, 1);
      } else {
        delete this._source[key];
      }
      return this;
    },
    sliceToValue(begin, end) {
      const source = this._source;
      return source.slice(begin, end);
    },
    pickToValue(keys) {
      const picked = [];
      eachFlattenedKey(
        key => {
          picked.push(this._source[key]);
        },
        keys,
        this._source
      );
      return picked;
    },
    replaceSlice(begin, end, newSlice) {
      const source = this._source;
      const sliceBegin = normalizeIndex(begin, source.length, 0);
      const sliceEnd = normalizeIndex(end, source.length, source.length);
      newSlice = wrap(newSlice);
      if (isNone(newSlice)) {
        newSlice = wrap([]);
      }
      newSlice = newSlice.isList() ? newSlice : wrap([newSlice.value()]);
      const newSource = [];
      for (let i = 0; i < sliceBegin; i++) {
        newSource.push(source[i]);
      }
      for (let i = 0; i < newSlice.count(); i++) {
        newSource.push(newSlice.getAtIndex(i));
      }
      for (let i = sliceEnd; i < source.length; i++) {
        newSource.push(source[i]);
      }
      if (newSource !== this._source) {
        this._hasMutated = true;
        this._source = newSource;
      }
      return this;
    },
    replacePick(properties, newPick) {
      const source = this._source;
      newPick = wrap(newPick);
      newPick =
        hasUndefinedSource(newPick) || hasNoneSource(newPick)
          ? wrap([])
          : newPick;
      newPick = newPick.isSequence() ? newPick : wrap([newPick.value()]);
      let newSource = this._source.slice(0);
      const iter = newPick[iteratorKey]();
      let curr = iter.next();
      let hasRemoved = false;
      eachFlattenedKey(
        key => {
          if (curr.done) {
            newSource[key] = removed;
            hasRemoved = true;
          } else {
            const value = newPick.hasKeys() ? curr.value[1] : curr.value;
            if (newSource[key] !== value) {
              newSource[key] = value;
              curr = iter.next();
            }
          }
        },
        properties,
        source
      );
      while (!curr.done) {
        newSource.push(curr.value);
        curr = iter.next();
      }
      if (hasRemoved) {
        newSource = removeRemovedFromArray(newSource);
      }
      this._source = newSource;
      return this;
    },
    cloneEmpty() {
      const empty = new Wrapper([], ARRAY_TYPE);
      empty._hasMutated = true;
      return empty;
    },
    forEach(fn) {
      const source = this._source;
      for (var i = 0; i < source.length; i++) {
        const shouldContinue = fn(source[i], i);
        if (shouldContinue === false) {
          break;
        }
      }
    },
    append(value) {
      if (isNone(value)) {
        return this;
      }
      if (!this._hasMutated) {
        this._source = this._source.slice(0);
        this._hasMutated = true;
      }
      this._source.push(value);
      return this;
    },
    mapPairs(fn) {
      let newArray = [];
      let hasMutated = false;
      let hasRemoved = false;
      let holes = null;
      const source = this._source;
      this.forEach((value, key) => {
        const newPair = fn([key, value]);
        let hasRemovedPair = true;
        if (!isNone(newPair) && newPair != null) {
          const [newKey, newValue] = newPair;
          if (!isNone(newKey) && !isNone(newValue)) {
            if (!(key in source)) {
              newArray.length = newArray.length + 1;
              if (!holes) {
                holes = {};
              }
              holes[newKey] = true;
            } else {
              newArray[newKey] = newValue;
            }
            if (newKey === key) {
              hasRemovedPair = false;
              if (!hasMutated) {
                if (newValue === value) {
                  return;
                }
              }
            } else if (key in newArray || (holes && key in holes)) {
              hasRemovedPair = false;
            }
          }
        }
        if (hasRemovedPair) {
          hasRemoved = true;
          newArray[key] = removed;
        }
        hasMutated = true;
      });
      if (!hasMutated) {
        return wrap(this._source);
      }
      if (hasRemoved) {
        newArray = removeRemovedFromArray(newArray);
      }
      const wrapped = wrap(newArray);
      wrapped._hasMutated = true;
      wrapped._type = ARRAY_TYPE;
      return wrapped;
    }
  }
);

// TODO: setting to blank outside of range should be no-op
const setAtIndex_String = (i, value, source) => {
  if (isNone(value)) {
    value = '';
  }
  if (i >= 0) {
    if (i >= source.length) {
      if (value === '') {
        return source;
      }
      source = source + Array(2 + (i - source.length)).join(' ');
    }
    return source.substr(0, i) + String(value) + source.substr(i + 1);
  } else if (source.length < -i) {
    if (value === '') {
      return source;
    }
    source = Array(1 + (-i - source.length)).join(' ') + source;
  }
  i = normalizeIndexIfValid(i, source.length);
  if (i !== undefined) {
    return source.substr(0, i) + String(value) + source.substr(i + 1);
  }
  return source;
};

const setProperty_String = (key, value, source) => {
  if (isNone(key)) {
    return source;
  }
  if (isInteger(key)) {
    return setAtIndex_String(key, value, source);
  }
  return source;
};

methods[STRING_TYPE] = mix(
  baseMethods,
  sequenceMethods,
  appendableMethods,
  nativeSequenceMethods,
  {
    has(key) {
      if (isInteger(key)) {
        if (key >= 0) {
          return this._source.length > key;
        }
      }
      return false;
    },
    set(key, value) {
      this._source = setProperty_String(key, value, this._source);
      return this;
    },
    setAtIndex(i, value) {
      this._source = setAtIndex_String(i, value, this._source);
      return this;
    },
    delete(key) {
      return this.set(key, '');
    },
    sliceToValue(begin, end) {
      const source = this._source;
      return source.slice(begin, end);
    },
    pickToValue(keys) {
      let picked = '';
      eachFlattenedKey(
        key => {
          if (isInteger(key)) {
            picked += this._source[key] || '';
          }
        },
        keys,
        this._source
      );
      return picked;
    },
    replaceSlice(begin, end, newSlice) {
      const source = this._source;
      const sliceBegin = normalizeIndex(begin, source.length, 0);
      const sliceEnd = normalizeIndex(end, source.length, source.length);
      newSlice = wrap(newSlice);
      if (isNone(newSlice)) {
        newSlice = wrap([]);
      }
      const newSliceString = newSlice.isList()
        ? newSlice.toArray().join('')
        : String(newSlice.value());
      this._source =
        source.slice(0, sliceBegin) + newSliceString + source.slice(sliceEnd);
      return this;
    },
    replacePick(begin, end, newPick) {
      this._source = wrap(this._source.split(''))
        .replacePick(begin, end, newPick)
        .value()
        .join('');
      return this;
    },
    cloneEmpty() {
      const empty = new Wrapper('', STRING_TYPE);
      empty._hasMutated = true;
      return empty;
    },
    forEach(fn) {
      const source = this._source;
      for (var i = 0; i < source.length; i++) {
        const shouldContinue = fn(source[i], i);
        if (shouldContinue === false) {
          break;
        }
      }
    },
    append(value) {
      this._source += value;
      return this;
    },
    mapPairs(fn) {
      const arrayWrapper = wrap(this._source.split(''));
      arrayWrapper._type = ARRAY_TYPE;
      const wrapper = wrap(
        arrayWrapper
          .mapPairs(fn)
          .value()
          .join('')
      );
      wrapper._type = STRING_TYPE;
      return wrapper;
    }
  },
  {
    merge: baseMethods.merge
  }
);

const getType = source => {
  if (source == null) {
    return PRIMITIVE_TYPE;
  }
  if (typeof source === 'object') {
    if (typeof source.length === 'number' && Array.isArray(source)) {
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

Wrapper.prototype = mix(
  getAllProperties(baseMethods).reduce((base, name) => {
    base[name] = function(a, b, c) {
      setMethod(this, name);
      return this[name](a, b, c);
    };
    return base;
  }, {}),
  {
    type() {
      setMethod(this, 'type');
      return this._type;
    },
    value() {
      return this._source;
    }
  }
);

export const $none = wrap(undefined);

$none._type = NONE_TYPE;
$none._source = $none;

$none['@@qim/nav'] = $noneKey;

const prepareDelegateSource = wrapper => {
  if (wrapper._isPrepared) {
    return false;
  }
  wrapper._isPrepared = true;
  wrapper._source = wrap(wrapper._source);
  return true;
};

const delegateMethods = mix(
  getAllProperties(baseMethods).reduce((base, name) => {
    base[name] = function(a, b, c) {
      this.value();
      setMethod(this, name);
      return this[name](a, b, c);
    };
    return base;
  }, {}),
  {
    type() {
      if (isWrappedMacro(this._source)) {
        this._type = this._source.type();
      }
      setMethod(this, 'type');
      return this._type;
    }
  }
);

const SliceWrapper = function(source, begin, end) {
  this['@@qim/wrap'] = true;
  this._source = source;
  this._hasMutated = false;
  this._begin = begin;
  this._end = end;
};

export const wrapSlice = (source, begin, end) =>
  new SliceWrapper(source, begin, end);

const prepareSliceWrapper = wrapper => {
  if (prepareDelegateSource(wrapper)) {
    const sourceCount = wrapper._source.count();
    wrapper._begin = normalizeIndex(wrapper._begin, sourceCount, 0);
    wrapper._end = normalizeIndex(wrapper._end, sourceCount, sourceCount);
  }
};

SliceWrapper.prototype = mix(delegateMethods, {
  count() {
    if (this._isResolved) {
      setMethod(this, 'count');
      return this.count();
    }
    prepareSliceWrapper(this);
    return this._end - this._begin;
  },
  getAtIndex(i) {
    if (this._isResolved) {
      setMethod(this, 'getAtIndex');
      return this.getAtIndex();
    }
    prepareSliceWrapper(this);
    const position = this._begin + i;
    if (position < this._end) {
      return this._source.getAtIndex(position);
    }
    return undefined;
  },
  value() {
    if (isWrappedMacro(this._source)) {
      this._source = this._source.value();
    }
    setMethod(this, 'sliceToValue');
    this._source = this.sliceToValue(this._begin, this._end);
    setMethod(this, 'value');
    this._isResolved = true;
    return this._source;
  }
});

const PickWrapper = function(source, properties) {
  this['@@qim/wrap'] = true;
  this._source = source;
  this._hasMutated = false;
  this._properties = properties;
};

export const wrapPick = (source, properties) =>
  new PickWrapper(source, properties);

PickWrapper.prototype = mix(delegateMethods, {
  value() {
    if (isWrappedMacro(this._source)) {
      this._source = this._source.value();
    }
    setMethod(this, 'pickToValue');
    this._source = this.pickToValue(this._properties);
    setMethod(this, 'value');
    return this._source;
  }
});

export const hasPropertyUnsafe = (key, source) => {
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

const getProperty_Wrapper = (key, source) => source.get(key);

const getProperty_Object = (key, source) => source[key];

const getProperty_Array = getProperty_Object;

const getProperty_String = getProperty_Object;

const getProperty_Primitive = () => undefined;

export const getPropertyUnsafe = (key, source) => {
  if (isWrappedUnsafe(source)) {
    return source.get(key);
  }
  return source[key];
};

const deleteProperty_Wrapper = (key, source) => source.delete(key);

const deleteProperty_String = (key, source) =>
  setProperty_String(key, '', source);

const deleteProperty_Primitive = (key, value, source) => source;

const setProperty_Wrapper = (key, value, source) => source.set(key, value);

const setProperty_Primitive = (key, value, source) => source;

const baseSpec = {
  isNil: false
};

const wrapperSpec = mix(baseSpec, {
  get: getProperty_Wrapper,
  set: setProperty_Wrapper,
  delete: deleteProperty_Wrapper
});

const objectSpec = mix(baseSpec, {
  get: getProperty_Object,
  set: setProperty_Object,
  delete: deleteProperty_Object
});

const arraySpec = mix(baseSpec, {
  get: getProperty_Array,
  set: setProperty_Array,
  delete: deleteProperty_Array
});

const stringSpec = mix(baseSpec, {
  get: getProperty_String,
  set: setProperty_String,
  delete: deleteProperty_String
});

const primitiveSpec = mix(baseSpec, {
  get: getProperty_Primitive,
  set: setProperty_Primitive,
  delete: deleteProperty_Primitive
});

const nilSpec = mix(baseSpec, primitiveSpec, {
  isNil: true
});

export const getSpec = source => {
  if (source == null) {
    return nilSpec;
  }
  if (typeof source === 'object') {
    if (isWrappedUnsafeMacro(source)) {
      return wrapperSpec;
    }
    if (typeof source.length !== 'number') {
      return objectSpec;
    }
    if (Array.isArray(source)) {
      return arraySpec;
    }
    return objectSpec;
  }
  if (typeof source === 'string') {
    return stringSpec;
  }
  return primitiveSpec;
};

export const objectReaderSpec = {
  get: getProperty_Object
};

export const getReaderSpec = source => {
  if (source == null) {
    return nilSpec;
  }
  if (isWrappedUnsafeMacro(source)) {
    return wrapperSpec;
  }
  return objectReaderSpec;
};
