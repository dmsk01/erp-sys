import { Producer } from 'main/types';
import { Database, RunResult } from 'sqlite3';
import { BaseService } from './BaseService';

// const sqlite3 = require('sqlite3').verbose();

class ProducersService extends BaseService {
  constructor(dbFilePath: string) {
    super(dbFilePath, 'producers');
  }
}
// class ProducersService {
//   db!: Database;

//   constructor(dbFilePath: string) {
//     console.log(dbFilePath);

//     this.db = new sqlite3.Database(dbFilePath, function (
//       this: RunResult,
//       err: Error | null
//     ) {
//       if (err) {
//         console.error(err.message);
//       }
//       console.log('Connected to the app database ', dbFilePath);
//     });
//   }

//   create(propsObject: Producer) {
//     const { name } = propsObject;
//     return new Promise((resolve, reject) => {
//       this.db.run(
//         `INSERT INTO producers (name) VALUES(?)`,
//         [name],
//         function (this: RunResult, err: Error | null) {
//           if (err) {
//             console.error(`Error creating equipment: ${err.message}`);
//             reject(err);
//           } else {
//             console.log(`Producer created with ID: ${this.lastID}`);
//             resolve(this.lastID);
//           }
//         }
//       );
//     });
//   }

//   getAll() {
//     return new Promise((resolve, reject) => {
//       this.db.all(
//         'SELECT * FROM producers',
//         (err: Error | null, rows: Producer[]) => {
//           if (err) {
//             console.error(`Error getting equipment: ${err.message}`);
//             reject(err);
//           } else {
//             resolve(rows);
//           }
//         }
//       );
//     });
//   }

//   update(id: number, producerObject: Producer) {
//     const { name } = producerObject;
//     return new Promise<void>((resolve, reject) => {
//       this.db.run(
//         `UPDATE producers SET name = ? WHERE id = ?`,
//         [name],
//         (err: Error | null) => {
//           if (err) {
//             console.error(`Error updating equipment: ${err.message}`);
//             reject(err);
//           } else {
//             console.log(`Producer updated with ID: ${id}`);
//             resolve();
//           }
//         }
//       );
//     });
//   }

//   delete(id: number) {
//     return new Promise<void>((resolve, reject) => {
//       this.db.run(
//         `DELETE FROM producers WHERE id = ?`,
//         [id],
//         (err: Error | null) => {
//           if (err) {
//             console.error(`Error deleting equipment: ${err.message}`);
//             reject(err);
//           } else {
//             console.log(`Producer deleted with ID: ${id}`);
//             resolve();
//           }
//         }
//       );
//     });
//   }

//   close() {
//     this.db.close((err: Error | null) => {
//       if (err) {
//         console.error(`Error closing the database: ${err.message}`);
//       } else {
//         console.log('Closed the database connection');
//       }
//     });
//   }
// }

export { ProducersService };
