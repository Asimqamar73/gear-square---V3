import db from "../db.js";

export const create_service_bill_table = () => {
  db.serialize(() => {
    db.run(
      `
  CREATE TABLE IF NOT EXISTS service_bill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL UNIQUE,
    subtotal_excl_vat DECIMAL(12, 2) NOT NULL CHECK(subtotal_excl_vat >= 0),
    vat_amount DECIMAL(12, 2) NOT NULL CHECK(vat_amount >= 0),
    discount DECIMAL(12, 2) DEFAULT 0.00 CHECK(discount >= 0),
    total DECIMAL(12, 2) NOT NULL CHECK(total >= 0),
    amount_paid DECIMAL(12, 2) DEFAULT 0.00,
    amount_due DECIMAL(12, 2) GENERATED ALWAYS AS (total - COALESCE(amount_paid, 0)) STORED,
    bill_status INTEGER DEFAULT 0,

    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime')),
    
    FOREIGN KEY(service_id) REFERENCES services(id) ON DELETE CASCADE
  )
`,
      (err: any) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Service items table created or already exists.");
      }
    );
    db.run(`CREATE INDEX IF NOT EXISTS idx_service_bill_status ON service_bill(bill_status)`)
  });
};

export function addServiceBill(data: any, service_id: number) {
  return new Promise((res, rej) => {
    const query = `
    INSERT INTO 
    service_bill 
    (service_id, 
    subtotal_excl_vat,
    total,
    vat_amount,
    discount,
    amount_paid,
    bill_status) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(
      query,
      [service_id, data.subtotal, data.total, data.vatAmount, data.discount, data.amountPaid, data.billStatus],
      function (err: any) {
        if (err) return rej(err);
        //@ts-ignore
        res(this.lastID);
      }
    );
  });
}

export async function getServiceBill(id: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM service_bill where service_id = ?", [id], (err: any, rows: any) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
    return rows;
  } catch (error) {
    throw error;
  }
}

export async function UpdateServiceBillPayment(amountPaid: number, billStatus: number, id: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      const query = `
      UPDATE service_bill
      SET
    amount_paid = ?,
    bill_status = ?
      WHERE id = ?;
    `;
      db.run(query, [amountPaid, billStatus, id], (err: any, rows: any) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
    return rows;
  } catch (error) {
    throw error;
  }
}
