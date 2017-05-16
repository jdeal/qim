import objectAssign from 'object-assign';

const copy = (object) => Array.isArray(object) ?
  object.slice(0) :
  objectAssign({}, object);

export default copy;
