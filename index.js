'use strict';

var electron = require('electron');
var {app, BrowserWindow, globalShortcut, Menu, Tray} = electron;
var ipc = require('electron').ipcMain;
var configuration = require('./configuration');
var mainWindow = null;
let tray = null;
var path = require('path');
var url = require('url');


function createMainWindow() {
  if (!configuration.readSettings('shortcutKeys')) {
    configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
  }

  mainWindow = new BrowserWindow({
    title: 'Sound Machine',
    icon: (path.join(__dirname, 'app/img/app-icon.png')),
    frame: false,
    height: 540,
    resizable: false,
    width: 368
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  setGlobalShortcuts();

  if (process.platform === 'darwin') {
    tray = new Tray(path.join(__dirname, 'app/img/app-icon.png'));
  } else {
    tray = new Tray(path.join(__dirname, 'app/img/app-icon.png'));
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Sound Machine', enabled: false },
    { type: 'separator' },
    {
      label: 'Settings',
      click: createSettingWindow
    },
    {
      label: 'Help',
      click: createAboutWindow
    },
    { type: 'separator' },
    { label: 'Quit', click: app.quit }
  ])
  tray.setToolTip('Sound Machine')
  tray.setContextMenu(contextMenu)

}


app.on('ready', createMainWindow);

var settingsWindow = null;
function createSettingWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    frame: false,
    height: 220,
    resizable: false,
    width: 200
  });

  settingsWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/settings.html'),
    protocol: 'file:',
    slashes: true
  }));

  settingsWindow.on('closed', function () {
    settingsWindow = null;
  });
}

ipc.on('open-settings-window', createSettingWindow);

var aboutWindow = null;
function createAboutWindow() {
  if (aboutWindow) {
    aboutWindow.focus();
    return;
  }

  aboutWindow = new BrowserWindow({
    frame: false,
    height: 230,
    resizable: false,
    width: 200
  });

  aboutWindow.loadURL('file://' + __dirname + '/app/about.html');

  aboutWindow.on('closed', function () {
    aboutWindow = null;
  });
}

ipc.on('open-about-window', createAboutWindow);

ipc.on('close-about-window', function () {
  if (aboutWindow) {
    aboutWindow.close();
    aboutWindow = null;
  }
});

ipc.on('close-settings-window', function () {
  if (settingsWindow) {
    settingsWindow.close();
    settingsWindow = null;
  }
});

ipc.on('set-global-shortcuts', function () {
  setGlobalShortcuts();
});

ipc.on('close-main-window', function () {
  app.quit();
});

function setGlobalShortcuts() {
  globalShortcut.unregisterAll();

  var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
  var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

  /*
  // Implement shortcut binding in a loop
      for (var i = 0; i <= 7; i++) {
          globalShortcut.register((shortcutPrefix + i + 1), function () {
              mainWindow.webContents.send('global-shortcut', i);
          });
      }
  */

  globalShortcut.register(shortcutPrefix + '1', function () {
    mainWindow.webContents.send('global-shortcut', 0);
  });
  globalShortcut.register(shortcutPrefix + '2', function () {
    mainWindow.webContents.send('global-shortcut', 1);
  });
  globalShortcut.register(shortcutPrefix + '3', function () {
    mainWindow.webContents.send('global-shortcut', 2);
  });
  globalShortcut.register(shortcutPrefix + '4', function () {
    mainWindow.webContents.send('global-shortcut', 3);
  });
  globalShortcut.register(shortcutPrefix + '5', function () {
    mainWindow.webContents.send('global-shortcut', 4);
  });
  globalShortcut.register(shortcutPrefix + '6', function () {
    mainWindow.webContents.send('global-shortcut', 5);
  });
  globalShortcut.register(shortcutPrefix + '7', function () {
    mainWindow.webContents.send('global-shortcut', 6);
  });
  globalShortcut.register(shortcutPrefix + '8', function () {
    mainWindow.webContents.send('global-shortcut', 7);
  });

}
