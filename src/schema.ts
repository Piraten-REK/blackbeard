import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

// const date = customType<{ data: Date, driverData: number, config: {} }>({
//   dataType (): 'INTEGER' {
//     return 'INTEGER'
//   },
//   toDriver (value) {
//     return value.getTime() / 1000
//   },
//   fromDriver (value) {
//     return new Date(value * 1000)
//   }
// })

export const rssFeeds = sqliteTable('last_rss_feed_items', {
  feed: text('feed').notNull().primaryKey(),
  uids: text('uids', { mode: 'json' }).$type<string[]>().notNull().default([])
})
