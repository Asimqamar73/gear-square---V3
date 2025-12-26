import db from "../db.js";
import { create_products_triggers } from "../triggers/triggers.js";

export const create_products_table = () => {
  db.serialize(() => {
    // Create table
    db.run(
      `CREATE TABLE IF NOT EXISTS products (

          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          image TEXT,
          cost_price DECIMAL(12, 2) CHECK(cost_price >= 0),
          retail_price_incl_vat DECIMAL(12, 2) CHECK(retail_price_incl_vat >= 0),
          vat_rate DECIMAL(5, 2) DEFAULT 5.00 CHECK(vat_rate >= 0 AND vat_rate <= 100),
          sku TEXT UNIQUE,
          part_number TEXT UNIQUE,
          quantity INTEGER DEFAULT 0,
          created_at TEXT DEFAULT (datetime('now','localtime')),
          created_by INTEGER,
          updated_at TEXT DEFAULT (datetime('now','localtime')),
          updated_by INTEGER,
          FOREIGN KEY(created_by) REFERENCES users(id),
          FOREIGN KEY(updated_by) REFERENCES users(id)
    )`,
      (err: any) => {
        if (err) console.error("Error creating products table:", err.message);
        else console.log("Products table created or already exists.");
      }
    );

    // Create indexes (will execute after table creation)
    db.run(`CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_products_part_number ON products(part_number)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by)`);
  });
  create_products_triggers();
};

export const create_product_prices_view = () => {
  db.run(
    `CREATE VIEW IF NOT EXISTS v_product_prices AS
    SELECT 
      id,
      name,
      image,
      sku,
      retail_price_incl_vat,
      ROUND(retail_price_incl_vat / (1.0 + vat_rate/100.0), 2) as retail_price_excl_vat,
      ROUND(retail_price_incl_vat - (retail_price_incl_vat / (1.0 + vat_rate/100.0)), 2) as vat_amount,
      vat_rate,
      quantity,
      cost_price,
      part_number
    FROM products`,
    (err: any) => {
      if (err) console.error("Error creating product prices view:", err.message);
      else console.log("Product prices view created or already exists.");
    }
  );
};

export function insertProductToDatabase({
  name,
  description,
  costPrice,
  retailPriceInclVAT,
  sku,
  partNumber,
  quantity,
  filePath,
  createdBy,
  updatedBy,
}: {
  name: string;
  description: string;
  costPrice: number;
  retailPriceInclVAT: number;
  sku: number;
  partNumber: string;
  quantity: number;
  filePath: string;
  createdBy: number;
  updatedBy: number;
}) {
  return new Promise((res, rej) => {
    const query = `INSERT INTO products (name, description, cost_price, retail_price_incl_vat, sku, part_number, quantity, image, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    //@ts-ignore\
    db.run(
      query,
      [
        name,
        description,
        costPrice,
        retailPriceInclVAT,
        sku,
        partNumber,
        quantity,
        filePath,
        createdBy,
        updatedBy,
      ],
      function (err: any, row: any) {
        if (err) return rej(err);
        res(row);
      }
    );
  });
}

export function updateProductDetails({
  name,
  description,
  cost_price,
  retail_price_incl_vat,
  sku,
  part_number,
  quantity,
  filePath,
  updatedBy,
  id,
}: {
  name: string;
  description: string;
  cost_price: number;
  retail_price_incl_vat: number;
  sku: number;
  part_number: string;
  quantity: number;
  filePath: string;
  updatedBy: number;
  id: number;
}) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE products
      SET
        name = ?,
        description = ?,
        cost_price = ?,
        retail_price_incl_vat = ?, 
        part_number = ?,
        quantity = ?,
        sku = ?,
        image = ?,
        updated_by = ?
      WHERE id = ?;
    `;
    db.run(
      query,
      [
        name,
        description,
        cost_price,
        retail_price_incl_vat,
        part_number,
        quantity,
        sku,
        filePath,
        updatedBy,
        id,
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

export function updateProductStock({ quantity, id }: { quantity: number; id: number }) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE products
      SET
        quantity = ?
      WHERE id = ?;
    `;
    db.run(query, [quantity, id], (err: any, rows: any) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function getAllProducts(limit?: number, offset?: number) {
  return new Promise((resolve, reject) => {
    const dataQuery = `
      SELECT * FROM v_product_prices
      ${limit ? `LIMIT ${limit} OFFSET ${offset || 0}` : ""}
    `;

    const countQuery = `SELECT COUNT(*) as total FROM products`;

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

export function getproductById(id: number) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM v_product_prices WHERE id = ?", [id], (err: any, row: any) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function searchProduct({
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
      FROM products
      WHERE name LIKE ?
         OR sku LIKE ?
         OR part_number LIKE ?
      LIMIT ? OFFSET ?
    `;

    // 🔢 TOTAL COUNT QUERY
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM products
      WHERE name LIKE ?
         OR sku LIKE ?
         OR part_number LIKE ?
    `;

    // First Get Data
    db.all(dataQuery, [wildcard, wildcard, wildcard, limit, offset], (err: any, rows: any[]) => {
      if (err) return reject(err);

      // Then Get Total Count
      db.get(countQuery, [wildcard, wildcard, wildcard], (err2: any, countRow: any) => {
        if (err2) return reject(err2);

        resolve({
          data: rows,
          total: countRow?.total || 0,
        });
      });
    });
  });
}
