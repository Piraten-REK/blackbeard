"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rssFeeds = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
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
exports.rssFeeds = (0, sqlite_core_1.sqliteTable)('last_rss_feed_items', {
    feed: (0, sqlite_core_1.text)('feed').notNull().primaryKey(),
    uids: (0, sqlite_core_1.text)('uids', { mode: 'json' }).$type().notNull().default([])
});
//# sourceMappingURL=schema.js.map