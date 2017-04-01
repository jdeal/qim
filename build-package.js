import pkg from './package.json';
import fs from 'fs';
import shell from 'shelljs';

const newPkg = {
  ...pkg,
  scripts: {},
  ava: undefined,
  devDependencies: undefined
};

shell.cp('./README.md', './build/README.md');
fs.writeFileSync('./build/package.json', JSON.stringify(newPkg, null, 2));
