import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

const dev = process.env.ENVIRONMENT === 'DEVELOPMENT'

export default [
  {
    input: './src/app.ts',
    output: {
      dir: './dist/',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      json(),
      typescript({
        tsconfig: './tsconfig.json'
      }),
      dev ? null : terser()
    ]
  }
]