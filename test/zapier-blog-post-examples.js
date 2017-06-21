import test from 'ava';

import 'babel-core/register';

import {
  find, set, select, update,
  $each, $eachPair, $apply, $set, $none, $end, $first,
  $nav, $lens, $traverse,
  $setContext, $pushContext,
  isReduced
} from 'qim/src';

import fp from 'lodash/fp';

const todoState0 = {
  todos: {
    todo1: {
      text: 'invent time machine',
      isDone: true
    },
    todo2: {
      text: 'fix msitakes',
      isDone: false
    }
  },
  ids: ['todo1', 'todo2']
};

test('find and set', t => {

  const todoText = find(['todos', 'todo1', 'text'], todoState0);

  t.is(todoText, 'invent time machine');

  const todoState1 = set(['todos', 'todo2', 'text'], 'fix mistakes', todoState0);

  t.deepEqual(
    todoState1,
    {
      todos: {
        todo1: {
          text: 'invent time machine',
          isDone: true
        },
        todo2: {
          text: 'fix mistakes',
          isDone: false
        }
      },
      ids: ['todo1', 'todo2']
    }
  );

  t.is(
    todoState0.todos.todo2.text, 'fix msitakes'
  );
});

// Pulling this outside, because it's used in a lot of the following tests.
const todoState1 = set(['todos', 'todo2', 'text'], 'fix mistakes', todoState0);

test('intro to navigators', t => {

  const todosText = select(['todos', $each, 'text'], todoState1);

  t.deepEqual(
    todosText,
    ['invent time machine', 'fix mistakes']
  );

  const upperTodoState = update(['todos', $each, 'text', $apply(text => text.toUpperCase())], todoState1);

  t.deepEqual(
    upperTodoState,
    {
      todos: {
        todo1: {
          text: 'INVENT TIME MACHINE',
          isDone: true
        },
        todo2: {
          text: 'FIX MISTAKES',
          isDone: false
        }
      },
      ids: ['todo1', 'todo2']
    }
  );
});

test('avoid unnecessary mutations', t => {

  const upperTodoState = update(['todos', $each, 'text', $apply(text => text)], todoState1);

  t.is(
    upperTodoState,
    todoState1
  );
});

test('vanilla JS', t => {

  const todosText = Object.keys(todoState1.todos)
    .map(key => todoState1.todos[key].text);

  t.deepEqual(
    todosText,
    ['invent time machine', 'fix mistakes']
  );

  const upperTodoState = {
    ...todoState1,
    todos: Object.keys(todoState1.todos)
      .reduce((result, key) => {
        const todo = todoState1.todos[key];
        result[key] = {
          ...todo,
          text: todo.text.toUpperCase()
        };
        return result;
      }, {})
  };

  t.deepEqual(
    upperTodoState,
    {
      todos: {
        todo1: {
          text: 'INVENT TIME MACHINE',
          isDone: true
        },
        todo2: {
          text: 'FIX MISTAKES',
          isDone: false
        }
      },
      ids: ['todo1', 'todo2']
    }
  );
});

test('peek at $nav', t => {

  const $eachTodoText = $nav(['todos', $each, 'text']);

  const todosText = select([$eachTodoText], todoState1);

  t.deepEqual(
    todosText,
    ['invent time machine', 'fix mistakes']
  );

  const upperTodoState = update([$eachTodoText, $apply(text => text.toUpperCase())], todoState1);

  t.deepEqual(
    upperTodoState,
    {
      todos: {
        todo1: {
          text: 'INVENT TIME MACHINE',
          isDone: true
        },
        todo2: {
          text: 'FIX MISTAKES',
          isDone: false
        }
      },
      ids: ['todo1', 'todo2']
    }
  );
});

test('vanilla JS', t => {

  const todosText = fp.flow(
    fp.get('todos'),
    fp.map(fp.get('text'))
  )(todoState1);

  t.deepEqual(
    todosText,
    ['invent time machine', 'fix mistakes']
  );

  const upperTodoState = fp.update('todos', fp.mapValues(
    fp.update('text', text => text.toUpperCase())
  ), todoState1);

  t.deepEqual(
    upperTodoState,
    {
      todos: {
        todo1: {
          text: 'INVENT TIME MACHINE',
          isDone: true
        },
        todo2: {
          text: 'FIX MISTAKES',
          isDone: false
        }
      },
      ids: ['todo1', 'todo2']
    }
  );
});

