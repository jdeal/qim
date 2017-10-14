import _ from 'lodash';

const input = _.range(10)
  .reduce((string) => string.concat('abcdefghijklmnopqrstuvwxyz0123456789'), '')
  .split('');

const halfSize = input.length / 2;

export default [
  {
    name: 'slice',
    test: () => {
      const copy = input.slice(0);
      for (let i = 0; i < input.length; i++) {
        copy[i] = input[i];
      }
      copy.length = halfSize;
      return copy;
    }
  },
  {
    name: 'copy',
    test: () => {
      const copy = [];
      for (let i = 0; i < input.length; i++) {
        if (i < halfSize) {
          copy.push(input[i]);
        }
      }
      return copy;
    }
  }
];
