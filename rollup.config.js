import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  // ESM 构建（用于现代打包工具和 import）
  {
    input: 'src/index.js',
    output: {
      file: 'lib/jssm4.esm.js',
      format: 'esm',
      exports: 'default',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
    ],
    external: ['base64-js'], // base64-js 作为外部依赖
  },

  // CommonJS 构建（用于 Node.js require）
  {
    input: 'src/index.js',
    output: {
      file: 'lib/jssm4.cjs.js',
      format: 'cjs',
      exports: 'default',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
    ],
    external: ['base64-js'],
  },

  // UMD 构建（用于浏览器 <script> 标签，包含所有依赖）
  {
    input: 'src/index.js',
    output: {
      file: 'lib/jssm4.js',
      format: 'umd',
      name: 'JSSM4',
      exports: 'default',
      sourcemap: true,
      globals: {
        'base64-js': 'base64js',
      },
    },
    plugins: [
      resolve(),
      commonjs(),
    ],
  },
];
