"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configSchema = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const zod_1 = require("zod");
const configPath = path_1.default.resolve(__dirname, '../config.json');
const configJson = JSON.parse(fs_1.default.readFileSync(configPath, { encoding: 'utf8' }));
exports.configSchema = zod_1.z.object({
    feeds: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string().min(1),
        url: zod_1.z.string().url(),
        idKey: zod_1.z.string().min(1)
    })),
    interval: zod_1.z.number().min(30).max(1440).default(600),
    token: zod_1.z.string().length(72),
    rssChannels: zod_1.z.array(zod_1.z.string().min(0)),
    logfile: zod_1.z.string().default('blackbeard.log')
});
const config = exports.configSchema.parse(configJson);
exports.default = config;
//# sourceMappingURL=config.js.map