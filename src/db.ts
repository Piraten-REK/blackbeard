import { drizzle } from 'drizzle-orm/libsql'

const db = drizzle('file:data.sqlite')

export default db
