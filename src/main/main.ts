/* eslint global-require: off, no-console: off, promise/always-return: off */
import path from 'path';
import electron, { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import sqlite from 'sqlite3';
import ExcelJS from 'exceljs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

app.disableHardwareAcceleration();

// ============================================================================================================================
const sqlite3 = sqlite.verbose();

const userDataPath = (electron.app).getPath('userData');
const dbPath = path.join(userDataPath, 'app.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the users database ', dbPath);
});

db.run(
  'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY UNIQUE, name TEXT NOT NULL, surname TEXT NOT NULL)',
  function (error) {
    if (error) {
      console.log(error);
      return error;
    }
    console.log('DB successfully created');
    return null;
  }
);

async function handleGetAllUsers(event) {
  return new Promise((res) => {
    db.all('SELECT * FROM users', (err, rows) => {
      if(err){
        throw new Error(err.message)
      }
      res(rows);
      event.reply('dialog:getAllUsers', rows);
    });
  });
}

async function handleAddUser( user: any) {
  const { name, surname } = user;
  return db.run(
    `INSERT INTO users (name, surname) VALUES(?, ?)`,
    [name, surname],
    function (err) {
      if (err) {
        console.log(err.message);
        // if (err = 'SQLITE_ERROR: no such table: users') {
        //   createTable();
        // }
        return err.message;
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      console.log(`${this.changes}`);
      return this.changes;
    }
  );
}

const handleFileOpen = (event)=>{
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if(focusedWindow){
    const options = {
      title: 'Pick an exel file',
      filters: [
        { name: 'Exel files', extensions: ['xlsx'] },
      ]
    };

    dialog.showOpenDialog(focusedWindow, options)
    .then((data) => 
       data.filePaths[0]
    )
    .then(filePath => {
      const workbook = new ExcelJS.Workbook();
      return workbook.xlsx.readFile(filePath);
    })
    .then(exelWorkbook=>{
      const result = [];
      // console.log(exelWorkbook.constructor.name, '======>', exelWorkbook)
      const worksheet = exelWorkbook.getWorksheet(1);
      worksheet?.eachRow({ includeEmpty: true }, function(row, rowNumber){
        const currRow = worksheet.getRow(rowNumber);
        const user = { name: currRow.getCell(1).value, surname: currRow.getCell(2).value }
        result.push(user);
        
        // row.eachCell(function(cell, colNumber){
        //   console.log(cell);
        // })
      })
      console.log(result);
      event.reply('dialog:fileOpened', result);
      
      return result;
      // worksheet?.columns.forEach(col => {
      //   col.eachCell({ includeEmpty: true }, function(cell, rowNumber) {
      //     console.log(JSON.stringify(cell.value))
      //   });
      // }) 
    })
    .catch(err => console.log(err))
  }
}

ipcMain.on('dialog:getAllUsers', (event) => handleGetAllUsers(event));
ipcMain.on('dialog:addUser', (_event, [user]) => handleAddUser(user));
ipcMain.on('dialog:openFile', (event) => handleFileOpen(event));
// ============================================================================================================================
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// Exel ==================================================+=============



// const getFileFromUser = ([targetWindow]) => {
//   const files = dialog.showOpenDialog(targetWindow, {
//     properties: ['openFile'],
//     // filters: [
//     //   { name: 'Text Files', extensions: ['txt'] },
//     //   { name: 'Markdown Files', extensions: ['md', 'markdown'] }
//     // ]
//     });
//     console.log(files);
//   // if (files) { openFile(targetWindow, files[0]); }
// };

// ipcMain.on('dialog:openFile', async (event, arg) => {
//   getFileFromUser(arg);
  
//   // event.reply('ipc-example', msgTemplate('pong'));
// });

// const openFile = exports.openFile = (targetWindow, file) => {
//   const content = fs.readFileSync(file).toString();
//   targetWindow.webContents.send('file-opened', file, content);
//  };
// await workbook.xlsx.readFile(filename);
