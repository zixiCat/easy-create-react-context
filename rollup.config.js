import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.tsx',
  output: [
    {
      dir: 'lib',
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
      strict: false,
    },
  ],
  plugins: [typescript()],
  external: ['react', 'react-dom'],
};
