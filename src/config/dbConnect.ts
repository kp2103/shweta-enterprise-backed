import {drizzle, NodePgDatabase} from 'drizzle-orm/node-postgres'
import { env } from "./env.js";
import { logError, logInfo } from '../utils/logs.util.js';

export class DB{
    private static instance:NodePgDatabase;

    private constructor() {}

    static getInstance() : NodePgDatabase
    {
        if(!this.instance)
        {
            try {
                this.instance = drizzle(env.DB_URL)     
                if(!this.instance)
                    throw new Error("Fail to create an db connection")
                
                logInfo('db connection','DB connected Successfully')
            } catch (error) {
                logError('db connect',error)
                process.exit(1)
            }
        }
        return this.instance;
    }

}