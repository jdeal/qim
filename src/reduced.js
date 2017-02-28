export class Reduced {
  constructor(value) {
    this.value = value;
    // this['@@transducer/reduced'] = true;
    // this['@@transducer/value'] = value;
  }
}

const reduced = (value) => {
  return new Reduced(value);
};

export default reduced;

export const isReduced = (value) =>
  value instanceof Reduced || (value && value['@@transducer/reduced']);

export const unreduced = (value) =>
  isReduced(value) ? value['@@transducer/value'] : value;
