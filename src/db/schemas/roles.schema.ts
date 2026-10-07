import { pgEnum, pgTable, uuid } from 'drizzle-orm/pg-core';

export const USER_ROLES = ['Retail', 'Distributor'] as const;

export const roleTypeEnum = pgEnum('role_type', USER_ROLES);

export const rolesTable = pgTable('roles', {
  roleId: uuid('id').defaultRandom().primaryKey(),
  role: roleTypeEnum('role').notNull(),
});
