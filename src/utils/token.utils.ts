import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export interface AccessTokenPayload extends jwt.JwtPayload
{
    userId : string,
    sessionId : string
}

export interface RefreshTokenPayload extends jwt.JwtPayload{
    userId : string
}

export function generateAccessToken(payload:AccessTokenPayload)
{
    const accessToken = jwt.sign(payload,env.JWT_SECRET,{
        expiresIn : '15m'
    })
    return accessToken;
}

export function generateRefreshToken(payload : RefreshTokenPayload)
{
    const refreshToken = jwt.sign(payload,env.JWT_SECRET,{
        expiresIn : '7d'
    })

    return refreshToken
}

export function verifyAccessToken(accessToken : string)
{
    const result = jwt.verify(accessToken,env.JWT_SECRET) as AccessTokenPayload
    return result;
}

export function verifyRefreshToken(refreshToken:string)
{
    const result = jwt.verify(refreshToken,env.JWT_SECRET) as RefreshTokenPayload
    return result;
}
