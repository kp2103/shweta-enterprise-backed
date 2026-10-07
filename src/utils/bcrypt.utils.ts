import bcrypt from 'bcrypt'

const SALT = 10

export async function generateHash(plainText : string)
{
    const hash = await bcrypt.hash(plainText,SALT)
    return hash
}

export async function verifyHash(plainText : string,hashText : string)
{
    const result = await bcrypt.compare(plainText,hashText)
    return result
}