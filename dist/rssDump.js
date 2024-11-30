"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const db_1 = __importDefault(require("./db"));
const schema_1 = require("./schema");
const drizzle_orm_1 = require("drizzle-orm");
const logger_1 = __importDefault(require("./logger"));
const parser = new rss_parser_1.default();
const fetchFeed = async (feedUrl) => await new Promise((resolve, reject) => {
    void parser.parseURL(feedUrl, (err, result) => {
        if (err != null) {
            reject(err);
            return;
        }
        resolve(result);
    });
});
const getNewFeedMsgs = async () => await Promise.all(config_1.default.feeds.map(async (feedConfig) => {
    let feed;
    try {
        feed = await fetchFeed(feedConfig.url);
    }
    catch (err) {
        logger_1.default.info('Error fetching RSS feed', err);
        return;
    }
    if (feed.items.length === 0) {
        return;
    }
    const [feedData] = await db_1.default
        .select({
        lastImported: schema_1.rssFeeds.uids
    })
        .from(schema_1.rssFeeds)
        .where((0, drizzle_orm_1.eq)(schema_1.rssFeeds.feed, feedConfig.url));
    if (feedData == null) {
        await db_1.default.insert(schema_1.rssFeeds).values({
            feed: feedConfig.url,
            uids: feed.items.map(it => it[feedConfig.idKey])
        })
            .then(rs => logger_1.default.debug(`Set initial data for RSS feed "${feedConfig.title}"`, rs))
            .catch(err => logger_1.default.error(err));
        return;
    }
    const messages = [];
    for (const item of feed.items) {
        const id = item[feedConfig.idKey];
        if (feedData.lastImported.includes(id)) {
            continue;
        }
        messages.push(`**[${feedConfig.title}] ${item.title ?? ''}**  \n${item.content ?? ''}  \n${item.link ?? ''}`);
    }
    await db_1.default.insert(schema_1.rssFeeds).values({
        feed: feedConfig.url,
        uids: feed.items.map(it => it[feedConfig.idKey])
    }).onConflictDoUpdate({
        target: schema_1.rssFeeds.feed,
        set: {
            uids: feed.items.map(it => it[feedConfig.idKey])
        }
    })
        .then(rs => logger_1.default.info(`Set new data for RSS feed "${feedConfig.title}"`, rs))
        .catch(err => logger_1.default.error(err));
    return messages;
})).then(msgs => msgs.filter(Boolean).flat());
exports.default = getNewFeedMsgs;
//# sourceMappingURL=rssDump.js.map