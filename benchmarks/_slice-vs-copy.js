import _ from 'lodash';

const input = _.range(10)
  .reduce((string) => string.concat('abcdefghijklmnopqrstuvwxyz0123456789'), '')
  .split('');

export default [
  {
    name: 'slice',
    test: () => (
      input.slice(0)
    )
  },
  {
    name: 'copy',
    test: () => {
      const copy = [];
      for (let i = 0; i < input.length; i++) {
        copy.push(input[i]);
      }
      return copy;
    }
  }
];
