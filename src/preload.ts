// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const isTest = process.env.NODE_ENV === 'test'
if (isTest) {
  // @ts-expect-error
  import('wdio-electron-service/preload')
}
