"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libsql_1 = require("drizzle-orm/libsql");
const db = (0, libsql_1.drizzle)('file:data.sqlite');
exports.default = db;
//# sourceMappingURL=db.js.map