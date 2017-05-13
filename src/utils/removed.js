// When an item is removed from an array or object, `removed` is used to mark
// it as being removed. This is useful, for example, so that we can remove an
// item inside a loop without affecting the affecting the item count. We could
// use $none for this, but `removed` specifically exists to allow you to store
// $none in an array/object and still have `qim` work correctly. So what if you
// want to store `removed` in your array/object? That's just silly. :-P
const removed = {
  '@@qim/removed': true
};

export default removed;

export const isRemoved = (value) =>
  value && value['@@qim/removed'];

export const isNotRemoved = (value) =>
  !value || !value['@@qim/removed'];
