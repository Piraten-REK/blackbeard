import Parser from 'rss-parser'
import { z } from 'zod'
import LastImportTracker from './LastImportTracker'
import path from 'path'
import fs from 'fs'
import { Client, Events, GatewayIntentBits } from 'discord.js'

const configPath = path.resolve(__dirname, '../config.json')
const configJson = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' }))

const configSchema = z.object({
  feeds: z.array(z.object({
    title: z.string().min(1),
    url: z.string().url(),
    idKey: z.string().min(1)
  })),
  interval: z.number().min(30).max(1440).default(600),
  token: z.string().length(72)
})

const config = configSchema.parse(configJson)

const parser = new Parser()

const tracker = new LastImportTracker()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.login(config.token)
  .then(val => console.log(val))
  .catch(err => console.error(err))

function doIt (): void {
  Promise.all(config.feeds.map(async feedConf => {
    const feed = await parser.parseURL(feedConf.url)

    if (feed.items.length === 0) {
      return
    }

    const lastImported = tracker.getLastImport(feedConf.url)

    let idx = 0
    let item = feed.items[0]
    let iterate = lastImported !== null && idx < feed.items.length && item[feedConf.idKey] !== lastImported

    console.log(item)

    while (iterate) {
      console.log(`[${feedConf.title}] ${item.title ?? ''}<br>${item.content ?? ''}<br>${item.link ?? ''}`)

      item = feed.items[++idx]
      iterate = idx < feed.items.length && item[feedConf.idKey] !== lastImported
    }

    void tracker.setLastImport(feedConf.url, item[feedConf.idKey])
  })).catch(err => {
    console.log(err)
  })
}

doIt()
setInterval(doIt, config.interval * 1000)
