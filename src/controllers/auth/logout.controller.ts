import type { Request, Response } from "express";
import type { ApiResponse } from "../../types/api-response.types.js";
import { logError } from "../../utils/logs.util.js";
import { removeSession } from "../../services/sessions/removeSession.js";
import { getTokenRemainingLife } from "../../utils/token.utils.js";
import { redisClient } from "../../config/redis.js";

interface LogoutRequestBody {
    refreshToken: string;
}

const REDIS_BLACKLIST_TOKEN_KEY = `shweta-enterprise:bl:tokens`;

export async function logout(req: Request<unknown, null, LogoutRequestBody>, res: Response<ApiResponse>) {
    try {
        const userInfo = req.user;
        
        if (!userInfo) {
            return res.status(403).json({
                success: false,
                message: "User object is invalid"
            });
        }

        // 1. Remove the refresh token/session from the database
        // Added 'await' here assuming removeSession is an async DB operation
        const isRemoved = await removeSession(userInfo.sessionId);

        if (!isRemoved) {
            throw new Error("Failed to remove the session from database");
        }

        // 2. Calculate remaining life of the Access Token
        const tokenLife = getTokenRemainingLife(userInfo.accessTokenExpireAt);

        // 3. Blacklist the Access Token in Redis
        if (tokenLife.remainingSeconds > 0) {
            const blacklisted = await redisClient.set(
                `${REDIS_BLACKLIST_TOKEN_KEY}:${userInfo.accessTokenId}`,
                "REVOKED",
                "EX",
                tokenLife.remainingSeconds
            );
            
            if (!blacklisted) {
                throw new Error("Failed to blacklist token in Redis");
            }
        }

        // 4. CRITICAL FIX: Actually send a success response to the client
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        logError('logout controller', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}