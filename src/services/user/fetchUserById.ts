import { eq, getColumns } from "drizzle-orm";
import { DB } from "../../config/dbConnect.js";
import { userTable } from "../../db/schemas/user.schema.js";

export async function fetchUserById(id: string) {
  try {
    // 1. Destructure using the new getColumns helper to omit passwordHash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...columnsWithoutPassword } = getColumns(userTable);

    // 2. Select the remaining columns
    const [user] = await DB.getInstance()
      .select(columnsWithoutPassword)
      .from(userTable)
      .where(eq(userTable.id, id))
      .limit(1);

    if (!user) {
      throw new Error("No User exists with this id");
    }

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch user by id");
  }
}