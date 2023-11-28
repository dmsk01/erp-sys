import { Producer } from 'main/types';
import { Database, RunResult } from 'sqlite3';
import { createTransaction } from '../transactions';

const sqlite3 = require('sqlite3').verbose();

class BaseService {
  db!: Database;

  tableName: string;

  constructor(dbFilePath: string, tableName: string) {
    this.tableName = tableName;

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

  create(propsObject: Record<string, string>) {
    return createTransaction(this.db, this.tableName, propsObject);
    // const objKeys = Object.keys(propsObject);
    // const propsFields = `(${objKeys.join(',')})`;
    // const questionMarks = objKeys.reduce((prev, cur, index, array) => {
    //   const querySymbol = index === array.length - 1 ? '?' : '?, ';
    //   const res = prev + querySymbol;
    //   return res;
    // }, '');
    // return new Promise((resolve, reject) => {
    //   this.db.run(
    //     `INSERT INTO ${this.tableName} ${propsFields} VALUES(${questionMarks})`,
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

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ${this.tableName}`,
        (err: Error | null, rows: Producer[]) => {
          if (err) {
            console.error(`Error getting: ${err.message}`);
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  update(id: number, propObject: Record<string, string>) {
    const updatedFields = Object.keys(propObject).reduce(
      (prev, cur, index, array) => {
        const querySymbol = index === array.length - 1 ? '=? ' : '=?, ';
        const curEl = cur + querySymbol;
        const res = prev + curEl;
        return res;
      },
      ''
    );

    return new Promise<void>((resolve, reject) => {
      this.db.run(
        `UPDATE ${this.tableName} SET ${updatedFields} WHERE id=?`,
        [...Object.values(propObject), id],
        (err: Error | null) => {
          if (err) {
            console.error(`Error updating: ${err.message}`);
            reject(err);
          } else {
            console.log(`Updated with ID: ${id}`);
            resolve();
          }
        }
      );
    });
  }

  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        `DELETE FROM ${this.tableName} WHERE id = ?`,
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

export { BaseService };
