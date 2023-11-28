import { Database, RunResult } from 'sqlite3';
import { insertQueryConstructor } from '../utils';

function createTransaction(
  db: Database,
  tableName: string,
  propsObject: Record<string, string>
) {
  return new Promise((resolve, reject) => {
    db.run(
      insertQueryConstructor(tableName, propsObject),
      [...Object.values(propsObject)],
      function (this: RunResult, err: Error | null) {
        if (err) {
          console.error(`Error creating: ${err.message}`);
          reject(err);
        } else {
          console.log(`Created with ID: ${this.lastID}`);
          resolve(this.lastID);
        }
      }
    );
  });
}

export { createTransaction };
