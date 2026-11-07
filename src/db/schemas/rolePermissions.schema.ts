import { pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { rolesTable } from './roles.schema.js';
import { permissionsTable } from './permissions.schema.js';

export const rolePermissionsTable = pgTable(
  'role_permissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    roleId: uuid('role_id')
      .notNull()
      .references(() => rolesTable.roleId, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissionsTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('role_permissions_role_id_permission_id_unique').on(
      table.roleId,
      table.permissionId
    ),
  ]
);

