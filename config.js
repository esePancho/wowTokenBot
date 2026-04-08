require("dotenv").config();

module.exports = {
    botToken: process.env.BOT_TOKEN,
    channelId: process.env.CHANNEL_ID,
    blizzardClientId: process.env.BLIZZARD_CLIENT_ID,
    blizzardSecret: process.env.BLIZZARD_CLIENT_SECRET,
    webhookUrl: process.env.WEBHOOK_URL,
};