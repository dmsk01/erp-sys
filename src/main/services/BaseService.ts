import { Database, RunResult } from 'sqlite3';
import {
  createTransaction,
  getAllTransaction,
  updateTransaction,
  deleteTransaction,
} from '../transactions';

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
  }

  getAll() {
    return getAllTransaction(this.db, this.tableName);
  }

  update(id: number, propObject: Record<string, string>) {
    return updateTransaction(id, this.db, this.tableName, propObject);
  }

  delete(id: number) {
    return deleteTransaction(id, this.db, this.tableName);
  }

  close(): void {
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
