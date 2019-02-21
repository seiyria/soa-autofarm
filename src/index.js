import { app, BrowserWindow, ipcMain } from 'electron';

import { stop, run, replkeycall, updateOptions } from './cli';

import Config from 'electron-config';
const config = new Config();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if(require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {

  const opts = { 
    show: false,
    minWidth: 640,
    minHeight: 480,
    webPreferences: {
      nodeIntegration: true
    }
  };

  Object.assign(opts, config.get('winBounds'));

  if(!opts.width) opts.width = 640;
  if(!opts.height) opts.height = 480;

  // Create the browser window.
  mainWindow = new BrowserWindow(opts);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/page.html`);

  mainWindow.on('close', () => {
    config.set('winBounds', mainWindow.getBounds());
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', mainWindow.show);
  mainWindow.setMenu(null);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// run the autoer
ipcMain.on('run', (window, options) => {
  mainWindow.webContents.send('running');
  run({ 
    onStatus: (status) => mainWindow.webContents.send('status', status),
    onFail: (err) => mainWindow.webContents.send('stopped', err || true), 
    edge: require('electron-edge-js'),
    options
  });
});

// live-update the options
ipcMain.on('options', (window, options) => {
  updateOptions(options);
});

// "replkey" functions (normallty typed into term, but that is not avail here)
ipcMain.on('replkey', (window, key) => {
  replkeycall(key);
});

// stop running the autoer
ipcMain.on('stop', () => {
  stop();
  mainWindow.webContents.send('stopped');
});