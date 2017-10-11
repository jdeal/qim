const t = require('babel-types');
const { createMacro } = require('babel-macros');
const templateExpression = require('./templateExpression');

const buildIsWrappedExpression = templateExpression(`
  typeof SOURCE['@@qim/wrap'] !== 'undefined'
`);

const createIsWrappedExpression = (id) =>
  buildIsWrappedExpression({
    SOURCE: id
  });

module.exports = createMacro(({ references }) => {
  references.default.forEach(path => {
    const maybeValueNode = path.parentPath.node.arguments[0];
    const valueNode = maybeValueNode !== undefined ?
      maybeValueNode :
      t.identifier('undefined');
    path.parentPath.replaceWith(
      createIsWrappedExpression(valueNode)
    );
  });
});
