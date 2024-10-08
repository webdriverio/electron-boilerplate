import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config
export const config: Config = {
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  tsconfig: 'tsconfig.stencil.json',
  rollupConfig: {
    inputOptions: {
      external: ['electron'],
    }
  },
  outputTargets: [
    {
      type: 'www',
      dir: 'dist',
      // comment the following line to disable service workers in production
      serviceWorker: null
    },
  ],
};
