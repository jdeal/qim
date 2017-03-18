import shell from 'shelljs';

const cwd = process.cwd();

shell.cd('build');
shell.exec('npm publish', () => {
  shell.cd(cwd);
});
