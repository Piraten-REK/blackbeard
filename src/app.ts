import config from './config'
import { Client, Events, GatewayIntentBits, type SendableChannels } from 'discord.js'
import getRssFeedMessages from './rssDump'
import logger from './logger'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const channels: SendableChannels[] = []

const looped = (): void => {
  getRssFeedMessages().then(messages => {
    for (const channel of channels) {
      for (const msg of messages) {
        void channel.send(msg)
      }
    }
  }).catch(err => console.error(err))
}

client.once(Events.ClientReady, readyClient => {
  logger.debug(`Ready! Logged in as ${readyClient.user.tag}`)

  for (const channelId of config.rssChannels) {
    const channel = readyClient.channels.cache.get(channelId)

    if (channel == null) {
      logger.warn(`Channel with id "${channelId}" not found.`)
      continue
    }
    if (!channel.isSendable()) {
      logger.warn(`Channel with id "${channelId}" not sendable.`)
      continue
    }

    channels.push(channel)
  }

  looped()
  setInterval(looped, config.interval * 1000)
})

void client.login(config.token)
