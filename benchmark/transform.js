import Benchmark from 'benchmark';

const suite = new Benchmark.Suite();

import update from 'immutability-helper';
import transform from '../src/transform';
import $set from '../src/$set';

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

// const newState = transform(['entities', 'user', 'joe', 'name', 'first', $set('Joseph')], state);
//
// console.log(JSON.stringify(newState, null, 2));
//
// process.exit();

suite
  .add('spread', () => {
    const newState = {
      ...state,
      entities: {
        ...state.entities,
        user: {
          ...state.entities.user,
          joe: {
            ...state.entities.user.joe,
            name: {
              ...state.entities.user.joe.name,
              first: 'Joseph',
              //last: 'Foozle'
            }
          }
        },
        // friend: {
        //   ...state.entities.friend,
        //   joe: [...state.entities.friend.joe, 'mary']
        // }
      }
    };
  })
  .add('update', () => {
    const newState = update(state, {
      entities: {
        user: {
          joe: {
            name: {
              first: {$set: 'Joseph'},
              //last: {$set: 'Foozle'}
            }
          }
        },
        // friend: {
        //   joe: {$push: ['mary']}
        // }
      }
    });
  })
  .add('transform', () => {
    const newState = transform(['entities', 'user', 'joe', 'name', 'first', $set('Joseph')], state);
  })
  // .add('inline transform', () => {
  //   const newState = transformInline(['entities', 'user', 'joe', 'name', 'first', $value('Joseph')], state);
  // })
  // .add('cached transform', () => {
  //   const newState = cachedTransform(state);
  // })
  // .add('simple transform', () => {
  //   const newState = transformSimple(['entities', 'user', 'joe', 'name', 'first', $value('Joseph')], state);
  // })
  // .add('simple cached transform', () => {
  //   const newState = cachedTransformSimple(state);
  // })
  // .add('updateIn', () => {
  //   const newState = updateIn(['entities'], [
  //     updateIn(['user', 'joe', 'name'], [
  //       set('first', 'Joseph'),
  //       set('last', 'Foozle')
  //     ]),
  //     updateIn(['friend', 'joe'], (array) => [...array, 'mary'])
  //   ])(state);
  // })
  .on('complete', function() {
    //console.log(this);
    console.log(this.map(bench => {
      return bench.name + '\n' + Number(Math.round(bench.hz)).toLocaleString();
    }).join('\n\n'));
  })
  // run async
  .run({ 'async': true });

  // updateIn(['user', 'joe', 'name'], assignUpdate({
  //   first: toUpperCase,
  //   last: toUpperCase
  // }))
