import { boolean, pgTable,varchar,uuid, timestamp } from 'drizzle-orm/pg-core'
import { userTable } from './user.schema.js'

export const sessionTable = pgTable('sessions',{
    id : uuid('id').defaultRandom().primaryKey(),
    userId : uuid('user_id').notNull().unique().references(()=> userTable.id,{onDelete : 'cascade'}),
    refreshTokenHash : varchar('refresh_token_hash',{length : 255}).notNull(),
    isRevoked : boolean('is_revoked').default(false).notNull(),
    createdAt : timestamp('created_at').defaultNow().notNull(),
    expiresAt : timestamp('expires_at').default(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
})