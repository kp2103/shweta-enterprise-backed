import { boolean, doublePrecision, numeric, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const PRODUCT_UNIT = ['ml', "litre", "kg", "packet", "piece"] as const
export const PRODUCT_CATEGORIES = [
    'milk',
    'curd',
    'paneer',
    'ghee',
    'butter',
    'buttermilk',
    'cream',
    'other',
] as const;

export const productCategoryEnum = pgEnum('product_category', PRODUCT_CATEGORIES);

export const productUnitEnum = pgEnum('productUnitEnum', PRODUCT_UNIT)

export const productsTable = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 50 }).unique().notNull(),
    description: varchar('description', { length: 255 }),
    unit: productUnitEnum('unit').notNull(),
    // must be in the paise
    price: doublePrecision('price').notNull(),
    // must be in the ml 
    quantity: doublePrecision('quantity').notNull(),
    imageUrl: varchar('image_url', { length: 255 }),
    category: productCategoryEnum('product_category').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
})

export type ProductRecord = typeof productsTable.$inferInsert 