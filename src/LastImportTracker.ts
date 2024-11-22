import path from 'path'
import fs from 'fs'

export default class LastImportTracker {
  static #instance: LastImportTracker | null = null
  static lastImportPath = path.resolve(__dirname, '../lastImport.json')

  // @ts-expect-error
  #data: Map<string, string>

  constructor () {
    if (LastImportTracker.#instance != null) {
      return LastImportTracker.#instance
    }

    this.#data = new Map(Object.entries(this.#setUp))

    LastImportTracker.#instance = this
  }

  #setUp (): Record<string, string> {
    const buffer = fs.readFileSync(LastImportTracker.lastImportPath)
    const string = buffer.toString('utf-8')
    const json = JSON.parse(string)

    return json
  }

  getLastImport (feedLink: string): string | null {
    return this.#data.get(feedLink) ?? null
  }

  async setLastImport (feedLink: string, uid: string): Promise<void> {
    if (this.#data.get(feedLink) === uid) {
      return
    }

    this.#data.set(feedLink, uid)

    fs.writeFileSync(
      LastImportTracker.lastImportPath,
      JSON.stringify(Object.fromEntries(this.#data.entries())),
      'utf-8'
    )
  }
}
