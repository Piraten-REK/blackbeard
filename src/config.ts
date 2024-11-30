import path from 'path'
import fs from 'fs'
import { z } from 'zod'

const configPath = path.resolve(__dirname, '../config.json')
const configJson = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' }))

export const configSchema = z.object({
  feeds: z.array(z.object({
    title: z.string().min(1),
    url: z.string().url(),
    idKey: z.string().min(1)
  })),
  interval: z.number().min(30).max(1440).default(600),
  token: z.string().length(72),
  rssChannels: z.array(
    z.string().min(0)
  ),
  logfile: z.string().default('blackbeard.log')
})

const config = configSchema.parse(configJson)

export default config
