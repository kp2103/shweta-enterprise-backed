import { config } from 'dotenv';
import { logError } from '../utils/logs.util.js';

config();


if(!process.env.JWT_SECRET)
{
  logError('Config env','JWT SECRET is missing')
  process.exit(1)
}

if(!process.env.DB_URL)
{
  logError('config env','DB_URL is not exist')
  process.exit(1)
}

if(!process.env.REDIS_CLI)
{
  logError('config env','Redis_CLI is not exist')
  process.exit(1)
}

if(!process.env.CLOUDINARY_CLOUD_NAME)
{
  logError('config env','CLOUDINARY_CLOUD_NAME is not exist')
  process.exit(1)
}


if(!process.env.CLOUDINARY_API_KEY)
{
  logError('config env','CLOUDINARY_API_KEY is not exist')
  process.exit(1)
}

if(!process.env.CLOUDINARY_API_SECRET)
{
  logError('config env','CLOUDINARY_API_SECRET is not exist')
  process.exit(1)
}

if(!process.env.CLOUDINARY_FOLDER_NAME)
{
  logError('config env','CLOUDINARY_FOLDER_NAME is not exist')
  process.exit(1)
}


export const env = {
  PORT: Number(process.env.PORT) || 5000,

  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET : process.env.JWT_SECRET,
  DB_URL : process.env.DB_URL,
  REDIS_CLI :  process.env.REDIS_CLI,
  CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER_NAME : process.env.CLOUDINARY_FOLDER_NAME
};
