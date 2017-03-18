import pkg from './package.json';
import fs from 'fs';

const newPkg = {
  ...pkg,
  scripts: {},
  ava: undefined,
  devDependencies: undefined
};

fs.writeFileSync('./build/package.json', JSON.stringify(newPkg, null, 2));
