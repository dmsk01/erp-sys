import sqlite, { RunResult } from 'sqlite3';

function intializeAppDatabase(dbPath: string) {
  // eslint-disable-next-line global-require
  const databaseExists = require('fs').existsSync(dbPath);

  if (!databaseExists) {
    const sqlite3 = sqlite.verbose();
    const db = new sqlite3.Database(dbPath, function (this: RunResult, err) {
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
          isWorking INTEGER NOT NULL,
          isForNetwork INTEGER NOT NULL,
          FOREIGN KEY (docsId) REFERENCES exploitationDocs(id),
          FOREIGN KEY (producerId) REFERENCES producers(id),
          FOREIGN KEY (typeId) REFERENCES equipmentType(id),
          FOREIGN KEY (serviceHistoryId) REFERENCES serviceHistory(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS exploitationDocs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          expoitaitionOrder TEXT NOT NULL,
          sensitiveDataSertificate TEXT NOT NULL,
          hasFormular INTEGER NOT NULL,
          orderToUsageBringingIn TEXT NOT NULL,
          budgetRegisterNumber TEXT,
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

    db.close((err: Error | null) => {
      if (err) {
        return console.error(err.message);
      }
      return undefined;
    });
  }
}

export { intializeAppDatabase };
