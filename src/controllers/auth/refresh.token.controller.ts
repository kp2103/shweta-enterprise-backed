import type { Request,Response } from "express";
import type { ApiResponse } from "../../types/api-response.types.js";
import { logError } from "../../utils/logs.util.js";
import { DB } from "../../config/dbConnect.js";
import { sessionTable } from "../../db/schemas/session.schema.js";
import { and, eq } from "drizzle-orm";
import { generateHash } from "../../utils/bcrypt.utils.js";
import { generateAccessToken } from "../../utils/token.utils.js";

interface RefreshTokensBody
{
    refreshToken : string
}

export async function refreshTokens(req:Request<null,null,RefreshTokensBody>,res:Response<ApiResponse>) {
    try {
        // how to get teh refresh token
        const {refreshToken} = req.body
        
        console.log("refersh token is called")
        if(!refreshToken)
        {
            return res.status(400).json({
                success : false,
                message : "Required fields are missing"
            })
        }

        const hashedRefreshToken = await generateHash(refreshToken)
        // check for any session is active for this token 
        const session = (await DB.getInstance().select().from(sessionTable).where(
            and(
                eq(sessionTable.refreshTokenHash,hashedRefreshToken),
                eq(sessionTable.isRevoked,false)
            )
        ))[0]
        
        // if not logout
        if(!session)
        {
            throw new Error("Fail to create an session")
        }

        // if yes then create and new accessToken based on that session 
        const accessToken  = generateAccessToken({
            sessionId : session.id,
            userId : session.userId
        })

        return res.status(201).json({
            success : true,
            message : "New Access token is created",
            data :{
                accessToken
            }
        })

    } catch (error) {
        logError('refresh token controller',error)

        return res.status(500).json({
            success : false,
            message : "Internal Server error"
        })
    }
}