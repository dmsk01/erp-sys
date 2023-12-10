import { Database, RunResult } from 'sqlite3';
import sqlite3 from 'sqlite3';
import { insertQueryConstructor, updateQueryConstructor } from '../utils';

class BaseService<T extends object> {
  db!: Database;

  constructor(dbFilePath: string) {
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

  protected executeQuery(query: string, values?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.all(query, values, (error, result) => {
        this.db.close();

        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async insert(propsObject: T) {
    const query = insertQueryConstructor(this.getTableName(), propsObject);
    const values = this.mapToDatabase(propsObject);
    const res = await this.executeQuery(query, values);
    return res;
  }

  async getAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.getTableName()}`;
    const res = await this.executeQuery(query);
    return res.map((record: any) => this.mapToInterface(record));
  }

  async update(propsObject: T, id: number) {
    const query = updateQueryConstructor(this.getTableName(), propsObject);
    const values = [...this.mapToDatabase(propsObject), id];
    const res = await this.executeQuery(query, values);
    return res;
  }

  async delete(id: number) {
    const query = `DELETE FROM ${this.getTableName()} WHERE id = ?`;
    const values = [id];
    const res = await this.executeQuery(query, values);
    return res;
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

  protected getTableName(): string {
    throw new Error('Method not implemented');
  }

  protected mapToInterface(record: unknown): T {
    throw new Error('Method not implemented');
  }

  protected mapToDatabase(record: T): unknown[] {
    throw new Error('Method not implemented');
  }
}

export { BaseService };
