import traverse from './src/traverse';
import {isNone} from './src/none';

const obj = {x: 1, y: 2};

for (let key of obj) {
  console.log(key);
}

const result = traverse(['x', 'y', value => value % 2 === 0], (data) => {
  if (isNone(data)) {
    return [];
  }
  return data;
}, {
  x: {
    y: 1
  }
});

console.log(result);
