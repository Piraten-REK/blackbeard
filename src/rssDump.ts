import config from './config'
import Parser from 'rss-parser'
import db from './db'
import { rssFeeds } from './schema'
import { eq } from 'drizzle-orm'
import logger from './logger'

const parser = new Parser()

const fetchFeed = async (feedUrl: string): Promise<Parser.Output<Record<string, unknown>>> => await new Promise((resolve, reject) => {
  void parser.parseURL(feedUrl, (err, result) => {
    if (err != null) {
      reject(err)
      return
    }
    resolve(result)
  })
})

const getNewFeedMsgs = async (): Promise<string[]> => await Promise.all(
  config.feeds.map(async feedConfig => {
    let feed: Parser.Output<Record<string, unknown>>
    try {
      feed = await fetchFeed(feedConfig.url)
    } catch (err) {
      logger.info('Error fetching RSS feed', err)
      return
    }

    if (feed.items.length === 0) {
      return
    }

    const [feedData] = await db
      .select({
        lastImported: rssFeeds.uids
      })
      .from(rssFeeds)
      .where(eq(rssFeeds.feed, feedConfig.url))

    if (feedData == null) {
      await db.insert(rssFeeds).values({
        feed: feedConfig.url,
        uids: feed.items.map(it => it[feedConfig.idKey] as string)
      })
        .then(rs => logger.debug(`Set initial data for RSS feed "${feedConfig.title}"`, rs))
        .catch(err => logger.error(err))
      return
    }

    const messages: string[] = []

    for (const item of feed.items) {
      const id = item[feedConfig.idKey] as string

      if (feedData.lastImported.includes(id)) {
        continue
      }

      messages.push(`**[${feedConfig.title}] ${item.title ?? ''}**  \n${item.content ?? ''}  \n${item.link ?? ''}`)
    }

    await db.insert(rssFeeds).values({
      feed: feedConfig.url,
      uids: feed.items.map(it => it[feedConfig.idKey] as string)
    }).onConflictDoUpdate({
      target: rssFeeds.feed,
      set: {
        uids: feed.items.map(it => it[feedConfig.idKey] as string)
      }
    })
      .then(rs => logger.info(`Set new data for RSS feed "${feedConfig.title}"`, rs))
      .catch(err => logger.error(err))

    return messages
  })
).then(msgs => msgs.filter(Boolean).flat())

export default getNewFeedMsgs