test('select with predicate', t => {

  const completedTodos = select(
    ['todos', $each, todo => todo.isDone, 'text'],
    todoState1
  );

  t.deepEqual(
    completedTodos,
    ['invent time machine']
  );
});

test('update with predicate', t => {

  const upperCompletedTodos = update(
    ['todos', $each, todo => todo.isDone, 'text', $apply(text => text.toUpperCase())],
    todoState1
  );

  t.deepEqual(
    upperCompletedTodos,
    {
      todos: {
        todo1: {
          text: 'INVENT TIME MACHINE',
          isDone: true
        },
        todo2: {
          text: 'fix mistakes',
          isDone: false
        }
      },
      ids: ['todo1', 'todo2']
    }
  );
});

test('compare predicate to lodash/fp', t => {

  const completedTodos = fp.flow(
    fp.get('todos'),
    fp.filter(fp.get('isDone')),
    fp.map(fp.get('text'))
  )(todoState1);

  t.deepEqual(
    completedTodos,
    ['invent time machine']
  );

  const upperCompletedTodos = fp.update('todos', fp.mapValues(
    todo => {
      if (todo.isDone) {
        return fp.update('text', text => text.toUpperCase(), todo);
      }
      return todo;
    }
  ), todoState1);

  t.deepEqual(
    upperCompletedTodos,
    {
      todos: {
        todo1: {
          text: 'INVENT TIME MACHINE',
          isDone: true
        },
        todo2: {
          text: 'fix mistakes',
          isDone: false
        }
      },
      ids: ['todo1', 'todo2']
    }
  );
});

test('nested queries', t => {

  const todoState1 = update(['todos', 'todo2', // eslint-disable-line
    ['text', $set('fix mistakes')],
    ['isDone', $set(true)]
  ], todoState0);

  t.deepEqual(
    todoState1,
    {
      todos: {
        todo1: {
          text: 'invent time machine',
          isDone: true
        },
        todo2: {
          text: 'fix mistakes',
          isDone: true
        }
      },
      ids: ['todo1', 'todo2']
    }
  );

  const results = select(['todos', 'todo2',
    ['text'],
    ['isDone']
  ], todoState1);

  t.deepEqual(
    results,
    ['fix mistakes', true]
  );
});

test('$each + predicates + nested queries', t => {

  const todoState2 = update(['todos', $each,
    [todo => todo.isDone, 'isArchived', $set(true)],
    [todo => !todo.isDone, 'dueDate', $set('2020/02/20')]
  ], todoState1);

  t.deepEqual(
    todoState2,
    {
      todos: {
        todo1: {
          text: 'invent time machine',
          isDone: true,
          isArchived: true
        },
        todo2: {
          text: 'fix mistakes',
          isDone: false,
          dueDate: '2020/02/20'
        }
      },
      ids: ['todo1', 'todo2']
    }
  );
});

test('remove a property', t => {

  const cleanedTodos = update([
    ['todos', $each, todo => todo.isDone, $none],
    ['ids', $each, id => todoState1.todos[id].isDone, $none]
  ], todoState1);

  t.deepEqual(
    cleanedTodos,
    {
      todos: {
        todo2: {
          text: 'fix mistakes',
          isDone: false
        }
      },
      ids: ['todo2']
    }
  );
});

test('get pairs', t => {
  const pairs = select(
    ['todos', $eachPair],
    todoState1
  );
  t.deepEqual(
    pairs,
    [
      ['todo1', {text: 'invent time machine', isDone: true}],
      ['todo2', {text: 'fix mistakes', isDone: false}]
    ]
  );
});

test('iterate over pairs', t => {

  const todoState2 = update(
    ['todos', $eachPair, $apply(([id, todo]) => [id, {...todo, id}])],
    todoState1
  );

  t.deepEqual(
    todoState2,
    {
      todos: {
        todo1: {
          id: 'todo1',
          text: 'invent time machine',
          isDone: true
        },
        todo2: {
          id: 'todo2',
          text: 'fix mistakes',
          isDone: false
        }
      },
      ids: ['todo1', 'todo2']
    }
  );
});

test('appending to an array', t => {

  const todoState2 = update([
    ['todos', 'todo3', $set({text: '', isDone: false})],
    ['ids', $end, $set(['todo3'])]
  ], todoState1);

  t.deepEqual(
    todoState2,
    {
      todos: {
        todo1: {
          text: 'invent time machine',
          isDone: true
        },
        todo2: {
          text: 'fix mistakes',
          isDone: false
        },
        todo3: {
          text: '',
          isDone: false
        }
      },
      ids: ['todo1', 'todo2', 'todo3']
    }
  );
});

