import type { NextFunction, Request, Response } from "express";
import type { ApiResponse } from "../types/api-response.types.js";
import { verifyAccessToken } from "../utils/token.utils.js";

export async function authMiddleware(req : Request,res:Response<ApiResponse>,next : NextFunction)
{
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if(!accessToken)
    {
        return res.status(401).json({
            success : false,
            message : "Unauthorized acess"
        })
    }

    const decoded = verifyAccessToken(accessToken)

    if(!decoded)
    {
        return res.status(403).json({
            success : false,
            message : 'Invalid token'
        })
    }

    req.user  = {
        id : decoded.userId,
        sessionId : decoded.sessionId
    };

    next();
}