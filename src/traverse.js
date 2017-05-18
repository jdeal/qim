import objectAssign from 'object-assign';

import copy from './utils/copy';
import {selectKey} from './$traverse';
import {pathKey} from './$nav';
import arrayify from './utils/arrayify';
import {$setKey} from './$set';
import {$defaultKey} from './$default';
import {$applyKey} from './$apply';
import {$setContextKey} from './$setContext';
import $none, {$noneKey, undefinedIfNone, isNone} from './$none';

// `traverseEach` is the heart of `qim`. It's a little ugly because it needs to
// be performant, and it's generic across select and update.
export const traverseEach = (
  navKey, // select or update?
  state, // state to carry around, so select can add new values
  resultFn, // like a reduce function, called for each selected value
  path, // the whole query
  object, // the current object that we're traversing
  pathIndex, // index into the path
  returnFn, // function to "return" to, if we've navigated into a sub-query
  context, // current context: modified with setContext and passed to transforms
  mutationMarker // performance signal that it's safe to mutate instead of clone
) => {

  if (pathIndex >= path.length) {
    // If we're in a sub-query (with $nav), we need to return.
    if (returnFn) {
      return returnFn(object, context);
    }
    // Default to identity if there's no result function.
    return resultFn ? resultFn(state, object) : object;
  }

  const nav = path[pathIndex];

  // null/undefined selects/updates nothing.
  if (nav == null) {
    return navKey === selectKey ? $none : object;
  }

  // Primitives are handled right her inside traverseEach to state efficient.
  if (typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
    // select, which is pretty simple
    if (navKey === selectKey) {
      // If we have an object, just grab the nested object and keep digging.
      if (object && typeof object === 'object') {
        const subObject = object[nav];
        // Special case so `has` can differentiate between missing keys and keys
        // pointing to undefined values. Maybe a better way? Maybe just don't
        // worry about `has(['x'], {x: undefined}) === false`?
        if (typeof subObject === 'undefined' && !(nav in object) && pathIndex === path.length - 1) {
          return $none;
        }
        return traverseEach(navKey, state, resultFn, path, subObject, pathIndex + 1, returnFn, context);
      } else {
        return $none;
      }
    }
    // update, which is not as simple
    if (object && typeof object === 'object') {
      const value = object[nav];
      // Dig in for the new value.
      const newValue = traverseEach(navKey, state, resultFn, path, value, pathIndex + 1, returnFn, context);
      // A new value of $none means we've removed it.
      if (isNone(newValue)) {
        if (!(nav in object)) {
          return object;
        }
        if (Array.isArray(object)) {
          const newObject = object.slice(0);
          // Could have a silly edge here where nav was a property and not an
          // index, which means it disappears. If it's still here, that means
          // it's an index.
          if (nav in object) {
            newObject.splice(nav, 1);
          }
          return newObject;
        }
        const newObject = objectAssign({}, object);
        delete newObject[nav];
        return newObject;
      }
      // If we got back the same value, it's a no-op.
      if (value === newValue) {
        return object;
      }
      // Some dangerous mutation going on here! Be careful!
      if (mutationMarker) {
        // If we have a mutation marker, and we've already mutated, then we can
        // safely mutate and avoid the cost of re-cloning the object.
        if (mutationMarker.hasMutated) {
          object[nav] = newValue;
          return object;
        // Otherwise, we're going to mutate, so mark that we've mutated.
        } else {
          mutationMarker.hasMutated = true;
        }
      }
      // Clone our object and set the property to the new value.
      const newObject = copy(object);
      newObject[nav] = newValue;
      return newObject;
    // If we got back null/undefined, then intelligently create a new object.
    // It's debatable on whether or not this is a good idea. Integers used to
    // auto-create arrays, but that's probably wrong more than right. An
    // integer like 123456 is probably an id and not an array index, so it's
    // probably a mistake to create an array of that size. If an array is
    // actually wanted, `default([])` can be added. We could do nothing, which
    // would keep you from making typos, but then you have to add a lot of
    // `default({})`, and then you're right back to being able to make typos.
    // So defaulting to create an object seems like a sane balance.
    } else if (object == null) {
      const newValue = traverseEach(navKey, state, resultFn, path, undefined, pathIndex + 1, returnFn, context);
      const newObject = {};
      newObject[nav] = newValue;
      return newObject;
    } else {
      throw new Error(`Cannot update property ${nav} (at path index ${pathIndex}) for non-object.`);
    }
  }

  // Predicate navigator, keep going if there's a match.
  if (typeof nav === 'function') {
    if (nav(object)) {
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    } else {
      return navKey === selectKey ? $none : object;
    }
  }

  // Some built-in navigators for transform and context.
  switch (nav['@@qim/nav']) {
    // Transform the current value into another value.
    case $applyKey: {
      return traverseEach(navKey, state, resultFn, path, nav.data(object, context), pathIndex + 1, returnFn, context);
    }
    // Set the current value to a new constant value.
    case $setKey:
      return traverseEach(navKey, state, resultFn, path, nav.data, pathIndex + 1, returnFn, context);
    // Set the current value to a new constant value if the current value is
    // undefined.
    case $defaultKey: {
      if (typeof object === 'undefined') {
        return traverseEach(navKey, state, resultFn, path, nav.data, pathIndex + 1, returnFn, context);
      }
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    }
    // Remove the current value.
    case $noneKey:
      return $none;
    // Set a context value, to later be used by $apply.
    case $setContextKey: {
      context = nav.setContext(nav, nav.fn(object, context || {}), context);
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    }
  }

  let navPath = nav[pathKey];

  // Path navigators.
  if (navPath) {
    // If it's a function, get our path dynamically.
    if (typeof navPath === 'function') {
      navPath = nav.hasArgs ? navPath(nav.args, object, nav.self) : navPath(object, nav);
      navPath = arrayify(navPath);
    }
    // An empty query just means continue.
    if (navPath.length === 0) {
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    }
    // Otherwise, recurse in with our new query, but pass a `returnFn` so we can
    // continue where we left off.
    return traverseEach(navKey,
      state, resultFn, navPath, object, 0,
      (_object, _context) => traverseEach(navKey, state, resultFn, path, _object, pathIndex + 1, returnFn, _context),
      context
    );
  }

  // Core select/update navigator.
  if (nav[navKey]) {
    if (nav.hasArgs) {
      return nav[navKey](
        nav.args, object,
        (subObject) => traverseEach(navKey, state, resultFn, path, subObject, pathIndex + 1, returnFn, context),
        path, pathIndex
      );
    }
    return nav[navKey](
      object,
      (subObject) => traverseEach(navKey, state, resultFn, path, subObject, pathIndex + 1, returnFn, context),
      path, pathIndex
    );
  }

  // Nested sub-query.
  if (Array.isArray(nav)) {
    // A nested select will branch off an add items to the current select state.
    // So it's semantically a bit different than a nested update sub-query.
    if (navKey === selectKey) {
      const subResult = traverseEach(navKey, state, resultFn, nav, object, 0, returnFn, context);
      if (pathIndex + 1 === path.length) {
        return subResult;
      }
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    }

    // A nested update will branch off and mutate the object and then return to
    // the current object. It's kind of just a fancy $apply.
    // Create a mutation marker so we can efficiently apply many sub-queries to
    // the current object.
    mutationMarker = mutationMarker || {
      hasMutated: false
    };
    const nestedResult = undefinedIfNone(
      traverseEach(navKey, state, resultFn, nav, object, 0, undefined, context, mutationMarker)
    );
    return traverseEach(navKey, state, resultFn, path, nestedResult, pathIndex + 1, returnFn, context, mutationMarker);
  }

  throw new Error(`Invalid navigator ${nav} at path index ${pathIndex}.`);
};
