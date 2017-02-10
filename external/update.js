import sprout from 'sprout-data';
import _ from 'lodash';

/**
 Walk a spec and pull out the commands and paths.
*/
const pathCommands = (spec, path = [], collector = []) => {
  if (typeof spec === 'object') {
    for (let k in spec) {
      if (spec.hasOwnProperty(k)) {
        let v = spec[k];
        let newPath = path.slice();
        if (typeof k === 'string' && k.indexOf('$') === 0) {
          collector.push([k, newPath, v]); // do not recurse further
        } else {
          newPath.push(k);
          pathCommands(v, newPath, collector);
        }
      }
    }
  }
  // does not handle arrays
  return collector;
};

const confirmArray = (item, command) => {
  if (Object.prototype.toString.call(item) !== '[object Array]') {
    throw new Error(`${command} command needs array argument!`);
  }
};

const confirmObject = (item, command) => {
  if (typeof item !== 'object') {
    throw new Error(`${command} command needs object argument!`);
  }
};

const confirmFunction = (item, command) => {
  if (typeof item !== 'function') {
    throw new Error(`${command} command needs function argument!`);
  }
};

// powered by sprout! but we can swap this out - no biggie
const immutatators = {
  $push: (value, path, item) => {
    confirmArray(item, '$push');

    return immutatators.$apply(value, path, (old) => {
      confirmArray(old, '$push');

      return old.concat(item);
    });
  },

  // remove all occurrances of item from an array
  $remove: (value, path, item) => {
    return immutatators.$apply(value, path, (old) => {
      confirmArray(old, '$remove');

      // create a copy of the array without any occurances of the item
      let neu = [];
      for (let i = 0; i < old.length; i++){
        if (old[i] !== item){
          neu.push(old[i]);
        }
      }

      return neu;
    });
  },

  $unshift: (value, path, item) => {
    confirmArray(item, '$unshift');

    return immutatators.$apply(value, path, (old) => {
      confirmArray(old, '$unshift');

      let neu = old.slice();
      Array.prototype.unshift.apply(neu, item);
      return neu;
    });
  },

  $splice: (value, path, item) => {
    confirmArray(item, '$splice');

    return immutatators.$apply(value, path, (old) => {
      confirmArray(old, '$splice');

      let neu = old.slice();
      Array.prototype.splice.apply(neu, item[0]);
      return neu;
    });
  },

  $set: (value, path, item) => {
    // could deep equal so we can retain even more structural sharing...
    // if (_.isEqual(sprout.get(value, path), item)) {
    //   return value;
    // }
    return sprout.assoc(value, path, item);
  },

  $delete: (value, path, item) => {
    if (typeof sprout.get(value, path) !== 'object'){
      return value;
    }
    return sprout.dissoc(value, path.concat([item]));
  },

  $merge: (value, path, item) => {
    confirmObject(item, '$push');

    for (let k in item) {
      if (item.hasOwnProperty(k)) {
        let v = item[k];
        let newPath = path.concat([k]);
        value = immutatators.$set(value, newPath, v);
      }
    }
    return value;
  },

  $apply: (value, path, item) => {

    confirmFunction(item, '$apply');

    return sprout.update(value, path, item);
  }
};

/**
A reimplmentation of React's update that does a few things:
  1. Ignores changes when the value matches via ===.
  2. Creates missing paths.
  3. Non-command terminating trees are deep merged.
*/
const fakeRoot = 'ROOT';
export const update = (value, spec) => {
  let outValue = {[fakeRoot]: value}; // wrap
  spec = {[fakeRoot]: spec};
  let noCommandSpec = spec;
  let emptyValue;
  if (_.isObject(value)){
    emptyValue = {};
  } else if (_.isArray(value)) {
    emptyValue = [];
  }

  let specCommands = pathCommands(spec);
  specCommands.forEach(([command, path, item]) => {
    let immutatator = immutatators[command];
    if (typeof immutatator !== 'function') {
      throw new Error(`${command} command is unrecognized!`);
    }
    outValue = immutatator(outValue, path, item);
    noCommandSpec = sprout.dissoc(noCommandSpec, path);
  });

  if (Object.keys(noCommandSpec).length !== 0) {
    outValue = sprout.deepMerge(outValue, noCommandSpec);
  }

  return outValue[fakeRoot] || emptyValue; // unwrap or return an empty value for the value type provided
};

export default update;