test('simple custom navigators', t => {

  const $true = $set(true);
  const $false = $set(false); // eslint-disable-line

  const todoState2 = update(
    ['todos', 'todo2', 'isDone', $true],
    todoState1
  );

  t.deepEqual(
    todoState2,
    {
      todos: {
        todo1: {
          text: 'invent time machine',
          isDone: true
        },
        todo2: {
          text: 'fix mistakes',
          isDone: true
        }
      },
      ids: ['todo1', 'todo2']
    }
  );
});

test('simple parameterized navigator', t => {

  const $true = $set(true);

  const $todo = id => $nav(['todos', id]);
  const $markDone = $nav(['isDone', $true]);

  const todoState2 = update(
    [$todo('todo2'), $markDone],
    todoState1
  );

  t.deepEqual(
    todoState2,
    {
      todos: {
        todo1: {
          text: 'invent time machine',
          isDone: true
        },
        todo2: {
          text: 'fix mistakes',
          isDone: true
        }
      },
      ids: ['todo1', 'todo2']
    }
  );
});

test('$nav with function', t => {

  const todoState2 = update(
    ['todos', $eachPair, $nav(([key]) => [1, 'id', $set(key)])],
    todoState1
  );

  t.deepEqual(
    todoState2,
    {
      todos: {
        todo1: {
          id: 'todo1',
          text: 'invent time machine',
          isDone: true
        },
        todo2: {
          id: 'todo2',
          text: 'fix mistakes',
          isDone: false
        }
      },
      ids: ['todo1', 'todo2']
    }
  );
});

// Pulling this out because it's used in a couple examples.

const todoTree = [
  {
    id: 'todo1',
    text: 'invent time machine',
    isDone: false,
    todos: [
      {
        id: 'todo2',
        text: 'find delorean',
        isDone: true
      },
      {
        id: 'todo3',
        text: 'go 88 mph',
        isDone: false
      }
    ]
  },
  {
    id: 'todo4',
    text: 'fix mistakes',
    isDone: false
  }
];

test('recursive navigator with $nav', t => {

  const $walkTodos = $nav(value => {
    // If the current value is an array, iterate over each item and recurse.
    if (Array.isArray(value)) {
      return [$each, $walkTodos];
    }
    if (value.todos) {
      // If we have child todos, we need to navigate to multiple paths.
      return $nav(
        // Just a no-op path that will continue with the rest of the query.
        [],
        // Navigate to the child todos and recurse.
        ['todos', $walkTodos]
      );
    }
    // Just a no-op path that will continue with the rest of the query.
    return [];
  });

  const values = select([$walkTodos, 'text'], todoTree);

  t.deepEqual(
    values,
    [
      'invent time machine',
      'find delorean',
      'go 88 mph',
      'fix mistakes'
    ]
  );

  const todoTreeUpper = update(
    [$walkTodos, 'text', $apply(value => value.toUpperCase())],
    todoTree
  );

  t.deepEqual(
    todoTreeUpper,
    [
      {
        id: 'todo1',
        text: 'INVENT TIME MACHINE',
        isDone: false,
        todos: [
          {
            id: 'todo2',
            text: 'FIND DELOREAN',
            isDone: true
          },
          {
            id: 'todo3',
            text: 'GO 88 MPH',
            isDone: false
          }
        ]
      },
      {
        id: 'todo4',
        text: 'FIX MISTAKES',
        isDone: false
      }
    ]
  );
});

test('custom navigator with $lens', t => {

  const $todosArray = $lens(
    // Map our state object to an array.
    (todoState) => {
      return todoState.ids.map(id => ({
        ...todoState.todos[id],
        id
      }));
    },
    // Map our array back to a state object.
    (todosArray, todoState) => {
      return todosArray.reduce((newTodoState, todoWithId) => {
        const {id, ...todo} = todoWithId;
        newTodoState.todos[id] = todo;
        newTodoState.ids.push(id);
        return newTodoState;
      }, {
        ...todoState,
        todos: {},
        ids: []
      });
    }
  );

  const upperIdState = update(
    [$todosArray, $each, 'id', $apply(id => id.toUpperCase())],
    todoState1
  );

  t.deepEqual(
    upperIdState,
    {
      todos: {
        TODO1: {
          text: 'invent time machine',
          isDone: true
        },
        TODO2: {
          text: 'fix mistakes',
          isDone: false
        }
      },
      ids: [
        'TODO1',
        'TODO2'
      ]
    }
  );
});

