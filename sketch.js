const state = {
  entities: {
    user: {
      joe: {
        name: {
          first: 'Joe',
          last: 'Foo'
        }
      },
      mary: {
        name: {
          first: 'Mary',
          last: 'Bar'
        }
      }
    },
    friend: {
      joe: []
    }
  }
};

update({
  entities: {
    user: {
      joe: {
        name: {
          first: {$set: 'Joseph'},
          last: {$set: 'Foozle'}
        }
      }
    },
    friend: {
      joe: {
        $push: ['mary']
      }
    }
  }
})(state);

const entities = state.entities;
const name = entities.user.joe.name
name.first = 'Joseph';
name.last = 'Foozel';
entities.friend.joe.push('mary');

in('entities',
  in(['user', 'joe', 'name'],
    set('first', 'Joseph'),
    set('last', 'Foozle')
  ),
  pushIn(['friend', 'joe'], 'mary')
)(state);

pushIn(['friend', 'joe'], 'mary');
in(['friend', 'joe'], push('mary'));

in(['entities', 'user', 'joe', 'name'], set('first', 'Joseph'))
setIn(['entities', 'user', 'joe', 'name', 'first'], 'Joseph')

in('entities',
  assignIn(['user', 'joe', 'name'], {
    first: 'Joseph',
    last: 'Foozle'
  }),
  pushIn(['friend', 'joe'], 'mary')
)

in('entities',
  in(['users', 'joe'],
    in('name',
      assign({
        first: 'Joseph',
        last: 'Foozle'
      })
    )
  )
  in(['friend', 'joe'],
    push('mary')
  )
)(state);

['entities']
  ['user', 'joe', 'name']
    'first'
    'last'
  ['friend', 'joe']

transform([
  'entities', [
    [
      'user', 'joe', 'name', [
        ['first', $set, 'Joe'],
        ['last', $set, 'Foo']
      ],
      'friend', 'joe', $push, 'mary'
    ]
  ]
])



transform(['entities', $pairs, ([key]) => (key === 'user' || key === 'friend'), 1, 'name'])

transform([
  'entities', branch(
    ['user', 'joe', 'name', branch(
      ['first', $set, 'Joe'],
      ['last', $set, 'Foo']
    )],
    ['friend', 'joe', $push, 'mary']
  )
])

transform([
  'entities', [
    ['user', 'joe', 'name', [
      ['first', $set, 'Joe'],
      ['last', $set, 'Foo']
    ]],
    ['friend', 'joe', $push, 'mary']
  ]
])(state);

transform(['entities', [
  ['user', 'joe', 'name', [
    ['first', $_, 'Joe'],
    ['last', $_, 'Foo']
  ]],
  ['friend', 'joe', $_, push('mary')]
]])(state);

in('entities',
  in(['user', 'joe', 'name'],
    set('first', 'Joseph'),
    set('last', 'Foozle')
  ),
  pushIn(['friend', 'joe'], 'mary')
)(state);

transform(['entities'],
  transform(['user', 'joe', 'name'],
    set('first', 'Joseph'),
    set('last', 'Foozle')
  ),
  transform(['friend', 'joe'],
    push('mary')
  )
)(state);

transform([
  'entities',
  'user',
  $pairs,
  ([key]) => (key === 'user' || key === 'friend'),
  1,
  'name'
],
  ({first, last}) => ({first: first.toUpperCase, last: last.toUpperCase()})
)(state);

in(['entities', 'user'],
  map((user, key) => )
)

setIn(['entities', $values, $values, 'status'], 'cached')

pushIn(['entities', $values, $values, 'statuses'], 'cached')

transform(['entities', $values, $values, 'statuses'], push('cached'))


in('entities',
  in(['user', 'joe', 'name'],
    set('first', 'Joseph'),
    set('last', 'Foozle')
  ),
  pushIn(['friend', 'joe'], 'mary')
)(state);

update('entities', flow(
  flowIn(['user', 'joe', 'name'],
    set('first', 'Joseph'),
    set('last', 'Foozle')
  ),
  pushIn(['friend', 'joe'], 'mary')
))(state);

