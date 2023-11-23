import { Equipment } from 'main/types';
import { RunResult } from 'sqlite3';

const sqlite3 = require('sqlite3').verbose();

class EquipmentService {
  db!: RunResult;

  constructor(dbFilePath: string) {
    console.log(dbFilePath);

    this.db = new sqlite3.Database(dbFilePath, function (
      this: RunResult,
      err: Error | null
    ) {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the app database ', dbFilePath);
    });
  }

  createEquipment(equipmentObject: Equipment) {
    const {
      model,
      docsId,
      serialNumber,
      producerId,
      typeId,
      assetVariety,
      warranty,
      serviceHistory,
      isWorking,
      isForNetwork,
    } = equipmentObject;

    return new Promise((resolve, reject) => {
      this.db.run(
        `
        INSERT INTO equipment (
          model,
          docsId,
          serialNumber,
          producerId,
          typeId,
          assetVariety,
          warranty,
          serviceHistory,
          isWorking,
          isForNetwork)
        VALUES(?,?,?,?,?,?,?,?,?,?)
      `,
        [
          model,
          docsId,
          serialNumber,
          producerId,
          typeId,
          assetVariety,
          warranty,
          serviceHistory,
          isWorking,
          isForNetwork,
        ],
        function (this: RunResult, err: Error | null) {
          if (err) {
            console.error(`Error creating equipment: ${err.message}`);
            reject(err);
          } else {
            console.log(`Equipment created with ID: ${this.lastID}`);
            resolve(this.lastID);
          }
        }
      );
    });
  }

  getAllEquipment() {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM equipment',
        (err: Error | null, rows: Equipment[]) => {
          if (err) {
            console.error(`Error getting equipment: ${err.message}`);
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  updateEquipment(id: number, equipmentObject: Equipment) {
    const {
      model,
      docsId,
      serialNumber,
      producerId,
      typeId,
      assetVariety,
      warranty,
      serviceHistory,
      isWorking,
      isForNetwork,
    } = equipmentObject;
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        `
        UPDATE equipment SET
          model=?,
          docsId=?,
          serialNumber=?,
          producerId=?,
          typeId=?,
          assetVariety=?,
          warranty=?,
          serviceHistory=?,
          isWorking=?,
          isForNetwork=?
        WHERE id=?
      `,
        [
          model,
          docsId,
          serialNumber,
          producerId,
          typeId,
          assetVariety,
          warranty,
          serviceHistory,
          isWorking,
          isForNetwork,
        ],
        (err: Error | null) => {
          if (err) {
            console.error(`Error updating equipment: ${err.message}`);
            reject(err);
          } else {
            console.log(`Equipment updated with ID: ${id}`);
            resolve();
          }
        }
      );
    });
  }

  deleteEquipment(id: number) {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        `DELETE FROM equipment WHERE id=?`,
        [id],
        (err: Error | null) => {
          if (err) {
            console.error(`Error deleting equipment: ${err.message}`);
            reject(err);
          } else {
            console.log(`Equipment deleted with ID: ${id}`);
            resolve();
          }
        }
      );
    });
  }

  close() {
    this.db.close((err: Error | null) => {
      if (err) {
        console.error(`Error closing the database: ${err.message}`);
      } else {
        console.log('Closed the database connection');
      }
    });
  }
}

export { EquipmentService };
