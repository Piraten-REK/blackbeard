import Parser from 'rss-parser'
import { z } from 'zod'
import feedConfig from '../config.json'

const configSchema = z.array(z.object({
  title: z.string().min(1),
  url: z.string().url()
}))

const feedData = configSchema.parse(feedConfig)

const parser = new Parser()

Promise.all(
  feedData.map(async feed => await parser.parseURL(feed.url))
).then(feeds => {
  for (const feed of feeds) {
    console.log(feed.items[0])
  }
})
