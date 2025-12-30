import db from "../db.js";

export const create_labour_type_table = () => {
  db.serialize(() => {
    // Create table
    db.run(
      `CREATE TABLE IF NOT EXISTS labour_type (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
      (err: any) => {
        if (err) console.error("Error creating labour type table:", err.message);
        else console.log("labour type table created or already exists.");
      }
    );
  });
};

export function insertLabourType({ title, description }: { title: string; description: string }) {
  return new Promise((res, rej) => {
    const query = `INSERT INTO labour_type (title, description) VALUES (?, ?)`;
    //@ts-ignore\
    db.run(query, [title, description], function (err: any, row: any) {
      if (err) return rej(err);
      res(row);
    });
  });
}

export function updateLabourTypeDetails({
  title,
  description,
  id,
}: {
  title: string;
  description: string;
  id: number;
}) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE labour_type
      SET
        title = ?,
        description = ?
      WHERE id = ?;
    `;
    db.run(
      query,
      [
        title,
        description,
        id
      ],
      //@ts-ignore
      function (err: any, row: any) {
        if (err) {
          console.error("Error updating product:", err.message);
          return reject(err);
        }
        //@ts-ignore
        resolve(this.changes);
      }
    );
  });
}


export function getAllLabourTypes(limit?: number, offset?: number) {
  return new Promise((resolve, reject) => {
    const dataQuery = `
      SELECT * FROM labour_type
      ${limit ? `LIMIT ${limit} OFFSET ${offset || 0}` : ""}
    `;

    const countQuery = `SELECT COUNT(*) as total FROM labour_type`;

    db.all(dataQuery, [], (err: any, rows: any) => {
      if (err) return reject(err);

      // Get total count
      db.get(countQuery, [], (err2: any, countRow: any) => {
        if (err2) return reject(err2);
        resolve({ data: rows, total: countRow.total });
      });
    });
  });
}


export function searchLabourType({
  search,
  limit,
  offset,
}: {
  search: string;
  limit: number;
  offset: number;
}) {
  return new Promise((resolve, reject) => {
    const wildcard = `%${search}%`;
    // 🔍 PAGINATED QUERY
    const dataQuery = `
    SELECT *
    FROM labour_type
    WHERE title LIKE ?
    LIMIT ? OFFSET ?
    `;
    
    // 🔢 TOTAL COUNT QUERY
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM labour_type
    WHERE title LIKE ?
    `;
    
    // First Get Data
    db.all(dataQuery, [wildcard, limit, offset], (err: any, rows: any[]) => {
      if (err) return reject(err);
      
      // Then Get Total Count
      db.get(countQuery, [wildcard], (err2: any, countRow: any) => {
        if (err2) return reject(err2);
        
        resolve({
          data: rows,
          total: countRow?.total || 0,
        });
      });
    });
  });
}

export function getLabourTypeById(id: number) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM labour_type WHERE id = ?", [id], (err: any, row: any) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}