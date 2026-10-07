import type { Request ,Response} from "express";
import type { ApiResponse } from "../../types/api-response.types.js";
import { DB } from "../../config/dbConnect.js";
import { logError } from "../../utils/logs.util.js";
import { rolesTable } from "../../db/schemas/roles.schema.js";

export async function getUsersRoles(req:Request,res : Response<ApiResponse>)
{
    try {
        const userRoles = (await DB.getInstance().select().from(rolesTable))

        return res.status(200).json({
            success : true,
            message : "User Roles retrived successfully",
            data : {
                userRoles
            }
        })

    } catch (error) {
        logError('get user roles controller',error);
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}