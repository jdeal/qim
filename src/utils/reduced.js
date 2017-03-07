const reduced = (value) => ({
  '@@transducer/reduced': true,
  '@@transducer/value': value
});

export default reduced;

export const isReduced = (value) =>
  value && !!value['@@transducer/reduced'];

export const unreduced = (value) =>
  isReduced(value) ? value['@@transducer/value'] : value;
