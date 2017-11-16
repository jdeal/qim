import {selectKey} from './$traverse';
import {pathKey} from './$nav';
import arrayify from './utils/arrayify';
import {$setKey} from './$set';
import {$defaultKey} from './$default';
import {$applyKey} from './$apply';
import {$lensKey} from './$lens';
import {$setContextKey} from './$setContext';
import {isReduced} from './utils/reduced';
import {
  $none, $noneKey, undefinedIfNone, isNone,
  wrap, getPropertyUnsafe, hasPropertyUnsafe, getSpec
} from './utils/data';

import unwrapMacro from './macros/unwrap.macro';

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
  context // current context: modified with setContext and passed to transforms
) => {

  if (pathIndex >= path.length) {
    // If we're in a sub-query (with $nav), we need to return.
    if (returnFn) {
      return returnFn(object, context);
    }
    // Default to identity if there's no result function.
    return resultFn ? resultFn(state, unwrapMacro(object)) : object;
  }

  const nav = path[pathIndex];

  // null/undefined selects/updates nothing.
  if (nav == null) {
    return navKey === selectKey ? $none : unwrapMacro(object);
  }

  // Primitives are handled right here inside traverseEach to stay efficient.
  if (typeof nav === 'string' || typeof nav === 'number' || typeof nav === 'boolean') {
    // select, which is pretty simple
    if (navKey === selectKey) {
      // If we have something with properties, grab the property and keep digging.
      if (object != null) {
        const subObject = getPropertyUnsafe(nav, object);
        // Special case so `has` can differentiate between missing keys and keys
        // pointing to undefined values. Maybe a better way? Maybe just don't
        // worry about `has(['x'], {x: undefined}) === false`?
        if (typeof subObject === 'undefined' && !hasPropertyUnsafe(nav, object) && pathIndex === path.length - 1) {
          return $none;
        }
        return traverseEach(navKey, state, resultFn, path, subObject, pathIndex + 1, returnFn, context);
      } else {
        return $none;
      }
    }
    // update, which is not as simple
    const spec = getSpec(object);
    if (!spec.isNil) {
      const _get = spec.get;
      const value = _get(nav, object);
      // Dig in for the new value.
      const newValue = unwrapMacro(traverseEach(navKey, state, resultFn, path, value, pathIndex + 1, returnFn, context));
      const _set = spec.set;
      return _set(nav, newValue, object);
    // If we got back null/undefined, then intelligently create a new object.
    // It's debatable on whether or not this is a good idea. Integers used to
    // auto-create arrays, but that's probably wrong more than right. An
    // integer like 123456 is probably an id and not an array index, so it's
    // probably a mistake to create an array of that size. If an array is
    // actually wanted, `default([])` can be added. We could do nothing, which
    // would keep you from making typos, but then you have to add a lot of
    // `default({})`, and then you're right back to being able to make typos.
    // So defaulting to create an object seems like a sane balance.
    }
    const newValue = unwrapMacro(traverseEach(navKey, state, resultFn, path, undefined, pathIndex + 1, returnFn, context));
    // Trying to set a key to $none is a no-op.
    if (isNone(newValue)) {
      return object;
    }
    const newObject = {};
    newObject[nav] = newValue;
    return newObject;
  }

  // Predicate navigator, keep going if there's a match.
  if (typeof nav === 'function') {
    if (nav(unwrapMacro(object))) {
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    } else {
      return navKey === selectKey ? $none : unwrapMacro(object);
    }
  }

  // Some built-in navigators for transform and context.
  switch (nav['@@qim/nav']) {
    // Transform the current value into another value.
    case $applyKey: {
      return traverseEach(navKey, state, resultFn, path, nav.fn(unwrapMacro(object), context), pathIndex + 1, returnFn, context);
    }
    // Transform the current value into another value.
    // For updates, apply another transform on the way back.
    case $lensKey: {
      const unwrapped = unwrapMacro(object);
      const result = unwrapMacro(traverseEach(navKey, state, resultFn, path, nav.fn(unwrapped, context), pathIndex + 1, returnFn, context));
      if (navKey === selectKey || !nav.fromFn) {
        return result;
      }
      return nav.fromFn(result, unwrapped, context);
    }
    // Set the current value to a new constant value.
    case $setKey:
      return traverseEach(navKey, state, resultFn, path, nav.value, pathIndex + 1, returnFn, context);
    // Set the current value to a new constant value if the current value is
    // undefined.
    case $defaultKey: {
      if (typeof object === 'undefined') {
        return traverseEach(navKey, state, resultFn, path, nav.value, pathIndex + 1, returnFn, context);
      }
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    }
    // Remove the current value.
    case $noneKey:
      return $none;
    // Set a context value, to later be used by $apply.
    case $setContextKey: {
      context = nav.setContext(nav, nav.fn(unwrapMacro(object), context || {}), context);
      return traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
    }
  }

  let navPath = nav[pathKey];

  // TODO: Combine this with array navigator.
  // Path navigators.
  if (navPath) {
    // A path navigator can potentially go down multiple paths.
    const moreNavPaths = nav.moreNavPaths;
    let moreNavPathsIndex = 0;
    let navResult = object;
    do {
      // If it's a function, get our path dynamically.
      if (typeof navPath === 'function') {
        navPath = nav.hasArgs ? navPath(nav.args, unwrapMacro(object), context) : navPath(object, context);
        navPath = arrayify(navPath);
      }
      // TODO: Use mutationMarker.
      // An empty query just means continue.s
      if (navPath.length === 0) {
        navResult = traverseEach(navKey, state, resultFn, path, object, pathIndex + 1, returnFn, context);
      // Otherwise, recurse in with our new query, but pass a `returnFn` so we can
      // continue where we left off.
      } else {
        navResult = traverseEach(navKey,
          state, resultFn, navPath, object, 0,
          (_object, _context) => traverseEach(navKey, state, resultFn, path, _object, pathIndex + 1, returnFn, _context),
          context
        );
      }
      if (moreNavPaths) {
        // Selects should be applied to the same object, since nothing has changed. If we've reduced, then we're done.
        if (navKey === selectKey) {
          if (isReduced(navResult)) {
            return navResult;
          }
        // Updates should be applied to the new object.
        } else {
          object = undefinedIfNone(navResult);
        }
        navPath = moreNavPaths[moreNavPathsIndex];
        moreNavPathsIndex++;
      } else {
        navPath = undefined;
      }
    } while (navPath);
    return navResult;
  }

  // Core select/update navigator.
  if (nav[navKey]) {
    if (nav.hasArgs) {
      return nav[navKey](
        nav.args, unwrapMacro(object),
        (subObject) => unwrapMacro(traverseEach(navKey, state, resultFn, path, subObject, pathIndex + 1, returnFn, context))
      );
    }
    return nav[navKey](
      unwrapMacro(object),
      (subObject) => unwrapMacro(traverseEach(navKey, state, resultFn, path, subObject, pathIndex + 1, returnFn, context))
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
    const nestedResult = undefinedIfNone(
      traverseEach(navKey, state, resultFn, nav, wrap(object), 0, undefined, context)
    );
    return traverseEach(navKey, state, resultFn, path, nestedResult, pathIndex + 1, returnFn, context);
  }

  throw new Error(`Invalid navigator ${nav} at path index ${pathIndex}.`);
};
