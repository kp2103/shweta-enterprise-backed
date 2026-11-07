import { z } from 'zod';
import { USER_ROLES } from '../../db/schemas/roles.schema.js';

export const roleSchema = z.enum(USER_ROLES, {
  message: `Role must be one of: ${USER_ROLES.join(', ')}`,
});

// Backward compatibility alias
export const roleValidator = roleSchema;
export type RoleSchema = z.infer<typeof roleSchema>;
