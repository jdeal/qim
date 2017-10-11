const template = require('babel-template');

const templateExpression = (source) => {
  const buildExpressionCall = template(`wrap(${source})`);
  return (replacements) =>
    buildExpressionCall(replacements).expression.arguments[0];
};

module.exports = templateExpression;
