```js
import im from 'im-js';

const obj = {
  x: 1
};

const newObj = im.set(obj, 'x', 2);
```

```js
import im from 'im-js';

const array = [
  1
];

const newArray = im.push(array, )
```

```js
im(obj).at('x').push(2).val();
```

```js
update(obj, {
  x: {
    $push: 2
  }
})
```

```js
im.withMutations(flow, m => {
  m('openFlowIds').push(String(flowId));
  m.
})
```

```js
im.mutate(flow, m => {
  m.mutate(thing)
})
```

obj.x.push(2)

obj.at('x').push(2).val()

im.pushAt('x', 2);

obj.x = 2

im.set(obj, 'x', 2);

im.push(obj, 'x', 2);

im.at('x').push(2)

obj.x.push(2)
im(array).push(2)
im(obj).at('x').push(2)
im(obj, 'x').push(2)


im(obj).at('array').push(2)

im(obj,
  ['set', 'x', 2],
  ['push', ]
)



const updatedFlow = update(flow, {
  needsMeta: {
    [nodeId]: {
      [fieldKey]: {
        isLoading: {$set: true},
        loadStamp: {$set: timestampId},
        choices: {$set: []},
        selectedChoice: {$set: currentChoice}
      }
    }
  }
});

const updatedFlow = {
  ...flow,
  needsMeta: {
    ...flow.needsMeta,
    [nodeId]: {
      ...flow.needsMeta[nodeId],
      [fieldKey]: {
        ...flow.needsMeta[nodeId][fieldKey],
        isLoading: true,
        loadStamp: timestampId,
        choices: [],
        selectedChoice: currentChoice
      }
    }
  }
}

flow.needsMeta[nodeId][fieldKey].isLoading = true;
flow.needsMeta[nodeId][fieldKey].loadStamp = timestampId;
flow.needsMeta[nodeId][fieldKey].choices = [];
flow.needsMeta[nodeId][fieldKey].selectedChoice = currentChoice;

_.extend(flow.needsMeta[nodeId][fieldKey], {
  isLoading: true,
  loadStamp: timestampId,
  choices: [],
  selectedChoice: currentChoice
});

im.extend(flow.needsMeta[nodeId][fieldKey], {
  isLoading: true,
  loadStamp: timestampId,
  choices: [],
  selectedChoice: currentChoice
})

  return update(state, {
    openFlowIds: {
      $push: [String(flowId)]
    }
  });

im.push(state, 'openFlowIds', String(flowId))

im(state,
  'openFlowIds', m => m.push(String(flowId))
)

im(flow,
  ['needsMeta', nodeId, fieldKey], () =>
)

im(state, 'openFlowIds').push(String(flowId))

im(state.openFlowIds).push(String(flowId))

im(flow).set('isLoaded', true);

im(state.openFlowIds, () => {

});

im(state, {
  openFlowIds: $ => $.push(String(flowId))
})
