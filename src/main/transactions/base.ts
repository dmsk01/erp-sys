import { Database, RunResult } from 'sqlite3';
import { insertQueryConstructor, updateQueryConstructor } from '../utils';

function insertTransaction<T extends object>(
  db: Database,
  tableName: string,
  propsObject: T
) {
  // const query = insertQueryConstructor(tableName, propsObject);
  // const values = [...Object.values(propsObject)];
  // this.executeQuery(query, values);
  // return new Promise((resolve, reject) => {
  //   db.run(
  //     insertQueryConstructor(tableName, propsObject),
  //     [...Object.values(propsObject)],
  //     function (this: RunResult, err: Error | null) {
  //       if (err) {
  //         console.error(`Error creating: ${err.message}`);
  //         reject(err);
  //       } else {
  //         console.log(`Created with ID: ${this.lastID}`);
  //         resolve(this.lastID);
  //       }
  //     }
  //   );
  // });
}

function updateTransaction<T extends object>(
  id: number,
  db: Database,
  tableName: string,
  propsObject: T
) {
  return new Promise((resolve, reject) => {
    db.run(
      updateQueryConstructor(tableName, propsObject),
      [...Object.values(propsObject), id],
      function (this: RunResult, err: Error | null) {
        if (err) {
          console.error(`Error updating: ${err.message}`);
          reject(err);
        } else {
          console.log(`Updated with ID: ${this.lastID}`);
          resolve(this.lastID);
        }
      }
    );
  });
}

function getAllTransaction(db: Database, tableName: string) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, (err: Error | null, rows: any[]) => {
      if (err) {
        console.error(`Error getting: ${err.message}`);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function deleteTransaction(id: number, db: Database, tableName: string) {
  return new Promise<void>((resolve, reject) => {
    db.run(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [id],
      (err: Error | null) => {
        if (err) {
          console.error(`Error deleting: ${err.message}`);
          reject(err);
        } else {
          console.log(`Deleted with ID: ${id}`);
          resolve();
        }
      }
    );
  });
}

export {
  insertTransaction,
  updateTransaction,
  getAllTransaction,
  deleteTransaction,
};
