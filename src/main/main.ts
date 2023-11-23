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

function intializeAppDatabase() {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'app.db');
  const databaseExists = require('fs').existsSync(dbPath);
  console.log('DB exist =>>> ', databaseExists);

  if (!databaseExists) {
    const sqlite3 = sqlite.verbose();
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the app database ', dbPath);
    });
    console.log('not exists');

    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS equipment (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          model TEXT NOT NULL,
          docsId INTEGER NOT NULL,
          serialNumber TEXT NOT NULL,
          producerId INTEGER NOT NULL,
          typeId INTEGER NOT NULL,
          assetVariety TEXT,
          warranty TEXT,
          serviceHistoryId INTEGER,
          isWorking INTEGER,
          isForNetwork INTEGER,
          FOREIGN KEY (docsId) REFERENCES exploitationDocs(id),
          FOREIGN KEY (producerId) REFERENCES producers(id),
          FOREIGN KEY (typeId) REFERENCES equipmentType(id),
          FOREIGN KEY (serviceHistoryId) REFERENCES serviceHistory(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS exploitationDocs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          expOrder TEXT,
          sensitiveDataSertificate TEXT,
          hasFormular TEXT,
          budgetRegisterNumber TEXT,
          orderToUsageBringingIn TEXT,
          nameOfSet TEXT,
          comment TEXT,
          FOREIGN KEY (nameOfSet) REFERENCES sets(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS sets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS equipmentType (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS roomsEquipment (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          equipmentId INTEGER,
          roomId INTEGER,
          FOREIGN KEY (equipmentId) REFERENCES equipment(id),
          FOREIGN KEY (roomId) REFERENCES rooms(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT,
          organizationId INTEGER,
          FOREIGN KEY (organizationId) REFERENCES organizations(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS organizations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          contactsInfo TEXT
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS producers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS serviceHistory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          equipmentId INTEGER,
          serviceRequestId INTEGER,
          FOREIGN KEY (equipmentId) REFERENCES equipment(id),
          FOREIGN KEY (serviceRequestId) REFERENCES serviceRequest(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS serviceRequest (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          roomId INTEGER,
          person TEXT,
          individualSerialNumberId TEXT,
          problemDescription TEXT,
          requestNumber TEXT,
          requestPublicDate TEXT,
          advanceDate TEXT,
          fulfilmentDate TEXT,
          FOREIGN KEY (individualSerialNumberId) REFERENCES individualSerialNumbers(id),
          FOREIGN KEY (roomId) REFERENCES rooms(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS individualSerialNumbers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          number INTEGER,
          equipmentId INTEGER,
          FOREIGN KEY (equipmentId) REFERENCES equipment(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS printerInfo (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          equipmentId INTEGER,
          cartridgeModel TEXT,
          cartridgeQuantity INTEGER,
          FOREIGN KEY (equipmentId) REFERENCES equipment(id)
        )
      `);
    });

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      return undefined;
    });
  }
}

// const db = new sqlite3.Database(dbPath, (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Connected to the users database ', dbPath);
// });

// db.run(
//   "CREATE TABLE IF NOT EXISTS equipmentType ('id' INTEGER NOT NULL UNIQUE,'type' TEXT NOT NULL, PRIMARY KEY('id' AUTOINCREMENT))",
//   // 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY UNIQUE, name TEXT NOT NULL, surname TEXT NOT NULL)',
//   function (error) {
//     if (error) {
//       console.log(error);
//       return error;
//     }
//     console.log('DB successfully created');
//     return null;
//   }
// );

// async function handleGetAllUsers(event) {
//   return new Promise((resolve) => {
//     db.all('SELECT * FROM users', (err, rows) => {
//       if (err) {
//         throw new Error(err.message);
//       }
//       resolve(rows);
//       event.reply('dialog:getAllUsers', rows);
//     });
//   });
// }

// async function handleAddUser(user: any) {
//   const { name, surname } = user;
//   return db.run(
//     `INSERT INTO users (name, surname) VALUES(?, ?)`,
//     [name, surname],
//     function (err) {
//       if (err) {
//         console.log(err.message);
//         // if (err = 'SQLITE_ERROR: no such table: users') {
//         //   createTable();
//         // }
//         return err.message;
//       }
//       console.log(`A row has been inserted with rowid ${this.lastID}`);
//       console.log(`${this.changes}`);
//       return this.changes;
//     }
//   );
// }

// const handleFileOpen = (event) => {
//   const focusedWindow = BrowserWindow.getFocusedWindow();
//   if (focusedWindow) {
//     const options = {
//       title: 'Pick an exel file',
//       filters: [{ name: 'Exel files', extensions: ['xlsx'] }],
//     };

//     dialog
//       .showOpenDialog(focusedWindow, options)
//       .then((data) => data.filePaths[0])
//       .then((filePath) => {
//         const workbook = new ExcelJS.Workbook();
//         return workbook.xlsx.readFile(filePath);
//       })
//       .then((exelWorkbook) => {
//         const result = [];
//         // console.log(exelWorkbook.constructor.name, '======>', exelWorkbook)
//         const worksheet = exelWorkbook.getWorksheet(1);
//         worksheet?.eachRow({ includeEmpty: true }, function (row, rowNumber) {
//           const currRow = worksheet.getRow(rowNumber);
//           const user = {
//             name: currRow.getCell(1).value,
//             surname: currRow.getCell(2).value,
//           };
//           result.push(user);

//           // row.eachCell(function(cell, colNumber){
//           //   console.log(cell);
//           // })
//         });
//         console.log(result);
//         event.reply('dialog:fileOpened', result);

//         return result;
//         // worksheet?.columns.forEach(col => {
//         //   col.eachCell({ includeEmpty: true }, function(cell, rowNumber) {
//         //     console.log(JSON.stringify(cell.value))
//         //   });
//         // })
//       })
//       .catch((err) => console.log(err));
//   }
// };

// const addEquipmentType = (type: string) => {
//   const db = new sqlite3.Database(dbPath, (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Connected to the users database ', dbPath);
//   });
//   db.run(
//     'INSERT INTO equipmentType (type) VALUES (?);',
//     [type],
//     function (error) {
//       if (error) {
//         console.log(error);
//         return error;
//       }
//       console.log('Data successfully added to DB');
//       return null;
//     }
//   );
// };

// ipcMain.on('dialog:getAllUsers', (event) => handleGetAllUsers(event));
// ipcMain.on('dialog:addUser', (_event, [user]) => handleAddUser(user));
// ipcMain.on('dialog:openFile', (event) => handleFileOpen(event));
// ipcMain.handle('add-equipment-type', async (event, type) => {
//   const result = await addEquipmentType(type);
//   return result;
// });
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
    intializeAppDatabase();
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
