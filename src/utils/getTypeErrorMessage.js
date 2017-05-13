const pluralize = type => `${type}s`;

const typeName = object => {
  if (object === null) {
    return 'null';
  }
  if (Array.isArray(object)) {
    return 'array';
  }
  return typeof object;
};

// Prepend word with "a" or "an".
const articleize = type => `${'aeiou'.indexOf(type[0]) >= 0 ? 'an' : 'a'} ${type}`;

// Concatenate types together into a phrase.
const getSupportedTypesPhrase = (supportedTypes) => {
  supportedTypes = Array.isArray(supportedTypes) ? supportedTypes : [supportedTypes];
  const pluralTypes = supportedTypes.map(type => pluralize(type));

  if (pluralTypes.length === 1) {
    return pluralTypes[0];
  }

  if (pluralTypes.length === 2) {
    return `${pluralTypes[0]} and ${pluralTypes[1]}`;
  }

  return pluralTypes.slice(0, pluralTypes.length - 1)
    .join(', ')
    .concat(`, and ${pluralTypes[pluralTypes.length - 1]}`);
};

// Get error message saying what types a function supports.
const getTypeErrorMessage = (name, supportedTypes, object) => [
  name,
  ' only supports ',
  getSupportedTypesPhrase(supportedTypes),
  ', but ',
  articleize(typeName(object)),
  ' was provided.'
].join('');

export default getTypeErrorMessage;
