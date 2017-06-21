import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

import {update, $begin, $end, $set} from './src/index';

const baseConfig = {
  entry: 'src/index.js',
  external: [],
  plugins: [
    babel({
      babelrc: false,
      presets: [
        ['es2015', {modules: false}],
        ['stage-2']
      ],
      plugins: ['external-helpers']
    }),
  ]
};

const cjsConfig = update(
  [
    ['format', $set('cjs')],
    ['external', $end, $set(['object-assign'])],
    ['dest', $set('build/index.js')]
  ],
  baseConfig
);

const umdConfig = update(
  [
    ['format', $set('umd')],
    ['dest', $set('build/umd/qim.js')],
    ['moduleName', $set('qim')],
    ['plugins', $begin, $set([
      nodeResolve(),
      commonjs()
    ])]
  ],
  baseConfig
);

const umdMinConfig = update(
  [
    ['dest', $set('build/umd/qim.min.js')],
    ['plugins', $end, $set([
      uglify()
    ])]
  ],
  umdConfig
);

export default [
  cjsConfig,
  umdConfig,
  umdMinConfig
];
