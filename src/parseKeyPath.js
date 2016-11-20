import objectpath from 'objectpath';

const parseKeyPath = (keyPath) => {
  return objectpath.parse(keyPath);
};

export default parseKeyPath;
