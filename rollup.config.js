import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import cleanup from 'rollup-plugin-cleanup'

export default {
  name: 'crawl',
  input: 'index.js',
  output: {
    format: 'umd',
    file: 'dist/tree-crawl.js'
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
    // XXX: https://github.com/rollup/rollup-plugin-babel/issues/120
    babel({
      babelrc: false,
      presets: [
        ['env', {
          targets: { browsers: '> 1%' },
          modules: false
        }]
      ],
      plugins: [
        'external-helpers'
      ]
    }),
    cleanup()
  ].filter(Boolean)
}