in('entities', [
  in(['user', 'joe', 'name'], [
    set('first', 'Joseph'),
    set('last', 'Foozle')
  ]),
  pushIn(['friend', 'joe'], 'mary')
])(state);


in(['entities', 'user', 'joe', 'name'], [
  set('first', 'Joseph'),
  set('last', 'Foozle')
], state);

update('entities', flow(
  updateIn(['user', 'joe', 'name'], flow(
    set('first', 'Joseph'),
    set('last', 'Foozle')
  )),
  pushIn(['friend', 'joe'], 'mary')
), state);

updateIn(['entities', 'user', $values, 'name'], name => assign({
  first: name.toUpperCase(),
  last: name.toUpperCase()
}, name))

update('entities', [
  updateIn(['user', 'joe', 'name'], [
    set('first', 'Joseph'),
    set('last', 'Foozle')
  ]),
  pushIn(['friend', 'joe'], 'mary')
], state);

update({entities: {
  user: {joe: {name: {
    first: {$set: 'Joseph'},
    last: {$set: 'Foozle'}
  }}},
  friend: {joe: {$push: ['mary']}}
}})(state);

['entities', [
  ['user', 'joe', 'name', [
    ['first', $set, 'Joseph'],
    ['last', $set, 'Foozle']
  ]],
  ['friend', 'joe', $push, 'mary']
]]

im(state)
  .in('entities')
    .in('user', 'joe', 'name')
      .set('first', 'Joseph')
      .set('last', 'Foozle')
    .out()
    .in('friend', 'joe')
      .push('mary');

im(state)
  .in('entities', m => {
    m.in('user', 'joe', 'name', m => {
      m.set('first', 'Joseph');
      m.set('last', 'Foozle');
    })
  })
  .in('friend', 'joe', m => {
    m.push('mary');
  })

withMutations(state => {
  const entities = state.get('entities');
  const name = entities.getIn(['user', 'joe', 'name']);
  name.set('first', 'Joseph');
  name.set('last', 'Foozle');
  entities.pushIn(['friend', 'joe'], 'mary');
});


updateIn(['entities',
  $in('user', 'joe', 'name', [
    $in('first', $set('Joseph')),
    $in('last', $set('Foozle'))
  ])
])

updateIn(['entities'], [
  $in(['user', 'joe', 'name'], [
    $set('first', 'Joseph'),
    $set('last', 'Foozle')
  ])
])

set('first', 'Joseph')

assign({
  first: 'Joseph',
  last: 'Foozle'
})

updateIn([$values $selected()])

assign({
  entities: {...state.entities, foo: {}},
  errors: [...state.errors, 'bad!']
})(state)

update([], {
  entities:
})(state);

update({
  entities: assign({foo: {}}),
  errors: push('bad!')
})

assignUpdate({
  errors: value([])
})

update('errors', value([]))

updateIn(['entities'], [
  $in(['user', 'joe', 'name'], [
    $set('first', 'Joseph'),
    $set('last', 'Foozle')
  ]),
  $in(['friend', 'joe'], $push('mary'))
])

multiTransform([
  'entities', multiPath(
    ['user', 'joe', 'name', multiPath(
      ['first', $terminalValue, 'Joseph'],
      ['last', $terminalValue, 'Foozle']
    )],
    ['friend', 'joe', $terminal, push('mary')]
  )
])

transform(['joe', 'name', 'first'], value('Joseph'))(users);

multiTransform(['joe', 'name', 'first', $terminal, value('Joseph')])(users);

update(['joe', 'name', 'first', $, value('Joseph')])

update(['joe', 'name', 'first', $update(value('Joseph'))])

update(['entities', 'user', $values, $if(user => user.isAdmin), 'tag', $push('admin')])(state);

update(['entities', [
  ['user', 'joe', 'name', [
    ['first', $value('Joseph')],
    ['last', $value('Foozle')]
  ]],
  ['friend', 'joe', $push('mary')]
]])(state);

update(['entities', [
  ['user', 'joe', 'name', [
    ['first', $value('Joseph')],
    ['last', $value('Foozle')]
  ]],
  ['friend', 'joe', $push('mary')]
]])(state);
