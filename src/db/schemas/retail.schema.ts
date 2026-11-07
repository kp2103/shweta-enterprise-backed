// when we create an retail then also create an user as well but implemement the 

// first create an user then create an retail and take an reference of the the user id

import { boolean, doublePrecision, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema.js';

export const retailTable = pgTable('retailers', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull(),
  shopName: varchar('shop_name', { length: 150 }).notNull(),
  gstNo: varchar('gst_no'),
  phone: varchar('phone', { length: 20 }).notNull(),
  shopPhotoUrl: varchar('shop_photo_url', { length: 255 }),

  // Address Info
  address: text('address').notNull(),
  postalCode: varchar('postal_code', { length: 10 }).notNull(),
  area: varchar('area', { length: 25 }).notNull(),
  city: varchar('city', { length: 50 }).notNull(),

  // GPS coordinates — nullable
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),

  // Retail status active or inactive
  isActive: boolean('is_active').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
