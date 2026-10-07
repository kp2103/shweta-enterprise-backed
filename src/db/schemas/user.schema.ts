import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { rolesTable } from './roles.schema.js';


export const userTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 25 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  fullName: varchar('full_name', { length: 70 }).notNull(),
  avatarURL: varchar('avatar_url', { length: 255 }),
  roleId: uuid('role_id')
    .notNull()
    .references(() => rolesTable.roleId),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
