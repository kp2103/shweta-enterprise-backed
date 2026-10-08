import { eq } from "drizzle-orm";
import { DB } from "../../config/dbConnect.js";
import { sessionTable } from "../../db/schemas/session.schema.js";

export async function removeSession(id:string)
{
    try {
        const result = await DB.getInstance().delete(sessionTable).where(eq(sessionTable.id,id))

        return result.rowCount !== 0

    } catch (error) {
        if(error instanceof Error)
            throw error;

        throw new Error("fail to remove the session")
    }
}