import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

// Need to import transpiled qim; otherwise babel-macros screws with rollup.
// Not sure why this has to be a require instead of an import. ¯\_(ツ)_/¯
const qim = require('./build');

const {update, $begin, $end, $set} = qim;

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
      plugins: ['babel-macros', 'external-helpers']
    }),
  ]
};

const cjsConfig = update(
  [
    ['format', $set('cjs')],
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
