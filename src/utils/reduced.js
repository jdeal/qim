// There's not really any compatibility between `qim` and transducers, but since
// transducers already had a "reduced" concept, it seemed appropriate to use
// that convention.

// When looping through object or array values, `reduced` is used to tell the
// loop that the loop is finished.
const reduced = (value) => ({
  '@@transducer/reduced': true,
  '@@transducer/value': value
});

export default reduced;

export const isReduced = (value) =>
  value && !!value['@@transducer/reduced'];

// Unwrap a reduced value if necessary.
export const unreduced = (value) =>
  isReduced(value) ? value['@@transducer/value'] : value;
