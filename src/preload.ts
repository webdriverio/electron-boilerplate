// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const isTest = Boolean(process.env.TEST)
if (isTest) {
  // @ts-expect-error
  import('wdio-electron-service/main');
}
