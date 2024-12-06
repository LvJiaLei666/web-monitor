import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import del from 'rollup-plugin-delete'

export default defineConfig({
  input: `packages/core/index.ts`,
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'WebMonitor',
      sourcemap: true,
    },
  ],
  plugins: [
    terser(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields: ['browser', 'module', 'main'],
    }),
    typescript(),
    del({ targets: 'dist/*', verbose: true }),
  ],
})
