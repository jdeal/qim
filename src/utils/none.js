class None {
  constructor() {
    this['@@qim/isNone'] = true;
  }
}

export default new None();

export const isNone = (value) =>
  value && value['@@qim/isNone'];
