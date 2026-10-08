import type {Request,Response} from 'express'
import type { ApiResponse } from '../../types/api-response.types.js';
import { logError } from '../../utils/logs.util.js';
import { DB } from '../../config/dbConnect.js';
import { userTable } from '../../db/schemas/user.schema.js';
import { generateHash, verifyHash } from '../../utils/bcrypt.utils.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/token.utils.js';
import { eq } from 'drizzle-orm';
import { sessionTable } from '../../db/schemas/session.schema.js';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../constants/regex.const.js';

interface LoginUserBody
{
    email : string,
    password : string
}

export async function login(req:Request<null,null,LoginUserBody>,res:Response<ApiResponse>)
{
    try {
        console.log("called")
        const {email,password} = req.body

        if(!email || !password)
        {
            return res.status(400).json({
                success : false,
                message : "Required fields are missing"
            })
        }

        // handle the validation error 
        if(!PASSWORD_REGEX.test(password))
        {
            return res.status(400).json({
                success : false,
                message : "Validation Failed",
                error : [
                    'password must be atleast 8 character and that must incldue the one uppercase, lowercase and special character'
                ]
            })
        }
        if(!EMAIL_REGEX.test(email))
        {
            return res.status(400).json({
                success : false,
                message : "Validation failed",
                error : [
                    'email is not valid'
                ]
            })
        }

        const user = (await DB.getInstance().select().from(userTable).where(eq(userTable.email,email)))[0]

        if(!user)
        {
            return res.status(400).json({
                success : false,
                message : "User does not exist"
            })
        }
        
        const isPasswordMatch = user.passwordHash && verifyHash(user.passwordHash,password)

        if(!isPasswordMatch)
        {
            return res.status(401).json({
                success : false,
                message : 'Invalid email or password'
            })
        }

        // handle the access and refresh token
        const refreshToken = generateRefreshToken({
            userId : user.id
        })
        // create an session
        const session = (await DB.getInstance().insert(sessionTable).values({
            userId : user.id,
            refreshTokenHash : await generateHash(refreshToken),
        }).returning({
            id : sessionTable.id
        }))[0]

        if(!session)
        {
            throw new Error("Fail to create an session")
        }

        const accessToken = generateAccessToken({
            userId : user.id,
            sessionId : session.id
        })

        // return the response
        return res.status(200).json({
            success : true,
            message : "User Loggedin",
            data : {
                fullName : user.fullName,
                email : user.email,
                avatarURL : user.avatarURL,
                createdAt : user.createdAt,
                accessToken,
                refreshToken
            }
        })
        
    } catch (error) {
        logError('login controller',error)
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })        
    }
}