test('custom navigator with $traverse', t => {

  const $eachTodo = $traverse({
    select: (todoState, next) => {
      for (let i = 0; i < todoState.ids.length; i++) {
        const id = todoState.ids[i];
        const result = next({
          ...todoState.todos[id],
          id
        });
        if (isReduced(result)) {
          return result;
        }
      }
      return undefined;
    },
    update: (todoState, next) => {
      const todos = todoState.ids.map(id => ({
        ...todoState.todos[id],
        id
      }));
      const newTodos = todos.map(todo => next(todo));
      return newTodos.reduce((newTodoState, todoWithId) => {
        const {id, ...todo} = todoWithId;
        newTodoState.todos[id] = todo;
        newTodoState.ids.push(id);
        return newTodoState;
      }, {
        ...todoState,
        todos: {},
        ids: []
      });
    }
  });

  const upperIdState = update(
    [$eachTodo, 'id', $apply(id => id.toUpperCase())],
    todoState1
  );

  t.deepEqual(
    upperIdState,
    {
      todos: {
        TODO1: {
          text: 'invent time machine',
          isDone: true
        },
        TODO2: {
          text: 'fix mistakes',
          isDone: false
        }
      },
      ids: [
        'TODO1',
        'TODO2'
      ]
    }
  );
});

test('use $lens + $nav instead of $traverse', t => {

  const $todosArray = $lens(
    // Map our state object to an array.
    (todoState) => {
      return todoState.ids.map(id => ({
        ...todoState.todos[id],
        id
      }));
    },
    // Map our array back to a state object.
    (todosArray, todoState) => {
      return todosArray.reduce((newTodoState, todoWithId) => {
        const {id, ...todo} = todoWithId;
        newTodoState.todos[id] = todo;
        newTodoState.ids.push(id);
        return newTodoState;
      }, {
        ...todoState,
        todos: {},
        ids: []
      });
    }
  );

  const $eachTodo = $nav([$todosArray, $each]);

  const upperIdState = update([$eachTodo, 'id', $apply(id => id.toUpperCase())], todoState1);

  t.deepEqual(
    upperIdState,
    {
      todos: {
        TODO1: {
          text: 'invent time machine',
          isDone: true
        },
        TODO2: {
          text: 'fix mistakes',
          isDone: false
        }
      },
      ids: [
        'TODO1',
        'TODO2'
      ]
    }
  );

  const firstTodo = find([$eachTodo], todoState1);

  t.deepEqual(
    firstTodo,
    {
      id: 'todo1',
      text: 'invent time machine',
      isDone: true
    }
  );
});

test('use $setContext with $apply', t => {
  const todosWithIdSuffixState = update([
    'todos', $eachPair,
    $setContext('id', find(0)),
    1, 'text',
    $apply((text, ctx) => `${text} (${ctx.id})`)
  ], todoState1);

  t.deepEqual(
    todosWithIdSuffixState,
    {
      todos: {
        todo1: {
          text: 'invent time machine (todo1)',
          isDone: true
        },
        todo2: {
          text: 'fix mistakes (todo2)',
          isDone: false
        }
      },
      ids: [
        'todo1',
        'todo2'
      ]
    }
  );
});

test('use $setContext with $nav', t => {
  const $setFirstTodo = $setContext('firstTodoId', find(['ids', $first]));

  const $getFirstTodo = $nav((todos, ctx) => [ctx.firstTodoId]);

  const firstTodoText = find([$setFirstTodo, 'todos', $getFirstTodo, 'text'], todoState1);

  t.is(
    firstTodoText,
    'invent time machine'
  );
});

test('recursive navigator with $pushContext', t => {
  const $pushPath = $pushContext('path', todo => todo.id);

  const $walkTodos = $nav(value => {
    if (Array.isArray(value)) {
      return [$each, $walkTodos];
    }
    if (value.todos) {
      return $nav(
        [$pushPath],
        [$pushPath, 'todos', $walkTodos]
      );
    }
    return [$pushPath];
  });

  const flatList = select(
    [$walkTodos, 'text', $apply((text, ctx) => ({path: ctx.path.join('/'), text}))],
    todoTree
  );

  t.deepEqual(
    flatList,
    [
      {
        path: 'todo1',
        text: 'invent time machine'
      },
      {
        path: 'todo1/todo2',
        text: 'find delorean'
      },
      {
        path: 'todo1/todo3',
        text: 'go 88 mph'
      },
      {
        path: 'todo4',
        text: 'fix mistakes'
      }
    ]
  );
});
