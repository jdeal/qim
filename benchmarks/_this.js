const setFoo_this = function () {
  this.foo = 'bar';
  return this.foo;
};

const setFoo_param = function (thing) {
  thing.foo = 'bar';
  return thing.foo;
};

class Thing {
  constructor() {
    this.foo = '';
  }
}

const thing = new Thing();

export default [
  {
    name: 'fn.apply(this)',
    test: () => (
      setFoo_this.apply(thing)
    )
  },
  {
    name: 'fn(param)',
    test: () => (
      setFoo_param(thing)
    )
  }
];
