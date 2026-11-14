import { boolean, doublePrecision, numeric, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { productsTable } from './products.schema.js';


export const productCeretSchema = pgTable('productceret', {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id').notNull().unique().references(() => productsTable.id),
    unitsPerCeret: numeric('unit_per_ceret').notNull(),
    ceretPrice: doublePrecision('ceret_price').notNull(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
})