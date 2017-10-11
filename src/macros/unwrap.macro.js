const t = require('babel-types');
const { createMacro } = require('babel-macros');
const templateExpression = require('./templateExpression');

const ensureVar = (id, path) => {
  if (!path.scope.hasBinding(id)) {
    path.scope.push({kind: 'var', id});
  }
};

const buildUnwrapExpression = templateExpression(`
  WRAPPED == null || typeof WRAPPED['@@qim/wrap'] === 'undefined' ?
    WRAPPED :
    WRAPPED.value()
`);

const buildUnwrapSequence = templateExpression(`
  (TEMP_VAR = NODE, UNWRAP)
`);

const createUnwrapExpression = (id) =>
  buildUnwrapExpression({
    WRAPPED: id
  });

const createUnwrapSequence = (id, node) =>
  buildUnwrapSequence({
    TEMP_VAR: id,
    NODE: node,
    UNWRAP: createUnwrapExpression(id)
  });

module.exports = createMacro(({ references }) => {
  references.default.forEach(path => {
    const id = t.identifier('_wrappedValue');
    const maybeValueNode = path.parentPath.node.arguments[0];
    const valueNode = maybeValueNode !== undefined ?
      maybeValueNode :
      t.identifier('undefined');
    if (valueNode.type === 'Identifier') {
      path.parentPath.replaceWith(
        createUnwrapExpression(valueNode)
      );
    } else {
      path.parentPath.replaceWith(
        createUnwrapSequence(id, valueNode)
      );
      ensureVar(id, path);
    }
  });
});
