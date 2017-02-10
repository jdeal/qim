// Using our update function
return update(flow, {
  needs: {
    [nodeId]: {$set: FieldUtils.removeMissingFields(newNeeds)}
  },
  dirtyNeeds: {
    [nodeId]: {$set: false}
  },
  isLoadingNeeds: false,
  extraNeeds: {
    [nodeId]: {$set: extraFields}
  },
  missingNeeds: {
    [nodeId]: FieldUtils.hasMissingFields(newNeeds, node.params)
  }
});

// Functional style
return _.flow(
  setIn(['needs', nodeId], FieldUtils.removeMissingFields(newNeeds)),
  setIn(['dirtyNeeds', nodeId], false),
  set('isLoadingNeeds', false),
  set(['extraNeeds', nodeId], extraFields),
  set(['missingNeeds', nodeId], FieldUtils.hasMissingFields(newNeeds, node.params))
)(flow);

// Chaining style
return im(flow)
  .setIn(['needs', nodeId], FieldUtils.removeMissingFields(newNeeds)),
  .setIn(['dirtyNeeds', nodeId], false),
  .set('isLoadingNeeds', false),
  .set(['extraNeeds', nodeId], extraFields),
  .set(['missingNeeds', nodeId], FieldUtils.hasMissingFields(newNeeds, node.params))
  .value()

return assign({
  needs: assign({
    [nodeId]: FieldUtils.removeMissingFields(newNeeds)
  }),
  dirtyNeeds: assign({
    [nodeId]: false
  }),
  isLoadingNeeds: false,
  extraNeeds: assign({
    [nodeId]: extraFields
  }),
  missingNeeds: assign({
    [nodeId]: FieldUtils.hasMissingFields(newNeeds, node.params)
  })
})(flow)

return withMutations((m) => {
  m.get('needs').set(nodeId, FieldUtils.removeMissingFields(newNeeds));
  m.get('dirtyNeeds').set(nodeId, false);
  m.set('isLoadingNeeds', false);
  m.get('extraNeeds').set(nodeId, extraFields);
  m.get('missingNeeds').set(nodeId, FieldUtils.hasMissingFields(newNeeds, node.params));
})(flow);

return mutate(
  get('needs').set(nodeId, FieldUtils.removeMissingFields(newNeeds)),
  get('dirtyNeeds').set(nodeId, false),
  set('isLoadingNeeds', false),
  get('extraNeeds').set(nodeId, extraFields),
  get('missingNeeds').set(nodeId, FieldUtils.hasMissingFields(newNeeds, node.params))
)(flow);

flow.needs[nodeId] = FieldUtils.removeMissingFields(newNeeds);
flow.dirtyNeeds[nodeId] = false;
flow.isLoadingNeeds = false;
flow.extraNeeds[nodeId] = extraFields;
flow.missingNeeds[nodeId] = FieldUtils.hasMissingFields(newNeeds, node.params);

assign({
  needs: set(nodeId, FieldUtils.removeMissingFields(newNeeds)),
  dirtyNeeds: set(nodeId, false),
  isLoadingNeeds: false,
  extraNeeds: set(nodeId, extraFields),
  missingNeeds: set(nodeId, FieldUtils.hasMissingFields(newNeeds, node.params))
})
