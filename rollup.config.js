// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    // resolve(),
    // commonjs()
  ],
  external: [
    'object-assign'
  ],
  dest: 'build/bundle.js'
};
