import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { productsTable } from './products.schema.js';

export const productCratesTable = pgTable(
  'product_crates',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => productsTable.id, { onDelete: 'cascade' }),
    unitsPerCrate: integer('units_per_crate').notNull(),
    cratePrice: doublePrecision('crate_price').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('product_crates_product_id_units_unique').on(
      table.productId,
      table.unitsPerCrate,
    ),
  ],
);

// Backward-compatibility alias
export const productCeretSchema = productCratesTable;

export type ProductCrateRecord = typeof productCratesTable.$inferSelect;
export type NewProductCrate = typeof productCratesTable.$inferInsert;
