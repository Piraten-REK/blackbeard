"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const discord_js_1 = require("discord.js");
const rssDump_1 = __importDefault(require("./rssDump"));
const logger_1 = __importDefault(require("./logger"));
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
const channels = [];
const looped = () => {
    (0, rssDump_1.default)().then(messages => {
        for (const channel of channels) {
            for (const msg of messages) {
                void channel.send(msg);
            }
        }
    }).catch(err => console.error(err));
};
client.once(discord_js_1.Events.ClientReady, readyClient => {
    logger_1.default.debug(`Ready! Logged in as ${readyClient.user.tag}`);
    for (const channelId of config_1.default.rssChannels) {
        const channel = readyClient.channels.cache.get(channelId);
        if (channel == null) {
            logger_1.default.warn(`Channel with id "${channelId}" not found.`);
            continue;
        }
        if (!channel.isSendable()) {
            logger_1.default.warn(`Channel with id "${channelId}" not sendable.`);
            continue;
        }
        channels.push(channel);
    }
    looped();
    setInterval(looped, config_1.default.interval * 1000);
});
void client.login(config_1.default.token);
//# sourceMappingURL=app.js.map