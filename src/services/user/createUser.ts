import { DB } from '../../config/dbConnect.js';
import { userTable } from '../../db/schemas/user.schema.js';
import { rolesTable, USER_ROLES } from '../../db/schemas/roles.schema.js';
import { eq } from 'drizzle-orm';
import { generateHash } from '../../utils/bcrypt.utils.js';
import { logError } from '../../utils/logs.util.js';

interface User {
  fullName: string;
  email: string;
  role: (typeof USER_ROLES)[number];
  password: string;
  avatarURL?: string;
}

export async function createUser({ email, fullName, role, password, avatarURL }: User) {
  try {
    // Look up the role ID
    let roleObj = (
      await DB.getInstance()
        .select({
          roleId: rolesTable.roleId,
        })
        .from(rolesTable)
        .where(eq(rolesTable.role, role))
    )[0];

    // Fallback between legacy and uppercase names
    if (!roleObj) {
      const fallbackRole =
        role === ('Retail' as any)
          ? 'RETAILER'
          : role === 'RETAILER'
            ? ('Retail' as any)
            : role === ('Distributor' as any)
              ? 'DISTRIBUTOR'
              : role === 'DISTRIBUTOR'
                ? ('Distributor' as any)
                : null;

      if (fallbackRole) {
        roleObj = (
          await DB.getInstance()
            .select({
              roleId: rolesTable.roleId,
            })
            .from(rolesTable)
            .where(eq(rolesTable.role, fallbackRole))
        )[0];
      }
    }

    if (!roleObj) throw new Error(`Failed to fetch the role: ${role}`);

    const hashedPassword = await generateHash(password);

    const user = (
      await DB.getInstance()
        .insert(userTable)
        .values({
          email,
          fullName,
          roleId: roleObj.roleId,
          passwordHash: hashedPassword,
          avatarURL: avatarURL ?? null,
        })
        .returning({
          id: userTable.id,
          email: userTable.email,
          fullName: userTable.fullName,
          createdAt: userTable.createdAt,
        })
    )[0];

    if (!user) throw new Error('Failed to create user');

    return user;
  } catch (error) {
    logError('create user service', error);
    return null;
  }
}
