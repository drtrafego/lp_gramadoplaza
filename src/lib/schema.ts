import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core'

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: text('name').notNull(),
  email: text('email'),
  whatsapp: text('whatsapp'),
  organization_id: text('organization_id').notNull(),
  status: text('status').notNull(),
  position: integer('position').notNull(),
  utm_source: text('utm_source'),
  utm_medium: text('utm_medium'),
  utm_campaign: text('utm_campaign'),
  utm_term: text('utm_term'),
  utm_content: text('utm_content'),
  created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
})

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
