import db from "../db.js";


export const create_products_triggers = () => {
  db.run(
    `CREATE TRIGGER IF NOT EXISTS update_products_timestamp 
    AFTER UPDATE ON products
    BEGIN
      UPDATE products 
      SET updated_at = datetime('now','localtime') 
      WHERE id = NEW.id;
    END`,
    (err: any) => {
      if (err) console.error("Error creating products trigger:", err.message);
      else console.log("Products timestamp trigger created.");
    }
  );
};

export const create_customers_triggers = () => {
  db.run(
    `CREATE TRIGGER IF NOT EXISTS update_customers_timestamp 
    AFTER UPDATE ON customers
    BEGIN
      UPDATE customers 
      SET updated_at = datetime('now','localtime') 
      WHERE id = NEW.id;
    END`,
    (err: any) => {
      if (err) console.error("Error creating customers trigger:", err.message);
      else console.log("Customers timestamp trigger created.");
    }
  );
};

export const create_vehicles_triggers = () => {
  db.run(
    `CREATE TRIGGER IF NOT EXISTS update_vehicles_timestamp 
    AFTER UPDATE ON vehicles
    BEGIN
      UPDATE vehicles 
      SET updated_at = datetime('now','localtime') 
      WHERE id = NEW.id;
    END`,
    (err: any) => {
      if (err) console.error("Error creating vehicles trigger:", err.message);
      else console.log("Vehicles timestamp trigger created.");
    }
  );
};

export const create_services_triggers = () => {
  db.run(
    `CREATE TRIGGER IF NOT EXISTS update_services_timestamp 
    AFTER UPDATE ON services
    BEGIN
      UPDATE services 
      SET updated_at = datetime('now','localtime') 
      WHERE id = NEW.id;
    END`,
    (err: any) => {
      if (err) console.error("Error creating services trigger:", err.message);
      else console.log("Services timestamp trigger created.");
    }
  );
};

export const createDeductProductQuantityTrigger = () => {
  const createTriggerSQL = `
    CREATE TRIGGER IF NOT EXISTS deduct_product_quantity
    AFTER INSERT ON service_items
    FOR EACH ROW
    BEGIN
      UPDATE products
      SET quantity = quantity - NEW.quantity
      WHERE id = NEW.product_id;
    END;
  `;

  db.run(createTriggerSQL, (err: any) => {
    if (err) {
      console.error("Error creating trigger:", err);
    } else {
      console.log("Trigger 'deduct_product_quantity' created successfully.");
    }
  });
};
