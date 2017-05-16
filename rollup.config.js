import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  format: 'cjs',
  external: [
    'object-assign'
  ],
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      "presets": [
        [
          "es2015",
          {
            modules: false
          }
        ],
        "stage-2"
      ],
      "plugins": [
        "external-helpers"
      ]
    }),
  ],
  dest: 'build/index.js'
};
